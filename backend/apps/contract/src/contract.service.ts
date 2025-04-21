import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RpcException } from '@nestjs/microservices';
interface ContractDocument {
  contract_id: string;
  isActive: boolean;
  roomId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  startDate: Date;
  endDate: Date;
  deposit: number;
  rentAmount: number;
  templateId: string;
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
  contract_id: string;
  isActive?: boolean;
  roomId?: string;
  content?: string;
  startDate?: string;
  endDate?: string;
  deposit?: number;
  rentAmount?: number;
  templateId?: string;
}

interface PaginationDto {
  page: number;
  limit: number;
}

interface ContractTemplateDocument {
  templateId: string;
  name: string;
  description: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

interface CreateContractTemplateDto {
  name: string;
  description: string;
  content: string;
}

interface UpdateContractTemplateDto {
  templateId: string;
  name?: string;
  description?: string;
  content?: string;
}


@Injectable()
export class ContractService {
  constructor(
    @InjectModel('Contract') private readonly contractModel: Model<ContractDocument>,
    @InjectModel('ContractTemplate') private readonly contractTemplateModel: Model<ContractTemplateDocument>,
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
    const { page, limit } = paginationDto;
    const skip = (page - 1) * limit;
    const contracts = await this.contractModel.find().skip(skip).limit(limit).exec();
    const total = await this.contractModel.countDocuments().exec();
    return { contracts, total };
  }

  async findOneContract(contract_id: string): Promise<ContractDocument> {
    const contract = await this.contractModel.findOne({ contract_id }).exec();
    if (!contract) {
      throw new RpcException({
        statusCode: 404,
        message: `Không tìm thấy hợp đồng với id ${contract_id}`,
      });
    }
    return contract;
  }

  async updateContract(updateContractDto: UpdateContractDto): Promise<ContractDocument> {
    const { contract_id } = updateContractDto;
    const contract = await this.contractModel.findOne({ contract_id }).exec();
    if (!contract) {
      throw new RpcException({
        statusCode: 404,
        message: `Không tìm thấy hợp đồng với id ${contract_id}`,
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

  async removeContract(contract_id: string): Promise<ContractDocument> {
    const contract = await this.contractModel.findOneAndDelete({ contract_id }).exec();
    if (!contract) {
      throw new RpcException({
        statusCode: 404,
        message: `Không tìm thấy hợp đồng với id ${contract_id}`,
      });
    }
    return contract;
  }

  async createContractTemplate(createContractTemplateDto: CreateContractTemplateDto): Promise<CreateContractTemplateDto> {
    // Implement the logic to create a contract template
    // This is a placeholder implementation
    const contractTemplate = new this.contractTemplateModel({
      ...createContractTemplateDto,
    });
    return contractTemplate.save();
  }

  async findAllContractTemplates(paginationDto: PaginationDto): Promise<{ contractTemplates: ContractTemplateDocument[]; total: number }> {
    const { page, limit } = paginationDto;
    const skip = (page - 1) * limit;
    const contractTemplates = await this.contractTemplateModel.find().skip(skip).limit(limit).exec();
    const total = await this.contractTemplateModel.countDocuments().exec();
    return { contractTemplates, total };
  }

  async findOneContractTemplate(templateId: string): Promise<ContractTemplateDocument> { 
    const contractTemplate = await this.contractTemplateModel.findOne({ templateId }).exec();
    if (!contractTemplate) {
      throw new RpcException({
        statusCode: 404,
        message: `Không tìm thấy mẫu hợp đồng với id ${templateId}`,
      });
    }
    return contractTemplate;
  }

  async updateContractTemplate(updateContractTemplateDto: UpdateContractTemplateDto): Promise<ContractTemplateDocument> {
    const { templateId } = updateContractTemplateDto;
    const contractTemplate = await this.contractTemplateModel.findOne({ templateId }).exec();
    if (!contractTemplate) {
      throw new RpcException({
        statusCode: 404,
        message: `Không tìm thấy mẫu hợp đồng với id ${templateId}`,
      });
    }
    Object.assign(contractTemplate, updateContractTemplateDto);
    contractTemplate.updatedAt = new Date();
    return contractTemplate.save(); 
  }

  async removeContractTemplate(templateId: string): Promise<ContractTemplateDocument> {
    const contractTemplate = await this.contractTemplateModel
      .findOneAndDelete({ templateId })
      .exec();
    if (!contractTemplate) {
      throw new RpcException({
        statusCode: 404,
        message: `Không tìm thấy mẫu hợp đồng với id ${templateId}`,
      });
    }
    return contractTemplate;
  }
}