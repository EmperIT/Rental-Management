import { Injectable } from '@nestjs/common';
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

@Injectable()
export class ContractService {
  constructor(
    @InjectModel('Contract') private readonly contractModel: Model<ContractDocument>  ) {}

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
}