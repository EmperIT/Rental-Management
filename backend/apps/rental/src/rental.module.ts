import { Logger, Module } from '@nestjs/common';
import { RentalController } from './rental.controller';
import { RentalService } from './rental.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RoomSchema } from './schemas/rooms.schema';
import { TenantSchema } from './schemas/tenants.schema';
import { InvoiceSchema } from './schemas/invoices.schema';
import { ServiceSchema } from './schemas/services.schema';
import { RoomServiceSchema } from './schemas/room-services.schema';
import { AssetSchema } from './schemas/assets.schema';
import { RoomAssetSchema } from './schemas/room-assets.schema';
import { TransactionSchema } from './schemas/transaction.schema';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
import { join } from 'path';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Email } from '@app/commonn';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(), // Thêm schedule module để hỗ trợ cron jobs
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }), // Thêm HttpModule để gọi API đến gateway
    // Add Email client module
    ClientsModule.registerAsync([
      {
        name: Email.EMAIL_PACKAGE_NAME,
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            url: configService.get('EMAIL_SERVICE_URL') || 'localhost:5003',
            package: Email.EMAIL_PACKAGE_NAME,
            protoPath: join(__dirname, '../email.proto'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
    MongooseModule.forFeature([
      { name: 'Room', schema: RoomSchema },
      { name: 'Tenant', schema: TenantSchema },
      { name: 'Invoice', schema: InvoiceSchema },
      { name: 'Service', schema: ServiceSchema },
      { name: 'RoomService', schema: RoomServiceSchema },
      { name: 'Asset', schema: AssetSchema },
      { name: 'RoomAsset', schema: RoomAssetSchema },
      { name: 'Transaction', schema: TransactionSchema },
    ]),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const uri = configService.get<string>('MONGO_RENTAL_URI');
        Logger.log(`MONGO_RENTAL_URI: ${uri}`, 'MongooseModule');
        return { uri };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [RentalController],
  providers: [RentalService],
})
export class RentalModule {}
