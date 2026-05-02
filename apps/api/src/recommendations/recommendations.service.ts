import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRecommendationSessionDto } from './dto/create-recommendation-session.dto';
import { RecommendationSession } from './schemas/recommendation-session.schema';

@Injectable()
export class RecommendationsService {
  constructor(
    @InjectModel(RecommendationSession.name)
    private readonly recommendationSessionModel: Model<RecommendationSession>,
  ) {}

  create(createRecommendationSessionDto: CreateRecommendationSessionDto) {
    return this.recommendationSessionModel.create(
      createRecommendationSessionDto,
    );
  }

  findAll() {
    return this.recommendationSessionModel
      .find()
      .sort({ createdAt: -1 })
      .exec();
  }
}
