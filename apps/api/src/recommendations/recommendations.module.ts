import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { BooksModule } from '../books/books.module';
import { DnfModule } from '../dnf/dnf.module';
import { ProfilesModule } from '../profiles/profiles.module';
import { ReadingEventsModule } from '../reading-events/reading-events.module';
import { RecommendationsController } from './recommendations.controller';
import { RecommendationsService } from './recommendations.service';
import {
  RecommendationSession,
  RecommendationSessionSchema,
} from './schemas/recommendation-session.schema';
import {
  RecommendationTuning,
  RecommendationTuningSchema,
} from './schemas/recommendation-tuning.schema';

@Module({
  imports: [
    AuthModule,
    BooksModule,
    DnfModule,
    ProfilesModule,
    ReadingEventsModule,
    MongooseModule.forFeature([
      { name: RecommendationSession.name, schema: RecommendationSessionSchema },
      { name: RecommendationTuning.name, schema: RecommendationTuningSchema },
    ]),
  ],
  controllers: [RecommendationsController],
  providers: [RecommendationsService],
  exports: [RecommendationsService],
})
export class RecommendationsModule {}
