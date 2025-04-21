import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ContractService } from './contract.service';

@Controller()
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @GrpcMethod('ContractService', 'CreateContract')
  async createContract(data: any) {
    const contract = await this.contractService.createContract(data);
    return this.mapToContractResponse(contract);
  }

  @GrpcMethod('ContractService', 'FindAllContracts')
  async findAllContracts(data: any) {
    const { contracts, total } = await this.contractService.findAllContracts(data);
    return {
      contracts: contracts.map(this.mapToContractResponse),
      total,
    };
  }

  @GrpcMethod('ContractService', 'FindOneContract')
  async findOneContract(data: { contract_id: string }) {
    const contract = await this.contractService.findOneContract(data.contract_id);
    return this.mapToContractResponse(contract);
  }

  @GrpcMethod('ContractService', 'UpdateContract')
  async updateContract(data: any) {
    const contract = await this.contractService.updateContract(data);
    return this.mapToContractResponse(contract);
  }

  @GrpcMethod('ContractService', 'RemoveContract')
  async removeContract(data: { contract_id: string }) {
    const contract = await this.contractService.removeContract(data.contract_id);
    return this.mapToContractResponse(contract);
  }

  @GrpcMethod('ContractService', 'CreateContractTemplate')
  async createContractTemplate(data: any) {
    const contractTemplate = await this.contractService.createContractTemplate(data);
    return this.mapToContractTemplateResponse(contractTemplate);
  }
  
  @GrpcMethod('ContractService', 'FindAllContractTemplates')
  async findAllContractTemplates(data: any) {
    const { contractTemplates, total } = await this.contractService.findAllContractTemplates(data);
    return {
      contractTemplates: contractTemplates.map(this.mapToContractTemplateResponse),
      total,
    };
  }

  @GrpcMethod('ContractService', 'FindOneContractTemplate')
  async findOneContractTemplate(data: { templateId: string }) {
    const contractTemplate = await this.contractService.findOneContractTemplate(data.templateId);
    return this.mapToContractTemplateResponse(contractTemplate);
  }

  @GrpcMethod('ContractService', 'UpdateContractTemplate')
  async updateContractTemplate(data: any) {
    const contractTemplate = await this.contractService.updateContractTemplate(data);
    return this.mapToContractTemplateResponse(contractTemplate);
  }

  @GrpcMethod('ContractService', 'RemoveContractTemplate')
  async removeContractTemplate(data: { templateId: string }) {
    const contractTemplate = await this.contractService.removeContractTemplate(data.templateId);
    return this.mapToContractTemplateResponse(contractTemplate);
  }

  private mapToContractTemplateResponse(contractTemplate: any) {
    return {
      template_id: contractTemplate.template_id,
      name: contractTemplate.name,
      content: contractTemplate.content,
      createdAt: contractTemplate.createdAt.toISOString(),
      updatedAt: contractTemplate.updatedAt.toISOString(),
    };
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