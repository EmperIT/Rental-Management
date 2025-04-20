import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { RentalModule } from './rental/rental.module';
import { ContractModule } from './contract/contract.module';

@Module({
  imports: [AuthModule, RentalModule, ContractModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
