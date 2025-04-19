import { Module } from '@nestjs/common';
import { RentalService } from './rental.service';
import { RentalController } from './rental.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RENTAL_SERVICE } from './constants';
import { Rental } from '@app/commonn';
import { join } from 'path';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: RENTAL_SERVICE,
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            url:
              configService.get<string>('RENTAL_SERVICE_URL') || 'localhost:5001',
            package: Rental.RENTAL_PACKAGE_NAME,
            protoPath: join(__dirname, '../rental.proto'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [RentalController],
  providers: [RentalService],
})
export class RentalModule {}