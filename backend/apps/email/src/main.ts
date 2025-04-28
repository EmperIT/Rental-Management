import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { EmailModule } from './email.module';
import { ConfigService } from '@nestjs/config';
import { Email } from '@app/commonn';
async function bootstrap() {
  // Tạo một ApplicationContext tạm thời để lấy ConfigService
    const appContext = await NestFactory.createApplicationContext(EmailModule);
    const configService = appContext.get(ConfigService);
    const grpcPort =
      configService.get<number>('EMAIL_SERVICE_URL') || 'localhost:5004';
    console.log('Running  Emailrvice on port: ', grpcPort);
    await appContext.close(); // Đóng context tạm thời
  
  // Sử dụng giá trị port lấy được trong cấu hình gRPC
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
      EmailModule,
      {
        transport: Transport.GRPC,
        options: {
          url: `${grpcPort}`,
          protoPath: join(__dirname, '../email.proto'),
          package: Email.EMAIL_PACKAGE_NAME,
        },
      },
    );

  await app.listen();
}
bootstrap();
