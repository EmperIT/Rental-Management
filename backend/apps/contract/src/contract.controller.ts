import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ContractService } from './contract.service';

@Controller()
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @GrpcMethod('ContractService', 'CreateContract')
  async createContract(data: any) {
    const contract = await this.contractService.create(data);
    return this.mapToContractResponse(contract);
  }

  @GrpcMethod('ContractService', 'FindAllContracts')
  async findAllContracts(data: any) {
    const { contracts, total } = await this.contractService.findAll(data);
    return {
      contracts: contracts.map(this.mapToContractResponse),
      total,
    };
  }

  @GrpcMethod('ContractService', 'FindOneContract')
  async findOneContract(data: { contract_id: string }) {
    const contract = await this.contractService.findOne(data.contract_id);
    return this.mapToContractResponse(contract);
  }

  @GrpcMethod('ContractService', 'UpdateContract')
  async updateContract(data: any) {
    const contract = await this.contractService.update(data);
    return this.mapToContractResponse(contract);
  }

  @GrpcMethod('ContractService', 'RemoveContract')
  async removeContract(data: { contract_id: string }) {
    const contract = await this.contractService.remove(data.contract_id);
    return this.mapToContractResponse(contract);
  }

  private mapToContractResponse(contract: any) {
    return {
      contract_id: contract.contract_id,
      isActive: contract.isActive,
      roomId: contract.roomId,
      content: contract.content,
      createdAt: contract.createdAt.toISOString(),
      updatedAt: contract.updatedAt.toISOString(),
      startDate: contract.startDate.toISOString(),
      endDate: contract.endDate.toISOString(),
      deposit: contract.deposit,
      rentAmount: contract.rentAmount,
      templateId: contract.templateId,
    };
  }
}