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

  findAllContracts(page: number, limit: number, roomId?: string, tenantId?: string, isActive?: boolean) {
    if (isActive !== undefined && typeof isActive === 'string') {
      isActive = isActive === 'true';
    }
    return this.contractService.findAllContracts({ page, limit, roomId, tenantId, isActive });
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

  // Stay Record Methods
  createStayRecord(createStayRecordDto: any) {
    return this.contractService.createStayRecord(createStayRecordDto);
  }

  findAllStayRecords(paginationDto: any) {
    return this.contractService.findAllStayRecords(paginationDto);
  }

  findOneStayRecord(stayId: string) {
    return this.contractService.findOneStayRecord({ stayId });
  }

  updateStayRecord(stayId: string, updateStayRecordDto: any) {
    return this.contractService.updateStayRecord({ stayId, ...updateStayRecordDto });
  }

  removeStayRecord(stayId: string) {
    return this.contractService.removeStayRecord({ stayId });
  }
}
