import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContractSchema } from './schemas/contract.schema';
import { ContractTemplateSchema } from './schemas/contract.schema'; // ✅ Thêm dòng này
import { ContractService } from './contract.service';
import { ContractController } from './contract.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forFeature([
      { name: 'Contract', schema: ContractSchema },
      { name: 'ContractTemplate', schema: ContractTemplateSchema },
    ]),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const uri = configService.get<string>('MONGO_CONTRACT_URI');
        return { uri };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [ContractService],
  controllers: [ContractController],
})
export class ContractModule {}
