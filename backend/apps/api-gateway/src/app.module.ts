import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { RentalModule } from './rental/rental.module';
import { ContractModule } from './contract/contract.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [AuthModule, RentalModule, EmailModule, ContractModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
