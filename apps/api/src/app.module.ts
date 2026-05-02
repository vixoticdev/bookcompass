import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'node:path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthorsModule } from './authors/authors.module';
import { BooksModule } from './books/books.module';
import { DnfModule } from './dnf/dnf.module';
import { ProfilesModule } from './profiles/profiles.module';
import { ReadingEventsModule } from './reading-events/reading-events.module';
import { RecommendationsModule } from './recommendations/recommendations.module';
import { UsersModule } from './users/users.module';

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

const domainImports =
  process.env.NODE_ENV === 'test'
    ? []
    : [
        UsersModule,
        ProfilesModule,
        AuthorsModule,
        BooksModule,
        ReadingEventsModule,
        DnfModule,
        RecommendationsModule,
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
    ...domainImports,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
