import { Logger, Module } from '@nestjs/common';
import { RentalController } from './rental.controller';
import { RentalService } from './rental.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RoomSchema } from './schemas/rooms.schema';
import { TenantSchema } from './schemas/tenants.schema';
import { InvoiceSchema } from './schemas/invoices.schema';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forFeature([
      { name: 'Room', schema: RoomSchema },
      { name: 'Tenant', schema: TenantSchema },
      { name: 'Invoice', schema: InvoiceSchema },
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
