import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import createClient from 'ioredis';
import { TemplatesModule } from './templates/templates.module';
import { ListsModule } from './lists/lists.module';
import { HistoryModule } from './history/history.module';
import { SendModule } from './send/send.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true,
    }),
    TemplatesModule,
    ListsModule,
    HistoryModule,
    SendModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        return new createClient({
          host: process.env.REDIS_HOST,
          port: Number(process.env.REDIS_PORT),
        });
      },
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class AppModule {}
