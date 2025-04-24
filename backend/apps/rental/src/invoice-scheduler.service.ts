import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClientProxyFactory, Transport, ClientProxy } from '@nestjs/microservices';
import { join } from 'path';
import { firstValueFrom } from 'rxjs';

// Interface cho document
interface SettingDocument {
  key: string;
  value: any;
  description: string;
  lastUpdated: Date;
}

interface RoomDocument {
  _id: string;
  roomNumber: string;
  price: number;
  address: string;
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
  startDate: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface FeeDocument {
  type: string;
  amount: number;
  reading?: number;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ReadingData {
  [key: string]: number;
}

@Injectable()
export class InvoiceSchedulerService implements OnModuleInit {
  private readonly logger = new Logger(InvoiceSchedulerService.name);
  private emailServiceClient: ClientProxy;
  
  constructor(
    private configService: ConfigService,
    private schedulerRegistry: SchedulerRegistry,
    @InjectModel('Room') private readonly roomModel: Model<RoomDocument>,
    @InjectModel('Tenant') private readonly tenantModel: Model<TenantDocument>,
    @InjectModel('Setting') private readonly settingModel: Model<SettingDocument>,
  ) {
    // Khởi tạo client để kết nối với email service
    this.emailServiceClient = ClientProxyFactory.create({
      transport: Transport.GRPC,
      options: {
        url: configService.get<string>('EMAIL_SERVICE_URL') || 'localhost:5003',
        package: 'email',
        protoPath: join(__dirname, '../../../../proto/email.proto'),
      },
    });
  }

  async onModuleInit() {
    await this.initializeDefaultSettings();
  }
  
  /**
   * Khởi tạo các cấu hình mặc định khi service được khởi động
   */
  private async initializeDefaultSettings() {
    try {
      const defaultSettings = [
        { 
          key: 'ELECTRICITY_PRICE', 
          value: 3500, 
          description: 'Giá điện (VND/kWh)' 
        },
        { 
          key: 'WATER_PRICE', 
          value: 15000, 
          description: 'Giá nước (VND/m³)' 
        },
        { 
          key: 'INVOICE_GENERATION_DAY', 
          value: '28', 
          description: 'Ngày trong tháng để gửi hóa đơn (1-31)' 
        },
        {
          key: 'INVOICE_DUE_DAYS',
          value: 7,
          description: 'Số ngày để thanh toán hóa đơn sau khi gửi'
        },
        {
          key: 'AUTO_SEND_INVOICE',
          value: true,
          description: 'Tự động gửi hóa đơn khi đến ngày được cấu hình'
        }
      ];
      
      for (const setting of defaultSettings) {
        const exists = await this.settingModel.findOne({ key: setting.key }).exec();
        if (!exists) {
          const newSetting = new this.settingModel({
            key: setting.key,
            value: setting.value,
            description: setting.description
          });
          await newSetting.save();
          this.logger.log(`Đã khởi tạo cấu hình mặc định: ${setting.key} = ${setting.value}`);
        }
      }
    } catch (error) {
      this.logger.error(`Lỗi khởi tạo cấu hình mặc định: ${error.message}`, error.stack);
    }
  }

  /**
   * Lấy giá trị của một cấu hình theo key
   */
  async getSetting(key: string): Promise<any> {
    try {
      const setting = await this.settingModel.findOne({ key }).exec();
      return setting ? setting.value : null;
    } catch (error) {
      this.logger.error(`Lỗi lấy cấu hình ${key}: ${error.message}`, error.stack);
      return null;
    }
  }

  /**
   * Lưu giá trị của một cấu hình
   */
  async saveSetting(key: string, value: any, description?: string): Promise<any> {
    try {
      const setting = await this.settingModel.findOne({ key }).exec();
      
      if (setting) {
        setting.value = value;
        setting.lastUpdated = new Date();
        if (description) setting.description = description;
        await setting.save();
        return { key, value, description: setting.description };
      } else {
        const newSetting = new this.settingModel({
          key,
          value,
          description: description || `Cấu hình cho ${key}`,
        });
        await newSetting.save();
        return { key, value, description: newSetting.description };
      }
    } catch (error) {
      this.logger.error(`Lỗi lưu cấu hình ${key}: ${error.message}`, error.stack);
      throw new Error(`Lỗi lưu cấu hình: ${error.message}`);
    }
  }

  /**
   * Lấy tất cả các cấu hình
   */
  async getAllSettings(): Promise<any[]> {
    try {
      const settings = await this.settingModel.find().exec();
      return settings.map(setting => ({
        key: setting.key,
        value: setting.value,
        description: setting.description,
        lastUpdated: setting.lastUpdated
      }));
    } catch (error) {
      this.logger.error(`Lỗi lấy tất cả cấu hình: ${error.message}`, error.stack);
      throw new Error('Lỗi lấy cấu hình');
    }
  }

  /**
   * Chạy định kỳ mỗi ngày vào lúc 00:01 để kiểm tra xem có phải là ngày gửi hóa đơn không
   */
  @Cron('1 0 * * *')
  async checkAndGenerateInvoices() {
    try {
      // Kiểm tra cấu hình có bật tự động gửi không
      const autoSend = await this.getSetting('AUTO_SEND_INVOICE');
      if (!autoSend) {
        this.logger.log('Chức năng tự động gửi hóa đơn đang bị tắt');
        return;
      }
      
      // Lấy ngày gửi hóa đơn từ cấu hình
      const invoiceDay = await this.getSetting('INVOICE_GENERATION_DAY');
      if (!invoiceDay) {
        this.logger.warn('Chưa cấu hình ngày gửi hóa đơn');
        return;
      }
      
      const today = new Date();
      // Kiểm tra xem hôm nay có phải là ngày gửi hóa đơn không
      if (today.getDate() === parseInt(invoiceDay)) {
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
        return;
      }
      
      this.logger.log(`Tìm thấy người thuê chính: ${leadTenant.name}, email: ${leadTenant.email}`);
      
      // 2. Lấy số đọc điện nước mới nhất và tính toán
      const latestReadings = await this.getLatestReadingsForRoom(room._id.toString());
      
      // 3. Lấy cấu hình giá điện nước
      const electricityPrice = await this.getSetting('ELECTRICITY_PRICE') || 3500;
      const waterPrice = await this.getSetting('WATER_PRICE') || 15000;
      
      // 4. Tạo thông tin hóa đơn
      const currentDate = new Date();
      const month = `${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
      const formattedMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
      
      // Số ngày để thanh toán sau khi nhận hóa đơn
      const dueDays = await this.getSetting('INVOICE_DUE_DAYS') || 7;
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + parseInt(dueDays.toString()));
      
      // Tạo danh sách khoản phí
      const fees: FeeDocument[] = [];
      
      // Thêm phí phòng
      fees.push({
        type: 'Tiền phòng',
        amount: room.price,
        description: `Tiền thuê phòng tháng ${month}`,
        createdAt: currentDate,
        updatedAt: currentDate
      });
      
      // Thêm phí điện nếu có số đọc
      if (latestReadings && latestReadings['Điện'] !== undefined) {
        const previousReading = await this.getPreviousReading(room._id.toString(), 'Điện');
        const consumption = latestReadings['Điện'] - (previousReading || 0);
        
        if (consumption > 0) {
          fees.push({
            type: 'Điện',
            amount: consumption * electricityPrice,
            reading: latestReadings['Điện'],
            description: `Tiền điện: ${consumption} kWh x ${electricityPrice}đ = ${consumption * electricityPrice}đ`,
            createdAt: currentDate,
            updatedAt: currentDate
          });
        }
      }
      
      // Thêm phí nước nếu có số đọc
      if (latestReadings && latestReadings['Nước'] !== undefined) {
        const previousReading = await this.getPreviousReading(room._id.toString(), 'Nước');
        const consumption = latestReadings['Nước'] - (previousReading || 0);
        
        if (consumption > 0) {
          fees.push({
            type: 'Nước',
            amount: consumption * waterPrice,
            reading: latestReadings['Nước'],
            description: `Tiền nước: ${consumption} khối x ${waterPrice}đ = ${consumption * waterPrice}đ`,
            createdAt: currentDate,
            updatedAt: currentDate
          });
        }
      }
      
      // Tính tổng tiền
      const total = fees.reduce((sum, fee) => sum + fee.amount, 0);
      
      // 5. Tạo hóa đơn trong database
      const invoice = {
        roomId: room._id.toString(),
        month: formattedMonth,
        fees: fees,
        total: total,
        dueDate: dueDate.toISOString(),
        isPaid: false,
        paidAt: null,
        createdAt: currentDate,
        updatedAt: currentDate
      };
      
      // 6. Gửi email hóa đơn đến người thuê chính
      try {
        const emailResponse = await firstValueFrom(
          this.emailServiceClient.send('sendInvoiceEmail', {
            to: leadTenant.email,
            tenantName: leadTenant.name,
            roomNumber: room.roomNumber,
            month: month,
            dueDate: dueDate.toLocaleDateString('vi-VN'),
            total: total,
            fees: fees.map(fee => ({
              type: fee.type,
              amount: fee.amount,
              description: fee.description,
            }))
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
          error: error.message
        };
      }
    } catch (error) {
      this.logger.error(`Lỗi xử lý hóa đơn cho phòng ${room.roomNumber}: ${error.message}`, error.stack);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Lấy số đọc điện nước mới nhất cho một phòng
   * Trong môi trường thực tế, đây có thể là API để lấy số đọc từ hệ thống IoT
   */
  private async getLatestReadingsForRoom(roomId: string): Promise<ReadingData> {
    // Giả lập lấy số đọc điện nước mới nhất
    // Trong thực tế, bạn sẽ gọi API hoặc lấy từ database
    
    // Tạo số ngẫu nhiên để mô phỏng
    const getRandomReading = (min: number, max: number) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    
    // Lấy số đọc trước đó (nếu có)
    const previousElectricityReading = await this.getPreviousReading(roomId, 'Điện') || 0;
    const previousWaterReading = await this.getPreviousReading(roomId, 'Nước') || 0;
    
    // Tạo số đọc mới lớn hơn số đọc trước đó
    const newElectricityReading = previousElectricityReading + getRandomReading(50, 100);
    const newWaterReading = previousWaterReading + getRandomReading(5, 15);
    
    return {
      'Điện': newElectricityReading,
      'Nước': newWaterReading
    };
  }

  /**
   * Lấy số đọc trước đó cho một loại đồng hồ (điện/nước)
   */
  private async getPreviousReading(roomId: string, type: string): Promise<number | null> {
    // Trong thực tế, bạn sẽ lấy từ hóa đơn gần nhất trong database
    // Đây là một mô phỏng đơn giản
    return 0; // Giả sử bắt đầu từ 0 nếu không có số đọc trước đó
  }
}