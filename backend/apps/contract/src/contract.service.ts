import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RpcException } from '@nestjs/microservices';
interface ContractDocument {
  _id: string;
  isActive: boolean;
  roomId: string;
  tenantId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  startDate: Date;
  endDate: Date;
}

interface StayRecordDocument {
  _id: string;
  stayId: string;
  tenantId: string;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'expired' | 'inactive';
  content: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// Contract interfaces

interface CreateContractDto {
  roomId: string;
  content: string;
  startDate: string;
  endDate: string;
  deposit: number;
  rentAmount: number;
  templateId: string;
}

interface UpdateContractDto {
  _id: string;
  isActive?: boolean;
  roomId?: string;
  tenantId?: string;
  content?: string;
  startDate?: string;
  endDate?: string;
}

interface PaginationDto {
  page: number;
  limit: number;
  roomId?: string;
  tenantId?: string;
  isActive?: boolean;
}

// StayRecord interfaces
interface CreateStayRecordDto {
  tenantId: string;
  startDate: string;
  endDate: string;
  content: string;
  createdBy: string;
}

interface UpdateStayRecordDto {
  stayId: string;
  tenantId: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'inactive';
  content: string;
}


interface RemoveStayRecordDto {
  stayId: string;
}

interface StayRecordPaginationDto {
  page: number;
  limit: number;
  tenantId?: string;
  status?: string;
  startDateFrom?: string;
  startDateTo?: string;
  endDateFrom?: string;
  endDateTo?: string;
}

@Injectable()
export class ContractService {
  private readonly logger = new Logger(ContractService.name);

  constructor(
    @InjectModel('Contract') private readonly contractModel: Model<ContractDocument>,
    @InjectModel('StayRecord') private readonly stayRecordModel: Model<StayRecordDocument>
  ) {}

  async createContract(createContractDto: CreateContractDto): Promise<ContractDocument> {
    const startDate = new Date(createContractDto.startDate);
    const endDate = new Date(createContractDto.endDate);

    if (startDate >= endDate) {
      throw new RpcException({
        statusCode: 400,
        message: 'Ngày bắt đầu phải trước ngày kết thúc',
      });
    }

    const contract = new this.contractModel({
      ...createContractDto,
      startDate,
      endDate,
    });
    return contract.save();
  }

  async findAllContracts(paginationDto: PaginationDto): Promise<{ contracts: ContractDocument[]; total: number }> {
    const { page, limit, roomId, tenantId, isActive } = paginationDto;
    const filter: any = {};
    if (roomId) {
      filter.roomId = roomId;
    }
    if (tenantId) { 
      filter.tenantId = tenantId;
    }
    if (isActive !== undefined) {
      filter.isActive = isActive;
    }
    
    const skip = (page - 1) * limit;
    const contracts = await this.contractModel.find(filter).skip(skip).limit(limit).exec();
    const total = await this.contractModel.countDocuments(filter).exec();
    return { contracts, total };
  }

  async findOneContract(_id: string): Promise<ContractDocument> {
    const contract = await this.contractModel.findOne({ _id }).exec();
    if (!contract) {
      throw new RpcException({
        statusCode: 404,
        message: `Không tìm thấy hợp đồng với id ${_id}`,
      });
    }
    return contract;
  }

  async updateContract(updateContractDto: UpdateContractDto): Promise<ContractDocument> {
    const { _id } = updateContractDto;
    const contract = await this.contractModel.findOne({ _id }).exec();
    if (!contract) {
      throw new RpcException({
        statusCode: 404,
        message: `Không tìm thấy hợp đồng với id ${_id}`,
      });
    }

    if (updateContractDto.startDate || updateContractDto.endDate) {
      const startDate = updateContractDto.startDate
        ? new Date(updateContractDto.startDate)
        : contract.startDate;
      const endDate = updateContractDto.endDate
        ? new Date(updateContractDto.endDate)
        : contract.endDate;
      if (startDate >= endDate) {
        throw new RpcException({
          statusCode: 400,
          message: 'Ngày bắt đầu phải trước ngày kết thúc',
        });
      }
      updateContractDto.startDate = startDate.toISOString();
      updateContractDto.endDate = endDate.toISOString();
    }

    Object.assign(contract, updateContractDto);
    contract.updatedAt = new Date();
    return contract.save();
  }

  async removeContract(_id: string): Promise<ContractDocument> {
    const contract = await this.contractModel.findOneAndDelete({ _id }).exec();
    if (!contract) {
      throw new RpcException({
        statusCode: 404,
        message: `Không tìm thấy hợp đồng với id ${_id}`,
      });
    }
    return contract;
  }

  async createStayRecord(createStayRecordDto: CreateStayRecordDto): Promise<StayRecordDocument> {
    try {
      const startDate = new Date(createStayRecordDto.startDate);
      const endDate = new Date(createStayRecordDto.endDate);

      if (startDate >= endDate) {
        throw new RpcException({
          statusCode: 400,
          message: 'Ngày bắt đầu phải trước ngày kết thúc',
        });
      }

      // Kiểm tra xem có bản ghi tạm trú nào đang active cho tenant này không
      const activeRecord = await this.stayRecordModel.findOne({
        tenantId: createStayRecordDto.tenantId,
        status: 'active'
      }).exec();

      if (activeRecord) {
        throw new RpcException({
          statusCode: 400,
          message: 'Người thuê này đã có bản ghi tạm trú đang hoạt động',
        });
      }

      const stayRecord = new this.stayRecordModel({
        ...createStayRecordDto,
        startDate,
        endDate,
        status: 'active',
      });
      
      this.logger.log(`Tạo mới bản ghi tạm trú cho người thuê ${createStayRecordDto.tenantId}`);
      return stayRecord.save();
    } catch (error) {
      this.logger.error(`Lỗi khi tạo bản ghi tạm trú: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAllStayRecords(paginationDto: StayRecordPaginationDto): Promise<{ records: StayRecordDocument[]; total: number }> {
    try {
      const { page, limit, tenantId, status, startDateFrom, startDateTo, endDateFrom, endDateTo } = paginationDto;
      const filter: any = {};
      
      if (tenantId) {
        filter.tenantId = tenantId;
      }
      
      if (status) {
        filter.status = status;
      }
      
      // Lọc theo ngày bắt đầu
      if (startDateFrom || startDateTo) {
        filter.startDate = {};
        if (startDateFrom) {
          filter.startDate.$gte = new Date(startDateFrom);
        }
        if (startDateTo) {
          filter.startDate.$lte = new Date(startDateTo);
        }
      }
      
      // Lọc theo ngày kết thúc
      if (endDateFrom || endDateTo) {
        filter.endDate = {};
        if (endDateFrom) {
          filter.endDate.$gte = new Date(endDateFrom);
        }
        if (endDateTo) {
          filter.endDate.$lte = new Date(endDateTo);
        }
      }
      
      const skip = (page - 1) * limit;
      const records = await this.stayRecordModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec();
      
      const total = await this.stayRecordModel.countDocuments(filter).exec();
      return { records, total };
    } catch (error) {
      this.logger.error(`Lỗi khi lấy danh sách bản ghi tạm trú: ${error.message}`, error.stack);
      throw new RpcException({
        statusCode: 500,
        message: `Lỗi server: ${error.message}`,
      });
    }
  }

  async findOneStayRecord(_id: string): Promise<StayRecordDocument> {
    try {
      const stayRecord = await this.stayRecordModel.findOne({ _id }).exec();
      
      if (!stayRecord) {
        throw new RpcException({
          statusCode: 404,
          message: `Không tìm thấy bản ghi tạm trú với id ${_id}`,
        });
      }
      
      return stayRecord;
    } catch (error) {
      this.logger.error(`Lỗi khi tìm bản ghi tạm trú: ${error.message}`, error.stack);
      throw error;
    }
  }

  async updateStayRecord(updateStayRecordDto: UpdateStayRecordDto): Promise<StayRecordDocument> {
    try {
      const { stayId } = updateStayRecordDto;
      const stayRecord = await this.stayRecordModel.findOne({ _id: stayId }).exec();
      
      if (!stayRecord) {
        throw new RpcException({
          statusCode: 404,
          message: `Không tìm thấy bản ghi tạm trú với id ${stayId}`,
        });
      }
      
      // Kiểm tra ngày tháng nếu được cập nhật
      if (updateStayRecordDto.startDate || updateStayRecordDto.endDate) {
        const startDate = updateStayRecordDto.startDate
          ? new Date(updateStayRecordDto.startDate)
          : stayRecord.startDate;
          
        const endDate = updateStayRecordDto.endDate
          ? new Date(updateStayRecordDto.endDate)
          : stayRecord.endDate;
          
        if (startDate >= endDate) {
          throw new RpcException({
            statusCode: 400,
            message: 'Ngày bắt đầu phải trước ngày kết thúc',
          });
        }
        
        if (updateStayRecordDto.startDate) {
          stayRecord.startDate = startDate;
        }
        
        if (updateStayRecordDto.endDate) {
          stayRecord.endDate = endDate;
        }
      }
      
      // Cập nhật các trường khác
      if (updateStayRecordDto.tenantId) stayRecord.tenantId = updateStayRecordDto.tenantId;
      if (updateStayRecordDto.status) stayRecord.status = updateStayRecordDto.status;
      if (updateStayRecordDto.content) stayRecord.content = updateStayRecordDto.content;
      
      stayRecord.updatedAt = new Date();
      this.logger.log(`Cập nhật bản ghi tạm trú ${stayId}`);
      
      return stayRecord.save();
    } catch (error) {
      this.logger.error(`Lỗi khi cập nhật bản ghi tạm trú: ${error.message}`, error.stack);
      throw error;
    }
  }

  async removeStayRecord(stayId: string): Promise<StayRecordDocument> {
    try {
      const stayRecord = await this.stayRecordModel.findOne({ _id: stayId }).exec();
      
      if (!stayRecord) {
        throw new RpcException({
          statusCode: 404,
          message: `Không tìm thấy bản ghi tạm trú với id ${stayId}`,
        });
      }
      
      // Thay vì xóa hoàn toàn, chuyển trạng thái thành inactive
      stayRecord.status = 'inactive';
      stayRecord.updatedAt = new Date();
      this.logger.log(`Vô hiệu hóa bản ghi tạm trú ${stayId}`);
      return stayRecord.save();
    } catch (error) {
      this.logger.error(`Lỗi khi xóa bản ghi tạm trú: ${error.message}`, error.stack);
      throw error;
    }
  }

  // Phương thức tự động kiểm tra và cập nhật trạng thái các bản ghi tạm trú hết hạn
  async checkAndUpdateExpiredStayRecords(): Promise<number> {
    try {
      const now = new Date();
      const expiredRecords = await this.stayRecordModel.find({
        status: 'active',
        endDate: { $lt: now }
      }).exec();
      
      if (expiredRecords.length === 0) {
        return 0;
      }
      
      let updatedCount = 0;
      for (const record of expiredRecords) {
        record.status = 'expired';
        record.updatedAt = now;
        record.content = record.content 
          ? record.content + '\nBản ghi tự động hết hạn vào ' + now.toISOString()
          : 'Bản ghi tự động hết hạn vào ' + now.toISOString();
        
        await record.save();
        updatedCount++;
      }
      
      this.logger.log(`Đã cập nhật ${updatedCount} bản ghi tạm trú hết hạn`);
      return updatedCount;
    } catch (error) {
      this.logger.error(`Lỗi khi kiểm tra và cập nhật bản ghi tạm trú hết hạn: ${error.message}`, error.stack);
      throw error;
    }
  }
}