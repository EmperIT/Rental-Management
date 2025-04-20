import { Module } from '@nestjs/common';
import { ContractService } from './contract.service';
import { ContractController } from './contract.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CONTRACT_SERVICE } from './constants';
import { join } from 'path';
import { Contract } from '@app/commonn';
@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: CONTRACT_SERVICE,
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            url:
              configService.get<string>('CONTRACT_SERVICE_URL') ||
              'localhost:5000',
            package: Contract.CONTRACT_PACKAGE_NAME,
            protoPath: join(__dirname, '../contract.proto'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [ContractController],
  providers: [ContractService],
})
export class ContractModule {}
