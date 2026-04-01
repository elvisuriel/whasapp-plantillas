import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TemplatesService } from './templates.service';
import { TemplatesController } from './templates.controller';
import { TemplateEntity } from './template.entity/template.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TemplateEntity])],
  controllers: [TemplatesController],
  providers: [TemplatesService],
  exports: [TypeOrmModule],
})
export class TemplatesModule {}
