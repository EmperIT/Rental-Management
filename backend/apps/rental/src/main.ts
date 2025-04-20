import { NestFactory } from '@nestjs/core';
import { RentalModule } from './rental.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { Rental } from '@app/commonn';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  // Tạo một ApplicationContext tạm thời để lấy ConfigService
  const appContext = await NestFactory.createApplicationContext(RentalModule);
  const configService = appContext.get(ConfigService);
  const grpcPort =
    configService.get<string>('RENTAL_SERVICE_URL') || 'localhost:5002';
  console.log('Running Rental Service on port: ', grpcPort);
  await appContext.close(); // Đóng context tạm thời

  // Sử dụng giá trị port lấy được trong cấu hình gRPC
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    RentalModule,
    {
      transport: Transport.GRPC,
      options: {
        url: `${grpcPort}`,
        protoPath: join(__dirname, '../rental.proto'),
        package: Rental.RENTAL_PACKAGE_NAME,
      },
    },
  );
  await app.listen();
}
bootstrap();
