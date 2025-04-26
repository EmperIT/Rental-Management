import { Controller, Logger } from '@nestjs/common';
import { ContractService } from './contract.service';
import { GrpcMethod } from '@nestjs/microservices';

// Các kiểu dữ liệu đơn giản cho các tham số và kết quả
interface CreateContractDto {
  roomId: string;
  tenantId: string;
  content: string;
  startDate: string;
  endDate: string;
  deposit: number;
  rentAmount: number;
  templateId: string;
}

interface PaginationDto {
  page: number;
  limit: number;
}

interface FindOneContractDto {
  contractId: string;
}

interface UpdateContractDto {
  contractId: string;
  isActive?: boolean;
  roomId?: string;
  tenantId?: string;
  content?: string;
  startDate?: string;
  endDate?: string;
  deposit?: number;
  rentAmount?: number;
  templateId?: string;
}

interface Contract {
  contractId: string;
  isActive: boolean;
  roomId: string;
  tenantId: string;
  content: string;
  startDate: string;
  endDate: string;
  deposit?: number;
  rentAmount?: number;
  templateId?: string;
  createdAt: string;
  updatedAt: string;
}

interface Contracts {
  contracts: Contract[];
  total: number;
}

@Controller()
export class ContractController {
  private readonly logger = new Logger(ContractController.name);

  constructor(private readonly contractService: ContractService) {}

  @GrpcMethod('ContractService', 'CreateContract')
  async createContract(createContractDto: CreateContractDto): Promise<Contract> {
    this.logger.log(`Creating contract for room: ${createContractDto.roomId}, tenant: ${createContractDto.tenantId}`);
    const contract = await this.contractService.createContract(createContractDto);
    return {
      contractId: contract._id.toString(),
      isActive: contract.isActive,
      roomId: contract.roomId,
      tenantId: contract.tenantId,
      content: contract.content,
      startDate: contract.startDate.toISOString(),
      endDate: contract.endDate.toISOString(),
      createdAt: contract.createdAt.toISOString(),
      updatedAt: contract.updatedAt.toISOString()
    };
  }

  @GrpcMethod('ContractService', 'FindAllContracts')
  async findAllContracts(paginationDto: PaginationDto): Promise<Contracts> {
    this.logger.log(`Finding all contracts with pagination: ${JSON.stringify(paginationDto)}`);
    const result = await this.contractService.findAllContracts(paginationDto);
    
    return {
      contracts: result.contracts.map(contract => ({
        contractId: contract._id.toString(),
        isActive: contract.isActive,
        roomId: contract.roomId,
        tenantId: contract.tenantId,
        content: contract.content,
        startDate: contract.startDate.toISOString(),
        endDate: contract.endDate.toISOString(),
        createdAt: contract.createdAt.toISOString(),
        updatedAt: contract.updatedAt.toISOString()
      })),
      total: result.total
    };
  }

  @GrpcMethod('ContractService', 'FindOneContract')
  async findOneContract(dto: FindOneContractDto): Promise<Contract> {
    this.logger.log(`Finding contract with ID: ${dto.contractId}`);
    const contract = await this.contractService.findOneContract(dto.contractId);
    return {
      contractId: contract._id.toString(),
      isActive: contract.isActive,
      roomId: contract.roomId,
      tenantId: contract.tenantId,
      content: contract.content,
      startDate: contract.startDate.toISOString(),
      endDate: contract.endDate.toISOString(),
      createdAt: contract.createdAt.toISOString(),
      updatedAt: contract.updatedAt.toISOString()
    };
  }

  @GrpcMethod('ContractService', 'UpdateContract')
  async updateContract(updateContractDto: UpdateContractDto): Promise<Contract> {
    this.logger.log(`Updating contract with ID: ${updateContractDto.contractId}`);
    const contract = await this.contractService.updateContract({
      _id: updateContractDto.contractId,
      isActive: updateContractDto.isActive,
      roomId: updateContractDto.roomId,
      tenantId: updateContractDto.tenantId,
      content: updateContractDto.content,
      startDate: updateContractDto.startDate,
      endDate: updateContractDto.endDate
    });
    
    return {
      contractId: contract._id.toString(),
      isActive: contract.isActive,
      roomId: contract.roomId,
      tenantId: contract.tenantId,
      content: contract.content,
      startDate: contract.startDate.toISOString(),
      endDate: contract.endDate.toISOString(),
      createdAt: contract.createdAt.toISOString(),
      updatedAt: contract.updatedAt.toISOString()
    };
  }

  @GrpcMethod('ContractService', 'RemoveContract')
  async removeContract(dto: FindOneContractDto): Promise<Contract> {
    this.logger.log(`Removing contract with ID: ${dto.contractId}`);
    const contract = await this.contractService.removeContract(dto.contractId);
    
    return {
      contractId: contract._id.toString(),
      isActive: contract.isActive,
      roomId: contract.roomId,
      tenantId: contract.tenantId,
      content: contract.content,
      startDate: contract.startDate.toISOString(),
      endDate: contract.endDate.toISOString(),
      createdAt: contract.createdAt.toISOString(),
      updatedAt: contract.updatedAt.toISOString()
    };
  }
}