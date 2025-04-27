import { Injectable, Logger, OnModuleInit, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Rental, Email } from '@app/commonn';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { catchError, lastValueFrom } from 'rxjs';

interface RoomDocument {
  _id: string;
  roomNumber: string;
  price: number;
  area: number;
  images?: string[];
  depositDate?: Date;
  depositPrice: number;
  maxTenants: number;
  isEmpty: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface TenantDocument {
  _id: string;
  name: string;
  email: string;
  phone: string;
  roomId: string;
  isLeadRoom: boolean;
  identityNumber: string;
  permanentAddress: string;
  holdingDepositPrice: number;
  depositDate?: Date;
  startDate: Date;
  birthday: Date;
  gender: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface FeeDocument {
  type: string;
  amount: number;
  reading: number;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

interface InvoiceDocument {
  _id: string;
  roomId: string;
  month: string;
  fees: FeeDocument[];
  total: number;
  dueDate: string;
  isPaid: boolean;
  paidAt: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ServiceDocument {
  name: string;
  value: any;
  description: string;
  type: string;
  unit: string;
}

interface RoomServiceDocument {
  _id: string;
  roomId: string;
  serviceName: string;
  quantity: number;
  customPrice: number | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface AssetDocument {
  name: string;
  value: number;
  unit: string;
  createdAt: Date;
  updatedAt: Date;
}

interface RoomAssetDocument {
  _id: string;
  roomId: string;
  assetName: string;
  quantity: number;
  customPrice: number | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface TransactionDocument {
  _id: string;
  category: 'income' | 'expense';
  type: string;
  amount: number;
  description: string;
  relatedTo: string | null;
  createdBy: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface ReadingData {
  [key: string]: number;
}

@Injectable()
export class RentalService implements OnModuleInit {
  private readonly logger = new Logger(RentalService.name);
  private emailService: Email.EmailServiceClient;

  constructor(
    @InjectModel('Room') private readonly roomModel: Model<RoomDocument>,
    @InjectModel('Tenant') private readonly tenantModel: Model<TenantDocument>,
    @InjectModel('Invoice') private readonly invoiceModel: Model<InvoiceDocument>,
    @InjectModel('Service') private readonly serviceModel: Model<ServiceDocument>,
    @InjectModel('RoomService') private readonly roomServiceModel: Model<RoomServiceDocument>,
    @InjectModel('Asset') private readonly assetModel: Model<AssetDocument>,
    @InjectModel('RoomAsset') private readonly roomAssetModel: Model<RoomAssetDocument>,
    @InjectModel('Transaction') private readonly transactionModel: Model<TransactionDocument>,
    @Inject(Email.EMAIL_PACKAGE_NAME) private readonly client: ClientGrpc,
    private configService: ConfigService,
    private schedulerRegistry: SchedulerRegistry,
    private httpService: HttpService,
  ) {
    // Khởi tạo client để kết nối với email service
    this.emailService = this.client.getService<Email.EmailServiceClient>(
      Email.EMAIL_SERVICE_NAME,
    );
  }

  async onModuleInit() {
    await this.initializeDefaultServices();
  }

  // ***** SERVICE MANAGEMENT *****

  /**
   * Khởi tạo các cấu hình dịch vụ mặc định khi service được khởi động
   */
  private async initializeDefaultServices() {
    try {
      const defaultServices = [
        { 
          name: 'ELECTRICITY_PRICE', 
          value: 3500, 
          description: 'Giá điện (VND/kWh)',
          type: 'CONFIG',
          unit: 'VND/kWh',
        },
        { 
          name: 'WATER_PRICE', 
          value: 15000, 
          description: 'Giá nước (VND/m³)',
          type: 'CONFIG',
          unit: 'VND/m³',
        },
        { 
          name: 'INVOICE_GENERATION_DAY', 
          value: '28', 
          description: 'Ngày trong tháng để gửi hóa đơn (1-31)',
          type: 'CONFIG',
          unit: 'day',
        },
        {
          name: 'INVOICE_DUE_DAYS',
          value: 7,
          description: 'Số ngày để thanh toán hóa đơn sau khi gửi',
          type: 'CONFIG',
          unit: 'day',
        },
        {
          name: 'AUTO_SEND_INVOICE',
          value: true,
          description: 'Tự động gửi hóa đơn khi đến ngày được cấu hình',
          type: 'CONFIG',
          unit: ''
        }
      ];
      
      for (const service of defaultServices) {
        const exists = await this.serviceModel.findOne({ name: service.name }).exec();
        if (!exists) {
          const newService = new this.serviceModel({
            name: service.name,
            value: service.value,
            description: service.description,
            type: service.type,
            unit: service.unit
          });
          await newService.save();
          this.logger.log(`Đã khởi tạo dịch vụ mặc định: ${service.name} = ${service.value}`);
        }
      }
    } catch (error) {
      this.logger.error(`Lỗi khởi tạo dịch vụ mặc định: ${error.message}`, error.stack);
    }
  }

  /**
   * Lấy giá trị của một dịch vụ theo tên
   */
  async getService(name: string): Promise<Rental.ServiceResponse> {
    const service = await this.serviceModel.findOne({ name }).exec();
    if (!service) {
      throw new RpcException({
        statusCode: 404,
        message: `Không tìm thấy dịch vụ ${name}`,
      });
    }
    return this.mapToService(service);
  }

  /**
   * Lưu giá trị của một dịch vụ
   */
  async saveService(SaveServiceRequest: Rental.SaveServiceRequest): Promise<Rental.ServiceResponse> {
    try {
      const { name, value, description, type, unit } = SaveServiceRequest;
      const service = await this.serviceModel.findOne({ name }).exec();
      
      if (!service) {
        // Nếu dịch vụ không tồn tại, tạo mới
        const newService = new this.serviceModel({
          name,
          value,
          description: description || '',
          type: type || 'CONFIG',
          unit: unit
        });
        await newService.save();
        this.logger.log(`Đã tạo mới dịch vụ ${name}`);

        return this.mapToService(newService);
      }

      // Cập nhật service
      service.value = value;
      service.description = description || service.description;
      if (type) service.type = type;
      if (unit !== undefined) service.unit = unit;
      await service.save();

      this.logger.log(`Đã lưu dịch vụ ${name}`);
      return this.mapToService(service);
    } catch (error) {
      this.logger.error(`Lỗi lưu dịch vụ ${SaveServiceRequest.name}: ${error.message}`, error.stack);
      throw new RpcException({
        statusCode: 500,
        message: `Lỗi lưu dịch vụ: ${error.message}`,
      });
    }
  }

  /**
   * Lấy tất cả các dịch vụ
   */
  async getAllServices(): Promise<Rental.AllServicesResponse> {
    try {
      const services = await this.serviceModel.find().exec();
      return {
        services: services.map(this.mapToService)
      };
    } catch (error) {
      this.logger.error(`Lỗi lấy tất cả dịch vụ: ${error.message}`, error.stack);
      throw new RpcException({
        statusCode: 500,
        message: `Lỗi lấy tất cả dịch vụ: ${error.message}`,
      });
    }
  }

  async removeService(name: string): Promise<Rental.ServiceResponse> {
    try {
      const service = await this.serviceModel.findOneAndDelete({ name }).exec();
      
      if (!service) {
        throw new RpcException({
          statusCode: 404,
          message: `Không tìm thấy dịch vụ ${name}`,
        });
      }
  
      this.logger.log(`Đã xóa dịch vụ: ${name}`);
      return this.mapToService(service);
    } catch (error) {
      this.logger.error(`Lỗi xóa dịch vụ ${name}: ${error.message}`, error.stack);
      throw new RpcException({
        statusCode: error.statusCode || 500,
        message: error.message || `Lỗi xóa dịch vụ: ${error.message}`,
      });
    }
  }

  // ***** INVOICE AUTOMATION *****

  /**
   * Chạy định kỳ mỗi ngày vào lúc 00:01 để kiểm tra xem có phải là ngày gửi hóa đơn không
   */
  @Cron('1 0 * * *')
  async checkAndGenerateInvoices() {
    try {
      // Kiểm tra cấu hình có bật tự động gửi không
      const autoSend = await this.getService('AUTO_SEND_INVOICE');
      if (!autoSend) {
        this.logger.log('Chức năng tự động gửi hóa đơn đang bị tắt');
        return;
      }
      
      // Lấy ngày gửi hóa đơn từ cấu hình
      const invoiceDay = await this.getService('INVOICE_GENERATION_DAY');
      if (!invoiceDay) {
        this.logger.warn('Chưa cấu hình ngày gửi hóa đơn');
        return;
      }
      
      const today = new Date();
      // Kiểm tra xem hôm nay có phải là ngày gửi hóa đơn không
      const { value } = invoiceDay;
      if (today.getDate() === parseInt(value)) {
        this.logger.log('Bắt đầu quy trình tạo và gửi hóa đơn tự động');
        await this.generateAndSendInvoices();
      } else {
        this.logger.debug(
          `Hôm nay không phải là ngày gửi hóa đơn. Ngày hiện tại: ${today.getDate()}, Ngày cấu hình: ${invoiceDay}`
        );
      }
    } catch (error) {
      this.logger.error(`Lỗi kiểm tra lịch gửi hóa đơn: ${error.message}`, error.stack);
    }
  }

  /**
   * Tạo và gửi hóa đơn cho tất cả các phòng đang có người thuê
   */
  async generateAndSendInvoices() {
    try {
      this.logger.log('Đang tạo và gửi hóa đơn cho tất cả phòng...');
      
      // 1. Lấy tất cả phòng đang có người thuê
      const rooms = await this.getAllOccupiedRooms();
      this.logger.log(`Tìm thấy ${rooms.length} phòng đang có người thuê`);
      
      // 2. Duyệt qua từng phòng và tạo/gửi hóa đơn
      for (const room of rooms) {
        await this.processRoomInvoice(room);
      }
      
      this.logger.log('Hoàn thành quy trình tạo và gửi hóa đơn');
      return {
        success: true,
        message: `Đã xử lý hóa đơn cho ${rooms.length} phòng`
      };
    } catch (error) {
      this.logger.error(`Lỗi tạo và gửi hóa đơn: ${error.message}`, error.stack);
      return {
        success: false,
        message: `Lỗi tạo và gửi hóa đơn: ${error.message}`
      };
    }
  }

  /**
   * Khởi động thủ công quy trình tạo và gửi hóa đơn
   */
  async manuallyTriggerInvoiceGeneration() {
    this.logger.log('Kích hoạt thủ công quy trình tạo và gửi hóa đơn');
    return await this.generateAndSendInvoices();
  }

  /**
   * Lấy tất cả các phòng đang có người thuê
   */
  private async getAllOccupiedRooms(): Promise<RoomDocument[]> {
    try {
      // Lấy tất cả phòng không trống
      const rooms = await this.roomModel.find({ isEmpty: false }).exec();
      return rooms;
    } catch (error) {
      this.logger.error(`Lỗi lấy danh sách phòng đang có người thuê: ${error.message}`, error.stack);
      throw new Error('Không thể lấy danh sách phòng');
    }
  }

  /**
   * Xử lý tạo và gửi hóa đơn cho một phòng
   */
  private async processRoomInvoice(room: RoomDocument) {
    try {
      this.logger.log(`Đang xử lý hóa đơn cho phòng ${room.roomNumber}`);
      
      // 1. Lấy thông tin người thuê chính trong phòng
      const leadTenant = await this.tenantModel.findOne({
        roomId: room._id,
        isLeadRoom: true,
        isActive: true
      }).exec();
      
      if (!leadTenant) {
        this.logger.warn(`Không tìm thấy người thuê chính cho phòng ${room.roomNumber}`);
        throw new Error('Không tìm thấy người thuê chính cho phòng');
      }
      
      this.logger.log(`Tìm thấy người thuê chính: ${leadTenant.name}, email: ${leadTenant.email}`);
      
      // 2. Lấy số đọc điện nước mới nhất và tính toán
      const currentDate = new Date();
      const month = `${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
      const formattedMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
      
      // Lấy thông tin đồng hồ mới nhất cho phòng hiện tại
      const meterData = await this.getLatestReadingsForRoom(room.roomNumber, formattedMonth);
      
      // 3. Lấy cấu hình giá điện nước
      const electricityService = await this.getService('ELECTRICITY_PRICE') || null;
      const { value: electricityPrice } = electricityService;
      const waterService = await this.getService('WATER_PRICE') || null;
      const { value: waterPrice } = waterService;
      
      // 4. Tạo thông tin hóa đơn
      // Số ngày để thanh toán sau khi nhận hóa đơn
      const dueDayService = await this.getService('INVOICE_DUE_DAYS') || null;
      const { value: dueDays } = dueDayService;
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + parseInt(dueDays.toString()));
      
      // Tạo danh sách khoản phí
      const fees: FeeDocument[] = [];
      
      // Thêm phí phòng
      fees.push({
        type: 'room',
        amount: room.price,
        reading: 0,
        description: `Tiền thuê phòng tháng ${month}`,
        createdAt: currentDate,
        updatedAt: currentDate
      });
      
      // Lấy số đọc tháng trước
      const previousMeterData = this.findLatestReadings(room._id);
      
      // Thêm phí điện nếu có số đọc
      if (meterData && meterData.electricity !== undefined) {
        const previousElectricity = previousMeterData["Điện"] || 0;
        const consumption = meterData.electricity - previousElectricity;
        
        if (consumption > 0) {
          fees.push({
            type: 'electricity',
            amount: consumption * +electricityPrice,
            reading: meterData.electricity,
            description: `Tiền điện: ${consumption} kWh x ${electricityPrice}đ = ${consumption * +electricityPrice}đ`,
            createdAt: currentDate,
            updatedAt: currentDate
          });
        }
      }
      
      // Thêm phí nước nếu có số đọc
      if (meterData && meterData.water !== undefined) {
        const previousWater = previousMeterData["Nước"] || 0;
        const consumption = meterData.water - previousWater;
        
        if (consumption > 0) {
          fees.push({
            type: 'water',
            amount: consumption * +waterPrice,
            reading: meterData.water,
            description: `Tiền nước: ${consumption} khối x ${waterPrice}đ = ${consumption * +waterPrice}đ`,
            createdAt: currentDate,
            updatedAt: currentDate
          });
        }
      }
      
      // Lấy danh sách các dịch vụ đã đăng ký của phòng
      const roomServices = await this.roomServiceModel.find({
        roomId: room._id,
        isActive: true
      }).exec();
      
      // Duyệt qua các dịch vụ đã đăng ký
      for (const roomService of roomServices) {
        const service = await this.serviceModel.findOne({ name: roomService.serviceName }).exec();
        
        // Kiểm tra xem dịch vụ có phải loại FEE không
        if (service && service.type === 'FEE') {
          // Tính toán số tiền dựa theo số lượng và giá
          const price = roomService.customPrice || (roomService.quantity * service.value);
          
          fees.push({
            type: service.name,
            amount: price,
            reading: 0,
            description: `${service.description}: ${roomService.quantity} x ${service.value}đ = ${price}đ`,
            createdAt: currentDate,
            updatedAt: currentDate
          });
        }
      }
      
      // Tính tổng tiền
      const total = fees.reduce((sum, fee) => sum + fee.amount, 0);
      
      // 5. Tạo hóa đơn trong database
      const rentalFees = fees.map(fee => ({
        type: fee.type,
        amount: fee.amount,
        reading: fee.reading,
        description: fee.description,
        createdAt: fee.createdAt.toISOString(),
        updatedAt: fee.updatedAt.toISOString()
      }));

      const invoiceData = {
        roomId: room._id.toString(),
        month: formattedMonth,
        fees: rentalFees,
        total: total,
        dueDate: dueDate.toISOString(),
        isPaid: false
      };
      const invoice = await this.createInvoice(invoiceData);
      // 6. Gửi email hóa đơn đến người thuê chính
      try {
        const emailResponse = await firstValueFrom(
          this.emailService.sendInvoiceEmail({
            to: leadTenant.email,
            tenantName: leadTenant.name,
            roomNumber: room.roomNumber,
            month: month,
            dueDate: dueDate.toLocaleDateString('vi-VN'),
            total: total,
            fees: rentalFees
          })
        );
        
        this.logger.log(`Đã gửi email hóa đơn thành công đến ${leadTenant.email}`);
          return {
            success: true,
            invoice: invoice,
            emailSent: true,
            emailId: emailResponse.messageId
          };
      } catch (error) {
        this.logger.error(`Lỗi gửi email hóa đơn: ${error.message}`, error.stack);
        return {
          success: true,
          invoice: invoice,
          emailSent: false,
          error: `Lỗi gửi email hóa đơn: ${error.message}`
        };
      }
    } catch (error) {
      this.logger.error(`Lỗi xử lý hóa đơn cho phòng ${room.roomNumber}: ${error.message}`, error.stack);
      throw new RpcException({
        statusCode: 500,
        message: `${error.message}`
      });
    }
  }

  /**
   * Lấy số đọc điện nước cho một phòng từ API gateway
   */
  private async getLatestReadingsForRoom(roomNumber: string, month: string) {
    try {
      const gatewayUrl = this.configService.get<string>('API_GATEWAY_URL') || 'http://localhost:3000';
      const url = `${gatewayUrl}/rental/meters?roomNumber=${roomNumber}&month=${month}`;
      
      this.logger.log(`Đang gọi API để lấy dữ liệu điện nước: ${url}`);
      
      const response = await lastValueFrom(
        this.httpService.get(url).pipe(
          catchError(error => {
            this.logger.error(`Lỗi gọi API meters: ${error.message}`);
            throw new Error(`Không thể lấy dữ liệu đồng hồ: ${error.message}`);
          })
        )
      );
      
      if (response.data && !response.data.message) {
        return {
          electricity: response.data.electricity,
          water: response.data.water
        };
      }
      
      this.logger.warn(`Không tìm thấy dữ liệu đồng hồ cho phòng ${roomNumber}, tháng ${month}`);
      return null;
    } catch (error) {
      this.logger.error(`Lỗi lấy dữ liệu đồng hồ: ${error.message}`, error.stack);
      return null;
    }
  }

  /**
   * Lấy tháng trước theo định dạng YYYY-MM
   */
  private getPreviousMonth(currentMonth: string): string {
    const [year, month] = currentMonth.split('-').map(Number);
    
    // Nếu là tháng 1 thì tháng trước là tháng 12 năm trước
    if (month === 1) {
      return `${year - 1}-12`;
    }
    
    // Ngược lại thì là tháng trước cùng năm
    return `${year}-${String(month - 1).padStart(2, '0')}`;
  }

  // Room Methods
  async createRoom(createRoomDto: Rental.CreateRoomDto): Promise<Rental.Room> {
    try {
      const existingRoom = await this.roomModel.findOne({ roomNumber: createRoomDto.roomNumber }).exec();
      if (existingRoom) {
        throw new RpcException({
          statusCode: 409,
          message: `Phòng với số ${createRoomDto.roomNumber} đã tồn tại`,
        });
      }

      const room = new this.roomModel(createRoomDto);
      room.isEmpty = true;
      await room.save();
      return this.mapToRoom(room);
    } catch (error) {
      this.logger.error(`Error creating room: ${error.message}`, error.stack);
      throw new RpcException({
        statusCode: error.statusCode || 500,
        message: error.message || 'Error creating room',
      });
    }
  }

  async findAllRoomsByFilter(findAllRoomsByFilterDto: Rental.FindAllRoomsByFilterDto): Promise<Rental.Rooms> {
    try {
      const { page, limit, isEmpty } = findAllRoomsByFilterDto;
      const skip = (page - 1) * limit;
      
      const filter: any = {};
      if (isEmpty) filter.isEmpty = isEmpty;
      const rooms = await this.roomModel.find(filter)
        .skip(skip)
        .limit(limit)
        .exec();
      
      const total = await this.roomModel.countDocuments(filter).exec();
      return { rooms: rooms.map(this.mapToRoom), total };
    } catch (error) {
      this.logger.error(`Error finding rooms: ${error.message}`, error.stack);
      throw new RpcException({
        statusCode: error.statusCode || 500,
        message: error.message || 'Error finding rooms',
      });
    }
  }

  async findOneRoom(findOneRoomDto: Rental.FindOneRoomDto): Promise<Rental.Room> {
    try {
      const room = await this.roomModel.findById(findOneRoomDto.id).exec();
      if (!room) {
        throw new RpcException({
          statusCode: 404,
          message: `Không tìm thấy phòng với id ${findOneRoomDto.id}`,
        });
      }
      return this.mapToRoom(room);
    } catch (error) {
      this.logger.error(`Error finding room: ${error.message}`, error.stack);
      throw new RpcException({
        statusCode: error.statusCode || 500,
        message: error.message || 'Error finding room',
      });
    }
  }

  async updateRoom(updateRoomDto: Rental.UpdateRoomDto): Promise<Rental.Room> {
    try {
      const room = await this.roomModel.findById(updateRoomDto.id).exec();
      if (!room) {
        throw new RpcException({
          statusCode: 404,
          message: `Không tìm thấy phòng với id ${updateRoomDto.id}`,
        });
      }

      if (updateRoomDto.roomNumber && updateRoomDto.roomNumber !== room.roomNumber) {
        const existingRoom = await this.roomModel.findOne({ roomNumber: updateRoomDto.roomNumber }).exec();
        if (existingRoom) {
          throw new RpcException({
            statusCode: 409,
            message: `Phòng với số ${updateRoomDto.roomNumber} đã tồn tại`,
          });
        }
      }

      Object.assign(room, updateRoomDto);
      room.updatedAt = new Date();
      await room.save();
      return this.mapToRoom(room);
    } catch (error) {
      this.logger.error(`Error updating room: ${error.message}`, error.stack);
      throw new RpcException({
        statusCode: error.statusCode || 500,
        message: error.message || 'Error updating room',
      });
    }
  }

  async removeRoom(findOneRoomDto: Rental.FindOneRoomDto): Promise<Rental.Room> {
    try {
      // Kiểm tra nếu phòng đang có người thuê
      const tenants = await this.tenantModel.findOne({ 
        roomId: findOneRoomDto.id,
        isActive: true
      }).exec();
      
      if (tenants) {
        throw new RpcException({
          statusCode: 400,
          message: `Không thể xóa phòng vì đang có người thuê`,
        });
      }

      const room = await this.roomModel.findByIdAndDelete(findOneRoomDto.id).exec();
      if (!room) {
        throw new RpcException({
          statusCode: 404,
          message: `Không tìm thấy phòng với id ${findOneRoomDto.id}`,
        });
      }
      return this.mapToRoom(room);
    } catch (error) {
      this.logger.error(`Error removing room: ${error.message}`, error.stack);
      throw new RpcException({
        statusCode: error.statusCode || 500,
        message: error.message || 'Error removing room',
      });
    }
  }

  // Tenant Methods
  async createTenant(createTenantDto: Rental.CreateTenantDto): Promise<Rental.Tenant> {
    try {
      // Kiểm tra nếu phòng tồn tại
      const room = await this.roomModel.findById(createTenantDto.roomId).exec();
      if (!room) {
        throw new RpcException({
          statusCode: 404,
          message: `Không tìm thấy phòng với id ${createTenantDto.roomId}`,
        });
      }

      // Kiểm tra nếu phòng đang trống
      if (!room.isEmpty && createTenantDto.isLeadRoom === true) {
        throw new RpcException({
          statusCode: 400,
          message: `Phòng ${room.roomNumber} đã có người thuê`,
        });
      }

      // Kiểm tra email tenant
      const emailCheck = await this.tenantModel.findOne({ email: createTenantDto.email })
      if (emailCheck) {
        throw new RpcException({
          statusCode: 400,
          message: `Email ${createTenantDto.email} đã tồn tại trong hệ thống`,
        });
      }

      const tenant = new this.tenantModel(createTenantDto);
      await tenant.save();

      // Cập nhật trạng thái phòng thành đã có người thuê
      room.isEmpty = false;
      await room.save();

      return this.mapToTenant(tenant);
    } catch (error) {
      this.logger.error(`Error creating tenant: ${error.message}`, error.stack);
      throw new RpcException({
        statusCode: error.statusCode || 500,
        message: error.message || 'Error creating tenant',
      });
    }
  }

  async findAllTenantsByFilter(findAllTenantsByFilterDto: Rental.FindAllTenantsByFilterDto): Promise<Rental.Tenants> {
    try {
      const { roomId, isLeadRoom, page, limit } = findAllTenantsByFilterDto;
      const skip = (page - 1) * limit;
      
      const filter: any = {};
      if (roomId) filter.roomId = roomId;
      if (isLeadRoom !== undefined) filter.isLeadRoom = isLeadRoom ? true : false;
      const tenants = await this.tenantModel.find(filter)
        .skip(skip)
        .limit(limit)
        .exec();
      
      const total = await this.tenantModel.countDocuments(filter).exec();
      return { tenants: tenants.map(this.mapToTenant), total };
    } catch (error) {
      this.logger.error(`Error finding tenants: ${error.message}`, error.stack);
      throw new RpcException({
        statusCode: error.statusCode || 500,
        message: error.message || 'Error finding tenants',
      });
    }
  }

  async findOneTenant(findOneTenantDto: Rental.FindOneTenantDto): Promise<Rental.Tenant> {
    try {
      const tenant = await this.tenantModel.findById(findOneTenantDto.id).exec();
      if (!tenant) {
        throw new RpcException({
          statusCode: 404,
          message: `Không tìm thấy người thuê với id ${findOneTenantDto.id}`,
        });
      }
      return this.mapToTenant(tenant);
    } catch (error) {
      this.logger.error(`Error finding tenant: ${error.message}`, error.stack);
      throw new RpcException({
        statusCode: error.statusCode || 500,
        message: error.message || 'Error finding tenant',
      });
    }
  }

  async updateTenant(updateTenantDto: Rental.UpdateTenantDto): Promise<Rental.Tenant> {
    try {
      const tenant = await this.tenantModel.findById(updateTenantDto.id).exec();
      if (!tenant) {
        throw new RpcException({
          statusCode: 404,
          message: `Không tìm thấy người thuê với id ${updateTenantDto.id}`,
        });
      }

      // Nếu thay đổi phòng, cần kiểm tra phòng mới
      if (updateTenantDto.roomId && updateTenantDto.roomId !== tenant.roomId) {
        const newRoom = await this.roomModel.findById(updateTenantDto.roomId).exec();
        if (!newRoom) {
          throw new RpcException({
            statusCode: 404,
            message: `Không tìm thấy phòng mới với id ${updateTenantDto.roomId}`,
          });
        }
        
        if (!newRoom.isEmpty && updateTenantDto.isLeadRoom === true) {
          throw new RpcException({
            statusCode: 400,
            message: `Phòng ${newRoom.roomNumber} đã có người thuê`,
          });
        }
        
        // Cập nhật phòng cũ thành trống và phòng mới thành đã có người thuê
        const oldRoom = await this.roomModel.findById(tenant.roomId).exec();
        if (oldRoom) {
          oldRoom.isEmpty = true;
          await oldRoom.save();
        }
        
        newRoom.isEmpty = false;
        await newRoom.save();
      }

      Object.assign(tenant, updateTenantDto);
      tenant.updatedAt = new Date();
      await tenant.save();
      
      return this.mapToTenant(tenant);
    } catch (error) {
      this.logger.error(`Error updating tenant: ${error.message}`, error.stack);
      throw new RpcException({
        statusCode: error.statusCode || 500,
        message: error.message || 'Error updating tenant',
      });
    }
  }

  async removeTenant(findOneTenantDto: Rental.FindOneTenantDto): Promise<Rental.Tenant> {
    try {
      const tenant = await this.tenantModel.findByIdAndDelete(findOneTenantDto.id).exec();
      if (!tenant) {
        throw new RpcException({
          statusCode: 404,
          message: `Không tìm thấy người thuê với id ${findOneTenantDto.id}`,
        });
      }
      
      // Kiểm tra nếu là người thuê duy nhất trong phòng thì cập nhật phòng thành trống
      const otherTenants = await this.tenantModel.findOne({ 
        roomId: tenant.roomId,
        isActive: true,
        _id: { $ne: findOneTenantDto.id }
      }).exec();
      
      if (!otherTenants) {
        const room = await this.roomModel.findById(tenant.roomId).exec();
        if (room) {
          room.isEmpty = true;
          await room.save();
        }
      }
      
      return this.mapToTenant(tenant);
    } catch (error) {
      this.logger.error(`Error removing tenant: ${error.message}`, error.stack);
      throw new RpcException({
        statusCode: error.statusCode || 500,
        message: error.message || 'Error removing tenant',
      });
    }
  }

  // Invoice Methods
  async createInvoice(createInvoiceDto: Rental.CreateInvoiceDto): Promise<Rental.Invoice> {
    try {
      // Kiểm tra nếu phòng tồn tại
      const room = await this.roomModel.findById(createInvoiceDto.roomId).exec();
      if (!room) {
        throw new RpcException({
          statusCode: 404,
          message: `Không tìm thấy phòng với id ${createInvoiceDto.roomId}`,
        });
      }

      // Kiểm tra nếu đã tồn tại hóa đơn cho phòng này trong tháng này
      const existingInvoice = await this.invoiceModel.findOne({
        roomId: createInvoiceDto.roomId,
        month: createInvoiceDto.month,
      }).exec();
      
      if (existingInvoice) {
        throw new RpcException({
          statusCode: 409,
          message: `Đã tồn tại hóa đơn cho phòng trong tháng ${createInvoiceDto.month}`,
        });
      }

      const processedFees = createInvoiceDto.fees.map(fee => ({
        ...fee,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      // Tính tổng từ fees
      const total = this.calculateTotalFromFees(processedFees);

      const invoice = new this.invoiceModel({
        ...createInvoiceDto,
        fees: processedFees,
        total, // Gán tổng đã tính
      });
      
      await invoice.save();
      return this.mapToInvoice(invoice);
    } catch (error) {
      this.logger.error(`Error creating invoice: ${error.message}`, error.stack);
      throw new RpcException({
        statusCode: error.statusCode || 500,
        message: error.message || 'Error creating invoice',
      });
    }
  }

  async findAllInvoicesByFilter(findAllInvoicesByFilterDto: Rental.FindAllInvoicesByFilterDto): Promise<Rental.Invoices> {
    try {
      const { page, limit, isPaid, roomId, month } = findAllInvoicesByFilterDto;
      const skip = (page - 1) * limit;
      
      const filter: any = {};
      if (isPaid) {
        filter.isPaid = isPaid === true;
      }
      if (roomId) filter.roomId = roomId;
      if (month) filter.month = month;
      
      const invoices = await this.invoiceModel.find(filter)
        .skip(skip)
        .limit(limit)
        .exec();
      
      const total = await this.invoiceModel.countDocuments(filter).exec();
      return { invoices: invoices.map(this.mapToInvoice), total };
    } catch (error) {
      this.logger.error(`Error finding invoices: ${error.message}`, error.stack);
      throw new RpcException({
        statusCode: error.statusCode || 500,
        message: error.message || 'Error finding invoices',
      });
    }
  }

  async findOneInvoice(findOneInvoiceDto: Rental.FindOneInvoiceDto): Promise<Rental.Invoice> {
    try {
      const invoice = await this.invoiceModel.findById(findOneInvoiceDto.id).exec();
      if (!invoice) {
        throw new RpcException({
          statusCode: 404,
          message: `Không tìm thấy hóa đơn với id ${findOneInvoiceDto.id}`,
        });
      }
      return this.mapToInvoice(invoice);
    } catch (error) {
      this.logger.error(`Error finding invoice: ${error.message}`, error.stack);
      throw new RpcException({
        statusCode: error.statusCode || 500,
        message: error.message || 'Error finding invoice',
      });
    }
  }

  async updateInvoice(updateInvoiceDto: Rental.UpdateInvoiceDto): Promise<Rental.Invoice> {
    try {
      const invoice = await this.invoiceModel.findById(updateInvoiceDto.id).exec();
      if (!invoice) {
        throw new RpcException({
          statusCode: 404,
          message: `Không tìm thấy hóa đơn với id ${updateInvoiceDto.id}`,
        });
      }

      // Nếu đang cập nhật trạng thái từ chưa thanh toán thành đã thanh toán
      const isPaidChanged = !invoice.isPaid && updateInvoiceDto.isPaid;
      const paidAt = isPaidChanged ? new Date().toISOString() : invoice.paidAt;

      // Xử lý fees nếu có
      const processedFees = updateInvoiceDto.fees 
        ? updateInvoiceDto.fees.map(fee => ({
            ...fee,
            updatedAt: new Date().toISOString(), // Chuyển thành chuỗi ISO string
            createdAt: fee.createdAt || new Date().toISOString(),
          }))
        : invoice.fees;

      // Tính lại tổng nếu fees đã thay đổi
      const total = updateInvoiceDto.fees 
        ? this.calculateTotalFromFees(processedFees) 
        : updateInvoiceDto.total || invoice.total;

      Object.assign(invoice, {
        ...updateInvoiceDto,
        fees: processedFees,
        total, // Gán tổng đã tính lại
        paidAt,
        updatedAt: new Date(),
      });
      
      await invoice.save();
      return this.mapToInvoice(invoice);
    } catch (error) {
      this.logger.error(`Error updating invoice: ${error.message}`, error.stack);
      throw new RpcException({
        statusCode: error.statusCode || 500,
        message: error.message || 'Error updating invoice',
      });
    }
  }

  async removeInvoice(findOneInvoiceDto: Rental.FindOneInvoiceDto): Promise<Rental.Invoice> {
    try {
      const invoice = await this.invoiceModel.findByIdAndDelete(findOneInvoiceDto.id).exec();
      if (!invoice) {
        throw new RpcException({
          statusCode: 404,
          message: `Không tìm thấy hóa đơn với id ${findOneInvoiceDto.id}`,
        });
      }
      return this.mapToInvoice(invoice);
    } catch (error) {
      this.logger.error(`Error removing invoice: ${error.message}`, error.stack);
      throw new RpcException({
        statusCode: error.statusCode || 500,
        message: error.message || 'Error removing invoice',
      });
    }
  }

  // Phương thức để lấy số đọc điện nước mới nhất theo roomId
  async findLatestReadings(roomId: string): Promise<ReadingData> {
    try {
      if (!roomId) {
        throw new RpcException({
          statusCode: 400,
          message: 'roomId là bắt buộc',
        });
      }

      // Tìm hóa đơn gần nhất của phòng (sắp xếp theo thời gian tạo giảm dần)
      const latestInvoice = await this.invoiceModel
        .findOne({ roomId })
        .sort({ createdAt: -1 })
        .exec();

      if (!latestInvoice) {
        // Nếu không có hóa đơn nào, trả về đối tượng rỗng
        return {};
      }

      // Khởi tạo đối tượng kết quả
      const readings: { [key: string]: number } = {};

      // Duyệt qua các khoản phí trong hóa đơn gần nhất để lấy các số đọc
      latestInvoice.fees.forEach(fee => {
        if (fee.reading !== undefined && fee.reading !== null) {
          readings[fee.type] = fee.reading;
        }
      });

      return readings;
    } catch (error) {
      this.logger.error(`Error finding latest readings: ${error.message}`, error.stack);
      throw new RpcException({
        statusCode: error.statusCode || 500,
        message: error.message || 'Error finding latest readings',
      });
    }
  }

  private calculateTotalFromFees(fees: FeeDocument[] | Rental.Fee[]): number {
    return fees.reduce((sum, fee) => sum + (fee.amount || 0), 0);
  }

  
  // ***** ROOM SERVICE MANAGEMENT *****

  /**
   * Đăng ký dịch vụ cho phòng
   */
  async addRoomService(addRoomServiceRequest: Rental.AddRoomServiceRequest): Promise<Rental.RoomServiceResponse> {
    try {
      const { roomId, serviceName, quantity, customPrice } = addRoomServiceRequest;
      
      // Kiểm tra xem phòng có tồn tại không
      const room = await this.roomModel.findById(roomId).exec();
      if (!room) {
        throw new RpcException({
          statusCode: 404,
          message: `Không tìm thấy phòng với id ${roomId}`,
        });
      }
      
      // Kiểm tra xem dịch vụ có tồn tại không
      const service = await this.serviceModel.findOne({ name: serviceName }).exec();
      if (!service) {
        throw new RpcException({
          statusCode: 404,
          message: `Không tìm thấy dịch vụ với tên ${serviceName}`,
        });
      }
      
      // Kiểm tra xem phòng đã đăng ký dịch vụ này chưa
      const existingRoomService = await this.roomServiceModel.findOne({
        roomId,
        serviceName
      }).exec();
      
      if (existingRoomService) {
        // Nếu đã đăng ký, cập nhật thông tin
        existingRoomService.quantity = quantity !== undefined ? quantity : existingRoomService.quantity;
        existingRoomService.customPrice = customPrice !== undefined ? customPrice : existingRoomService.customPrice;
        existingRoomService.isActive = true;
        
        await existingRoomService.save();
        this.logger.log(`Đã cập nhật dịch vụ ${serviceName} cho phòng ${room.roomNumber}`);
        
        return this.mapToRoomService(existingRoomService, service);
      } else {
        // Nếu chưa đăng ký, tạo mới
        const newRoomService = new this.roomServiceModel({
          roomId,
          serviceName,
          quantity: quantity || 1,
          customPrice,
          isActive: true
        });
        
        await newRoomService.save();
        this.logger.log(`Đã đăng ký dịch vụ ${serviceName} cho phòng ${room.roomNumber}`);
        
        return this.mapToRoomService(newRoomService, service);
      }
    } catch (error) {
      this.logger.error(`Lỗi đăng ký dịch vụ cho phòng: ${error.message}`, error.stack);
      throw new RpcException({
        statusCode: error.statusCode || 500,
        message: error.message || 'Lỗi đăng ký dịch vụ cho phòng',
      });
    }
  }

  /**
   * Thêm dịch vụ mặc định cho tất cả phòng
   */
  async addDefaultRoomService(): Promise<Rental.RoomServicesResponse> {
    try {
      // Tìm tất cả dịch vụ có type FEE
      const feeServices = await this.serviceModel.find({ type: 'FEE' }).exec();
      
      if (feeServices.length === 0) {
        return { services: [] };
      }

      // Lấy tất cả phòng
      const rooms = await this.roomModel.find().exec();
      this.logger.log(`Thêm dịch vụ mặc định cho ${rooms.length} phòng`);
      
      const registeredServices: Rental.RoomServiceResponse[] = [];
      
      // Duyệt qua từng phòng
      for (const room of rooms) {
        // Đăng ký từng dịch vụ cho phòng
        for (const service of feeServices) {
          // Kiểm tra xem phòng đã đăng ký dịch vụ này chưa
          const existingRoomService = await this.roomServiceModel.findOne({
            roomId: room._id.toString(),
            serviceName: service.name
          }).exec();
          
          if (existingRoomService) {
            // Nếu đã đăng ký và bị vô hiệu hóa, giữ nguyên
            if (!existingRoomService.isActive) {
              continue;
            }
          } else {
            // Nếu chưa đăng ký, tạo mới
            const newRoomService = new this.roomServiceModel({
              roomId: room._id.toString(),
              serviceName: service.name,
              quantity: 1,
              customPrice: null,
              isActive: true
            });
            
            await newRoomService.save();
            this.logger.log(`Đã đăng ký dịch vụ ${service.name} cho phòng ${room.roomNumber}`);
            
            registeredServices.push(this.mapToRoomService(newRoomService, service));
          }
        }
      }
      
      return { services: registeredServices };
    } catch (error) {
      this.logger.error(`Lỗi đăng ký dịch vụ mặc định cho tất cả phòng: ${error.message}`, error.stack);
      throw new RpcException({
        statusCode: 500,
        message: error.message || 'Lỗi đăng ký dịch vụ mặc định cho tất cả phòng',
      });
    }
  }

  /**
   * Chỉnh sửa dịch vụ phòng
   */
  async updateRoomService(updateRequest: Rental.UpdateRoomServiceRequest): Promise<Rental.RoomServiceResponse> {
    try {
      const { roomId, serviceName, quantity, customPrice, isActive } = updateRequest;
      
      // Tìm dịch vụ của phòng
      const roomService = await this.roomServiceModel.findOne({
        roomId,
        serviceName
      }).exec();
      
      if (!roomService) {
        throw new RpcException({
          statusCode: 404,
          message: `Phòng chưa đăng ký dịch vụ này`,
        });
      }
      
      // Cập nhật thông tin
      if (quantity !== undefined) roomService.quantity = quantity;
      if (customPrice !== undefined) roomService.customPrice = customPrice;
      if (isActive !== undefined) roomService.isActive = isActive;
      
      await roomService.save();
      this.logger.log(`Đã cập nhật dịch vụ ${serviceName} cho phòng`);
      
      const service = await this.serviceModel.findOne({ name: serviceName }).exec();
      if (!service) {
        throw new RpcException({
          statusCode: 404,
          message: `Không tìm thấy dịch vụ với tên ${serviceName}`,
        });
      }
      
      return this.mapToRoomService(roomService, service);
    } catch (error) {
      this.logger.error(`Lỗi cập nhật dịch vụ phòng: ${error.message}`, error.stack);
      throw new RpcException({
        statusCode: error.statusCode || 500,
        message: error.message || 'Lỗi cập nhật dịch vụ phòng',
      });
    }
  }

  /**
   * Hủy đăng ký dịch vụ cho phòng
   */
  async removeRoomService(removeRequest: Rental.RemoveRoomServiceRequest): Promise<Rental.RoomServiceResponse> {
    try {
      const { roomId, serviceName } = removeRequest;
      
      // Tìm dịch vụ của phòng
      const roomService = await this.roomServiceModel.findOne({
        roomId,
        serviceName
      }).exec();
      
      if (!roomService) {
        throw new RpcException({
          statusCode: 404,
          message: `Phòng chưa đăng ký dịch vụ này`,
        });
      }

      roomService.isActive = false;      
      await roomService.save();
      
      const service = await this.serviceModel.findOne({ name: serviceName }).exec();
      if (!service) {
        throw new RpcException({
          statusCode: 404,
          message: `Không tìm thấy dịch vụ với tên ${serviceName}`,
        });
      }
      
      this.logger.log(`Đã hủy dịch vụ ${serviceName} cho phòng`);
      
      return this.mapToRoomService(roomService, service);
    } catch (error) {
      this.logger.error(`Lỗi hủy dịch vụ: ${error.message}`, error.stack);
      throw new RpcException({
        statusCode: error.statusCode || 500,
        message: error.message || 'Lỗi hủy dịch vụ',
      });
    }
  }

  /**
   * Lấy tất cả dịch vụ đăng ký cho một phòng
   */
  async getRoomServices(getRoomServicesRequest: Rental.GetRoomServicesRequest): Promise<Rental.RoomServicesResponse> {
    try {
      const { roomId } = getRoomServicesRequest;
      
      // Kiểm tra phòng tồn tại
      const room = await this.roomModel.findById(roomId).exec();
      if (!room) {
        throw new RpcException({
          statusCode: 404,
          message: `Không tìm thấy phòng với id ${roomId}`,
        });
      }
      
      // Lấy tất cả dịch vụ đang hoạt động của phòng
      const roomServices = await this.roomServiceModel.find({
        roomId,
        isActive: true
      }).exec();
      
      // Lấy thông tin chi tiết của từng dịch vụ
      const services: Rental.RoomServiceResponse[] = [];
      
      for (const roomService of roomServices) {
        const service = await this.serviceModel.findOne({
          name: roomService.serviceName
        }).exec();
        
        if (service) {
          services.push(this.mapToRoomService(roomService, service));
        }
      }
      
      return { services };
    } catch (error) {
      this.logger.error(`Lỗi lấy dịch vụ của phòng: ${error.message}`, error.stack);
      throw new RpcException({
        statusCode: error.statusCode || 500,
        message: error.message || 'Lỗi lấy dịch vụ của phòng',
      });
    }
  }

  // ***** ASSET MANAGEMENT *****

  /**
   * Tạo mới một tài sản
   */
  async createAsset(createAssetDto: Rental.CreateAssetDto): Promise<Rental.Asset> {
    try {
      // Kiểm tra xem tài sản đã tồn tại chưa
      const existingAsset = await this.assetModel.findOne({ name: createAssetDto.name }).exec();
      if (existingAsset) {
        throw new RpcException({
          statusCode: 409,
          message: `Tài sản với tên ${createAssetDto.name} đã tồn tại`,
        });
      }

      const asset = new this.assetModel(createAssetDto);
      await asset.save();
      this.logger.log(`Đã tạo mới tài sản: ${asset.name}`);
      
      return this.mapToAsset(asset);
    } catch (error) {
      this.logger.error(`Lỗi tạo tài sản: ${error.message}`, error.stack);
      throw new RpcException({
        statusCode: error.statusCode || 500,
        message: error.message || 'Lỗi tạo tài sản',
      });
    }
  }

  /**
   * Lấy thông tin một tài sản theo tên
   */
  async getAsset(name: string): Promise<Rental.Asset> {
    try {
      const asset = await this.assetModel.findOne({ name }).exec();
      if (!asset) {
        throw new RpcException({
          statusCode: 404,
          message: `Không tìm thấy tài sản với tên ${name}`,
        });
      }
      
      return this.mapToAsset(asset);
    } catch (error) {
      this.logger.error(`Lỗi lấy tài sản: ${error.message}`, error.stack);
      throw new RpcException({
        statusCode: error.statusCode || 500,
        message: error.message || 'Lỗi lấy tài sản',
      });
    }
  }

  /**
   * Lấy tất cả tài sản
   */
  async getAllAssets(): Promise<Rental.AssetsResponse> {
    try {
      const assets = await this.assetModel.find().exec();
      return {
        assets: assets.map(this.mapToAsset),
        total: assets.length
      };
    } catch (error) {
      this.logger.error(`Lỗi lấy tất cả tài sản: ${error.message}`, error.stack);
      throw new RpcException({
        statusCode: error.statusCode || 500,
        message: error.message || 'Lỗi lấy tất cả tài sản',
      });
    }
  }

  /**
   * Cập nhật thông tin tài sản
   */
  async updateAsset(updateAssetDto: Rental.UpdateAssetDto): Promise<Rental.Asset> {
    try {
      const asset = await this.assetModel.findOne({ name: updateAssetDto.name }).exec();
      if (!asset) {
        throw new RpcException({
          statusCode: 404,
          message: `Không tìm thấy tài sản với tên ${updateAssetDto.name}`,
        });
      }
      
      // Cập nhật thông tin
      asset.value = updateAssetDto.value;
      if (updateAssetDto.unit !== undefined) {
        asset.unit = updateAssetDto.unit;
      }
      
      await asset.save();
      this.logger.log(`Đã cập nhật tài sản: ${asset.name}`);
      
      return this.mapToAsset(asset);
    } catch (error) {
      this.logger.error(`Lỗi cập nhật tài sản: ${error.message}`, error.stack);
      throw new RpcException({
        statusCode: error.statusCode || 500,
        message: error.message || 'Lỗi cập nhật tài sản',
      });
    }
  }

  /**
   * Xóa tài sản
   */
  async removeAsset(name: string): Promise<Rental.Asset> {
    try {
      // Kiểm tra xem tài sản có đang được sử dụng không
      const roomAssets = await this.roomAssetModel.findOne({ 
        assetName: name,
        isActive: true
      }).exec();
      
      if (roomAssets) {
        throw new RpcException({
          statusCode: 400,
          message: `Không thể xóa tài sản này vì đang được sử dụng trong các phòng`,
        });
      }
      
      const asset = await this.assetModel.findOneAndDelete({ name }).exec();
      if (!asset) {
        throw new RpcException({
          statusCode: 404,
          message: `Không tìm thấy tài sản với tên ${name}`,
        });
      }
      
      this.logger.log(`Đã xóa tài sản: ${name}`);
      return this.mapToAsset(asset);
    } catch (error) {
      this.logger.error(`Lỗi xóa tài sản: ${error.message}`, error.stack);
      throw new RpcException({
        statusCode: error.statusCode || 500,
        message: error.message || 'Lỗi xóa tài sản',
      });
    }
  }

  // ***** ROOM ASSET MANAGEMENT *****

  /**
   * Đăng ký tài sản cho phòng
   */
  async addRoomAsset(addRoomAssetRequest: Rental.AddRoomAssetRequest): Promise<Rental.RoomAssetResponse> {
    try {
      const { roomId, assetName, quantity, customPrice } = addRoomAssetRequest;
      
      // Kiểm tra xem phòng có tồn tại không
      const room = await this.roomModel.findById(roomId).exec();
      if (!room) {
        throw new RpcException({
          statusCode: 404,
          message: `Không tìm thấy phòng với id ${roomId}`,
        });
      }
      
      // Kiểm tra xem tài sản có tồn tại không
      const asset = await this.assetModel.findOne({ name: assetName }).exec();
      if (!asset) {
        throw new RpcException({
          statusCode: 404,
          message: `Không tìm thấy tài sản với tên ${assetName}`,
        });
      }
      
      // Kiểm tra xem phòng đã đăng ký tài sản này chưa
      const existingRoomAsset = await this.roomAssetModel.findOne({
        roomId,
        assetName
      }).exec();
      
      if (existingRoomAsset) {
        // Nếu đã đăng ký, cập nhật thông tin
        existingRoomAsset.quantity = quantity;
        existingRoomAsset.customPrice = customPrice !== undefined ? customPrice : existingRoomAsset.customPrice;;
        existingRoomAsset.isActive = true;
        
        await existingRoomAsset.save();
        this.logger.log(`Đã cập nhật tài sản ${assetName} cho phòng ${room.roomNumber}`);
        
        return this.mapToRoomAsset(existingRoomAsset);
      } else {
        // Nếu chưa đăng ký, tạo mới
        const newRoomAsset = new this.roomAssetModel({
          roomId,
          assetName,
          quantity,
          customPrice,
          isActive: true
        });
        
        await newRoomAsset.save();
        this.logger.log(`Đã đăng ký tài sản ${assetName} cho phòng ${room.roomNumber}`);
        
        return this.mapToRoomAsset(newRoomAsset);
      }
    } catch (error) {
      this.logger.error(`Lỗi đăng ký tài sản cho phòng: ${error.message}`, error.stack);
      throw new RpcException({
        statusCode: error.statusCode || 500,
        message: error.message || 'Lỗi đăng ký tài sản cho phòng',
      });
    }
  }

  /**
   * Lấy tất cả tài sản của một phòng
   */
  async getRoomAssets(getRoomAssetsRequest: Rental.GetRoomAssetsRequest): Promise<Rental.RoomAssetsResponse> {
    try {
      const { roomId } = getRoomAssetsRequest;
      
      // Kiểm tra phòng tồn tại
      const room = await this.roomModel.findById(roomId).exec();
      if (!room) {
        throw new RpcException({
          statusCode: 404,
          message: `Không tìm thấy phòng với id ${roomId}`,
        });
      }
      
      // Lấy tất cả tài sản của phòng
      const roomAssets = await this.roomAssetModel.find({
        roomId,
        isActive: true
      }).exec();
      
      return { 
        assets: roomAssets.map(this.mapToRoomAsset),
        total: roomAssets.length
      };
    } catch (error) {
      this.logger.error(`Lỗi lấy tài sản của phòng: ${error.message}`, error.stack);
      throw new RpcException({
        statusCode: error.statusCode || 500,
        message: error.message || 'Lỗi lấy tài sản của phòng',
      });
    }
  }

  /**
   * Cập nhật tài sản của phòng
   */
  async updateRoomAsset(updateRoomAssetRequest: Rental.UpdateRoomAssetRequest): Promise<Rental.RoomAssetResponse> {
    try {
      const { roomId, assetName, quantity, customPrice, isActive } = updateRoomAssetRequest;
      
      // Tìm tài sản của phòng
      const roomAsset = await this.roomAssetModel.findOne({
        roomId,
        assetName
      }).exec();
      
      if (!roomAsset) {
        throw new RpcException({
          statusCode: 404,
          message: `Phòng chưa đăng ký tài sản này`,
        });
      }
      
      // Cập nhật thông tin
      if (quantity !== undefined) roomAsset.quantity = quantity;
      if (customPrice !== undefined) roomAsset.customPrice = customPrice;
      if (isActive !== undefined) roomAsset.isActive = isActive;
      
      await roomAsset.save();
      this.logger.log(`Đã cập nhật tài sản ${assetName} cho phòng`);
      
      return this.mapToRoomAsset(roomAsset);
    } catch (error) {
      this.logger.error(`Lỗi cập nhật tài sản của phòng: ${error.message}`, error.stack);
      throw new RpcException({
        statusCode: error.statusCode || 500,
        message: error.message || 'Lỗi cập nhật tài sản của phòng',
      });
    }
  }

  /**
   * Xóa tài sản của phòng
   */
  async removeRoomAsset(removeRoomAssetRequest: Rental.RemoveRoomAssetRequest): Promise<Rental.RoomAssetResponse> {
    try {
      const { roomId, assetName } = removeRoomAssetRequest;
      
      // Tìm tài sản của phòng
      const roomAsset = await this.roomAssetModel.findOne({
        roomId,
        assetName
      }).exec();
      
      if (!roomAsset) {
        throw new RpcException({
          statusCode: 404,
          message: `Phòng chưa đăng ký tài sản này`,
        });
      }
      
      // Đánh dấu là không hoạt động thay vì xóa hoàn toàn
      roomAsset.isActive = false;      
      await roomAsset.save();
      
      this.logger.log(`Đã xóa tài sản ${assetName} khỏi phòng`);
      
      return this.mapToRoomAsset(roomAsset);
    } catch (error) {
      this.logger.error(`Lỗi xóa tài sản khỏi phòng: ${error.message}`, error.stack);
      throw new RpcException({
        statusCode: error.statusCode || 500,
        message: error.message || 'Lỗi xóa tài sản khỏi phòng',
      });
    }
  }

  // ***** TRANSACTION MANAGEMENT *****
  /**
   * Tạo mới một giao dịch
   */
  async createTransaction(createTransactionDto: Rental.CreateTransactionDto): Promise<Rental.Transaction> {
    try {
      const transaction = new this.transactionModel(createTransactionDto);
      await transaction.save();
      this.logger.log(`Đã tạo giao dịch mới: ${transaction._id}`);
      
      return this.mapToTransaction(transaction);
    } catch (error) {
      this.logger.error(`Lỗi tạo giao dịch: ${error.message}`, error.stack);
      throw new RpcException({
        statusCode: error.statusCode || 500,
        message: error.message || 'Lỗi tạo giao dịch',
      });
    }
  }

  /**
   * Tìm tất cả giao dịch theo bộ lọc
   */
  async findAllTransactionsByFilter(findAllTransactionsByFilterDto: Rental.FindAllTransactionsByFilterDto): Promise<Rental.Transactions> {
    try {
      const { page, limit, category, type, startDate, endDate } = findAllTransactionsByFilterDto;
      const skip = (page - 1) * limit;
      
      const filter: any = {};
      if (category) filter.category = category;
      if (type) filter.type = type;
      
      // Thêm lọc theo khoảng ngày tháng
      if (startDate || endDate) {
        filter.createdAt = {};
        if (startDate) filter.createdAt.$gte = new Date(startDate);
        if (endDate) filter.createdAt.$lte = new Date(endDate);
      }
      
      const transactions = await this.transactionModel.find(filter)
        .sort({ createdAt: -1 })  // Sắp xếp theo ngày gần nhất
        .skip(skip)
        .limit(limit)
        .exec();
      
      const total = await this.transactionModel.countDocuments(filter).exec();
      
      return { 
        transactions: transactions.map(this.mapToTransaction), 
        total 
      };
    } catch (error) {
      this.logger.error(`Lỗi tìm giao dịch: ${error.message}`, error.stack);
      throw new RpcException({
        statusCode: error.statusCode || 500,
        message: error.message || 'Lỗi tìm giao dịch',
      });
    }
  }

  /**
   * Tìm một giao dịch theo id
   */
  async findOneTransaction(findOneTransactionDto: Rental.FindOneTransactionDto): Promise<Rental.Transaction> {
    try {
      const transaction = await this.transactionModel.findById(findOneTransactionDto.id).exec();
      if (!transaction) {
        throw new RpcException({
          statusCode: 404,
          message: `Không tìm thấy giao dịch với id ${findOneTransactionDto.id}`,
        });
      }
      
      return this.mapToTransaction(transaction);
    } catch (error) {
      this.logger.error(`Lỗi tìm giao dịch: ${error.message}`, error.stack);
      throw new RpcException({
        statusCode: error.statusCode || 500,
        message: error.message || 'Lỗi tìm giao dịch',
      });
    }
  }

  /**
   * Cập nhật thông tin giao dịch
   */
  async updateTransaction(updateTransactionDto: Rental.UpdateTransactionDto): Promise<Rental.Transaction> {
    try {
      const transaction = await this.transactionModel.findById(updateTransactionDto.id).exec();
      if (!transaction) {
        throw new RpcException({
          statusCode: 404,
          message: `Không tìm thấy giao dịch với id ${updateTransactionDto.id}`,
        });
      }
      
      Object.assign(transaction, updateTransactionDto);
      await transaction.save();
      this.logger.log(`Đã cập nhật giao dịch: ${transaction._id}`);
      
      return this.mapToTransaction(transaction);
    } catch (error) {
      this.logger.error(`Lỗi cập nhật giao dịch: ${error.message}`, error.stack);
      throw new RpcException({
        statusCode: error.statusCode || 500,
        message: error.message || 'Lỗi cập nhật giao dịch',
      });
    }
  }

  /**
   * Xóa giao dịch
   */
  async removeTransaction(findOneTransactionDto: Rental.FindOneTransactionDto): Promise<Rental.Transaction> {
    try {
      const transaction = await this.transactionModel.findByIdAndDelete(findOneTransactionDto.id).exec();
      if (!transaction) {
        throw new RpcException({
          statusCode: 404,
          message: `Không tìm thấy giao dịch với id ${findOneTransactionDto.id}`,
        });
      }
      
      this.logger.log(`Đã xóa giao dịch: ${transaction._id}`);
      return this.mapToTransaction(transaction);
    } catch (error) {
      this.logger.error(`Lỗi xóa giao dịch: ${error.message}`, error.stack);
      throw new RpcException({
        statusCode: error.statusCode || 500,
        message: error.message || 'Lỗi xóa giao dịch',
      });
    }
  }

  private mapToRoom(room: RoomDocument): Rental.Room {
    return {
      id: room._id.toString(),
      roomNumber: room.roomNumber,
      price: room.price,
      area: room.area,
      images: room.images || [],
      depositDate: room.depositDate?.toISOString() || '',
      depositPrice: room.depositPrice,
      maxTenants: room.maxTenants,
      isEmpty: room.isEmpty,
      createdAt: room.createdAt.toISOString(),
      updatedAt: room.updatedAt.toISOString(),
    };
  }

  private mapToTenant(tenant: TenantDocument): Rental.Tenant {
    return {
      id: tenant._id.toString(),
      name: tenant.name,
      email: tenant.email,
      phone: tenant.phone,
      roomId: tenant.roomId,
      isLeadRoom: tenant.isLeadRoom,
      identityNumber: tenant.identityNumber,
      permanentAddress: tenant.permanentAddress,
      holdingDepositPrice: tenant.holdingDepositPrice,
      depositDate: tenant.depositDate?.toISOString() || '',
      startDate: tenant.startDate?.toISOString() || '',
      birthday: tenant.birthday?.toISOString() || '',
      gender: tenant.gender,
      isActive: tenant.isActive,
      createdAt: tenant.createdAt.toISOString(),
      updatedAt: tenant.updatedAt.toISOString(),
    };
  }

  private mapToInvoice(invoice: InvoiceDocument): Rental.Invoice {
    return {
      id: invoice._id.toString(),
      roomId: invoice.roomId,
      month: invoice.month,
      fees: invoice.fees.map(fee => ({
        type: fee.type,
        amount: fee.amount,
        reading: fee.reading,
        description: fee.description,
        createdAt: fee.createdAt.toISOString(),
        updatedAt: fee.updatedAt.toISOString(),
      })),
      total: invoice.total,
      dueDate: invoice.dueDate,
      isPaid: invoice.isPaid,
      paidAt: invoice.paidAt,
      createdAt: invoice.createdAt.toISOString(),
      updatedAt: invoice.updatedAt.toISOString(),
    };
  }

  private mapToService(service: ServiceDocument): Rental.ServiceResponse {
    return {
      name: service.name,
      value: service.value,
      description: service.description,
      type: service.type || 'CONFIG', // Set a default value to ensure it's never undefined
      unit: service.unit || ''
    };
  }

  private mapToRoomService(roomService: RoomServiceDocument, service: ServiceDocument): Rental.RoomServiceResponse {
    return {
      id: roomService._id.toString(),
      roomId: roomService.roomId,
      service: this.mapToService(service),
      quantity: roomService.quantity,
      customPrice: roomService.customPrice || 0,
      isActive: roomService.isActive,
      createdAt: roomService.createdAt.toISOString(),
      updatedAt: roomService.updatedAt.toISOString()
    };
  }

  private mapToAsset(asset: AssetDocument): Rental.Asset {
    return {
      name: asset.name,
      value: asset.value,
      unit: asset.unit,
      createdAt: asset.createdAt.toISOString(),
      updatedAt: asset.updatedAt.toISOString(),
    };
  }
  
  private mapToRoomAsset(roomAsset: RoomAssetDocument): Rental.RoomAssetResponse {
    return {
      id: roomAsset._id.toString(),
      roomId: roomAsset.roomId,
      assetName: roomAsset.assetName,
      quantity: roomAsset.quantity,
      customPrice: roomAsset.customPrice || 0,
      isActive: roomAsset.isActive,
      createdAt: roomAsset.createdAt.toISOString(),
      updatedAt: roomAsset.updatedAt.toISOString()
    };
  }
  
  private mapToTransaction(transaction: TransactionDocument): Rental.Transaction {
    return {
      id: transaction._id.toString(),
      category: transaction.category,
      type: transaction.type,
      amount: transaction.amount,
      description: transaction.description,
      relatedTo: transaction.relatedTo || '',
      createdBy: transaction.createdBy || '',
      createdAt: transaction.createdAt.toISOString(),
      updatedAt: transaction.updatedAt.toISOString(),
    };
  }
}
