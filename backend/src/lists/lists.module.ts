import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListsService } from './lists.service';
import { ListsController } from './lists.controller';
import { ListEntity } from './list.entity/list.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ListEntity])],
  controllers: [ListsController],
  providers: [ListsService],
  exports: [TypeOrmModule],
})
export class ListsModule {}
