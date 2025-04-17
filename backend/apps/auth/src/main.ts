import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { Auth } from '@app/commonn';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  // Tạo một ApplicationContext tạm thời để lấy ConfigService
  const appContext = await NestFactory.createApplicationContext(AuthModule);
  const configService = appContext.get(ConfigService);
  const grpcPort =
    configService.get<number>('AUTH_SERVICE_URL') || 'localhost:5000';
  console.log('Running Auth Service on port: ', grpcPort);
  await appContext.close(); // Đóng context tạm thời

  // Sử dụng giá trị port lấy được trong cấu hình gRPC
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthModule,
    {
      transport: Transport.GRPC,
      options: {
        url: `${grpcPort}`,
        protoPath: join(__dirname, '../auth.proto'),
        package: Auth.AUTH_PACKAGE_NAME,
      },
    },
  );
  await app.listen();
}
bootstrap();
