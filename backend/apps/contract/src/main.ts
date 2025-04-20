import { NestFactory } from '@nestjs/core';
import { ContractModule } from './contract.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { Contract } from '@app/commonn';
async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ContractModule,
    {
      transport: Transport.GRPC,
      options: {
        url: process.env.CONTRACT_SERVICE_URL || 'localhost:5000',
        package: Contract.CONTRACT_PACKAGE_NAME,
        protoPath: join(__dirname, '../contract.proto'),
      },
    },
  );
  await app.listen();
}
bootstrap();
