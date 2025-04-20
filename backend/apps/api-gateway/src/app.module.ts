import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { RentalModule } from './rental/rental.module';


@Module({
  imports: [AuthModule, RentalModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
