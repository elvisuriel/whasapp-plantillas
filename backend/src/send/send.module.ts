import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SendService } from './send.service';
import { SendController } from './send.controller';
import { SendEntity } from './send.entity/send.entity';
import { WhatsappModule } from '../whatsapp/whatsapp.module';

@Module({
  imports: [TypeOrmModule.forFeature([SendEntity]), WhatsappModule],
  controllers: [SendController],
  providers: [SendService],
  exports: [TypeOrmModule],
})
export class SendModule {}
