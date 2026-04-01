import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SendService } from './send.service';
import { SendController } from './send.controller';
import { SendEntity } from './send.entity/send.entity';
import { WhatsappApiService } from './whatsapp-api.service';

@Module({
  imports: [TypeOrmModule.forFeature([SendEntity])],
  controllers: [SendController],
  providers: [SendService, WhatsappApiService],
  exports: [TypeOrmModule],
})
export class SendModule {}
