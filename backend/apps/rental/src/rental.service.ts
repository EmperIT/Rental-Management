import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Rental } from '@app/commonn';
import { RpcException } from '@nestjs/microservices';

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

@Injectable()
export class RentalService {
  private readonly logger = new Logger(RentalService.name);

  constructor(
    @InjectModel('Room') private readonly roomModel: Model<RoomDocument>,
    @InjectModel('Tenant') private readonly tenantModel: Model<TenantDocument>,
    @InjectModel('Invoice') private readonly invoiceModel: Model<InvoiceDocument>,
  ) {}

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

  async findAllRooms(findAllRoomsDto: Rental.FindAllRoomsDto): Promise<Rental.Rooms> {
    try {
      const { page, limit } = findAllRoomsDto;
      const skip = (page - 1) * limit;
      
      const rooms = await this.roomModel.find()
        .skip(skip)
        .limit(limit)
        .exec();
      
      const total = await this.roomModel.countDocuments().exec();
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
      if (room.isEmpty) {
        throw new RpcException({
          statusCode: 400,
          message: `Phòng ${room.roomNumber} đã có người thuê`,
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
      if (isLeadRoom !== undefined) filter.isLeadRoom = isLeadRoom ? 'true' : 'false';
      
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
        
        if (newRoom.isEmpty) {
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

  private calculateTotalFromFees(fees: FeeDocument[] | Rental.Fee[]): number {
    return fees.reduce((sum, fee) => sum + (fee.amount || 0), 0);
  }

  private mapToRoom(room: RoomDocument): Rental.Room {
    return {
      id: room._id.toString(),
      roomNumber: room.roomNumber,
      price: room.price,
      address: room.address,
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
      startDate: tenant.startDate,
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
}
