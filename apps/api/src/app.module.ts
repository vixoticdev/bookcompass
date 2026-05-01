import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'node:path';
import { AppController } from './app.controller';
import { AppService } from './app.service';

const databaseImports =
  process.env.NODE_ENV === 'test'
    ? []
    : [
        MongooseModule.forRootAsync({
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            uri:
              configService.get<string>('MONGODB_URI') ??
              'mongodb://localhost:27017/bookcompass',
          }),
        }),
      ];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        join(process.cwd(), '../../.env.local'),
        join(process.cwd(), '.env.local'),
        join(process.cwd(), '../../.env'),
        join(process.cwd(), '.env'),
      ],
    }),
    ...databaseImports,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
