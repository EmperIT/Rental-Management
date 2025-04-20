import { Test, TestingModule } from '@nestjs/testing';
import { RentalController } from './rental.controller';
import { RentalService } from './rental.service';

describe('RentalController', () => {
  let rentalController: RentalController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [RentalController],
      providers: [RentalService],
    }).compile();

    rentalController = app.get<RentalController>(RentalController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(rentalController.getHello()).toBe('Hello World!');
    });
  });
});
