import { Test, TestingModule } from '@nestjs/testing';
import { ContractController } from './contract.controller';
import { ContractService } from './contract.service';

describe('ContractController', () => {
  let contractController: ContractController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ContractController],
      providers: [ContractService],
    }).compile();

    contractController = app.get<ContractController>(ContractController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(contractController.getHello()).toBe('Hello World!');
    });
  });
});
