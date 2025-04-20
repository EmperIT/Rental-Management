import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Contract } from '@app/commonn';
import { CONTRACT_SERVICE } from './constants';

@Injectable()
export class ContractService implements OnModuleInit {
  private contractService: Contract.ContractServiceClient;

  constructor(@Inject(CONTRACT_SERVICE) private client: ClientGrpc) {}

  onModuleInit() {
    this.contractService = this.client.getService<Contract.ContractServiceClient>(
      Contract.CONTRACT_SERVICE_NAME,
    );
  }

  // Contract Methods
  createContract(createContractDto: Contract.CreateContractDto) {
    return this.contractService.createContract(createContractDto);
  }

  findAllContracts(page: number, limit: number) {
    return this.contractService.findAllContracts({ page, limit });
  }

  findOneContract(id: string) {
    return this.contractService.findOneContract({ contractId: id });
  }

  updateContract(id: string, updateContractDto: Contract.UpdateContractDto) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { contractId: _, ...updateData } = updateContractDto;
    return this.contractService.updateContract({ contractId: id, ...updateData });
  }

  removeContract(id: string) {
    return this.contractService.removeContract({ contractId: id });
  }
}
