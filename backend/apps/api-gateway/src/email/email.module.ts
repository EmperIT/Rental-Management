import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Email } from '@app/commonn';
import { EMAIL_SERVICE } from './constants';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ClientsModule.registerAsync([
        {
            name: EMAIL_SERVICE,
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
            transport: Transport.GRPC,
            options: {
                url:
                configService.get<string>('EMAIL_SERVICE_URL') ||
                'localhost:5004',
                package: Email.EMAIL_PACKAGE_NAME,
                protoPath: join(__dirname, '../email.proto'),
            },
            }),
            inject: [ConfigService],
        },
        ]),
  ],
  controllers: [EmailController],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}