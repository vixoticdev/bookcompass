import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RecommendationsController } from './recommendations.controller';
import { RecommendationsService } from './recommendations.service';
import {
  RecommendationSession,
  RecommendationSessionSchema,
} from './schemas/recommendation-session.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RecommendationSession.name, schema: RecommendationSessionSchema },
    ]),
  ],
  controllers: [RecommendationsController],
  providers: [RecommendationsService],
  exports: [RecommendationsService],
})
export class RecommendationsModule {}
