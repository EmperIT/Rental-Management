import { Controller, Logger } from '@nestjs/common';
import { ContractService } from './contract.service';
import { GrpcMethod } from '@nestjs/microservices';

// Các kiểu dữ liệu đơn giản cho Contract
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

// Các kiểu dữ liệu cho Stay Record
interface CreateStayRecordDto {
  tenantId: string;
  startDate: string;
  endDate: string;
  content: string;
  createdBy: string;
}

interface StayRecordPaginationDto {
  page: number;
  limit: number;
  tenantId?: string;
  status?: "active' | 'expired' | 'inactive';";
  startDateFrom?: string;
  startDateTo?: string;
  endDateFrom?: string;
  endDateTo?: string;
}

interface FindOneStayRecordDto {
  stayId: string;
}

interface UpdateStayRecordDto {
  stayId: string;
  tenantId: string;
  startDate: string;
  endDate: string;
  status: "active" | 'expired' | 'inactive';
  content: string;
}

interface RemoveStayRecordDto {
  stayId: string;
}

interface StayRecord {
  stayId: string;
  tenantId: string;
  startDate: string;
  endDate: string;
  status: string;
  content: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface StayRecords {
  records: StayRecord[];
  total: number;
}

@Controller()
export class ContractController {
  private readonly logger = new Logger(ContractController.name);

  constructor(private readonly contractService: ContractService) {}

  // Contract methods
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

  // Stay Record methods
  @GrpcMethod('ContractService', 'CreateStayRecord')
  async createStayRecord(createStayRecordDto: CreateStayRecordDto): Promise<StayRecord> {
    this.logger.log(`Creating stay record for tenant: ${createStayRecordDto.tenantId}`);
    const stayRecord = await this.contractService.createStayRecord(createStayRecordDto);
    
    return {
      stayId: stayRecord.stayId,
      tenantId: stayRecord.tenantId,
      startDate: stayRecord.startDate.toISOString(),
      endDate: stayRecord.endDate.toISOString(),
      status: stayRecord.status,
      content: stayRecord.content,
      createdBy: stayRecord.createdBy,
      createdAt: stayRecord.createdAt.toISOString(),
      updatedAt: stayRecord.updatedAt.toISOString()
    };
  }

  @GrpcMethod('ContractService', 'FindAllStayRecords')
  async findAllStayRecords(paginationDto: StayRecordPaginationDto): Promise<StayRecords> {
    this.logger.log(`Finding all stay records with filters: ${JSON.stringify(paginationDto)}`);
    const result = await this.contractService.findAllStayRecords(paginationDto);
    
    return {
      records: result.records.map(record => ({
        stayId: record.stayId,
        tenantId: record.tenantId,
        startDate: record.startDate.toISOString(),
        endDate: record.endDate.toISOString(),
        status: record.status,
        content: record.content,
        createdBy: record.createdBy,
        createdAt: record.createdAt.toISOString(),
        updatedAt: record.updatedAt.toISOString()
      })),
      total: result.total
    };
  }

  @GrpcMethod('ContractService', 'FindOneStayRecord')
  async findOneStayRecord(dto: FindOneStayRecordDto): Promise<StayRecord> {
    this.logger.log(`Finding stay record with ID: ${dto.stayId}`);
    const stayRecord = await this.contractService.findOneStayRecord(dto.stayId);
    
    return {
      stayId: stayRecord.stayId,
      tenantId: stayRecord.tenantId,
      startDate: stayRecord.startDate.toISOString(),
      endDate: stayRecord.endDate.toISOString(),
      status: stayRecord.status,
      content: stayRecord.content,
      createdBy: stayRecord.createdBy,
      createdAt: stayRecord.createdAt.toISOString(),
      updatedAt: stayRecord.updatedAt.toISOString()
    };
  }

  @GrpcMethod('ContractService', 'UpdateStayRecord')
  async updateStayRecord(updateStayRecordDto: UpdateStayRecordDto): Promise<StayRecord> {
    this.logger.log(`Updating stay record with ID: ${updateStayRecordDto.stayId}`);
    const stayRecord = await this.contractService.updateStayRecord(updateStayRecordDto);
    
    return {
      stayId: stayRecord.stayId,
      tenantId: stayRecord.tenantId,
      startDate: stayRecord.startDate.toISOString(),
      endDate: stayRecord.endDate.toISOString(),
      status: stayRecord.status,
      content: stayRecord.content,
      createdBy: stayRecord.createdBy,
      createdAt: stayRecord.createdAt.toISOString(),
      updatedAt: stayRecord.updatedAt.toISOString()
    };
  }

  @GrpcMethod('ContractService', 'RemoveStayRecord')
  async removeStayRecord(dto: FindOneStayRecordDto): Promise<StayRecord> {
    this.logger.log(`Removing stay record with ID: ${dto.stayId}`);
    const stayRecord = await this.contractService.removeStayRecord(dto.stayId);
    
    return {
      stayId: stayRecord.stayId,
      tenantId: stayRecord.tenantId,
      startDate: stayRecord.startDate.toISOString(),
      endDate: stayRecord.endDate.toISOString(),
      status: stayRecord.status,
      content: stayRecord.content,
      createdBy: stayRecord.createdBy,
      createdAt: stayRecord.createdAt.toISOString(),
      updatedAt: stayRecord.updatedAt.toISOString()
    };
  }
}