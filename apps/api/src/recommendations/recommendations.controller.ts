import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateRecommendationSessionDto } from './dto/create-recommendation-session.dto';
import { RecommendationsService } from './recommendations.service';

@Controller('recommendation-sessions')
export class RecommendationsController {
  constructor(
    private readonly recommendationsService: RecommendationsService,
  ) {}

  @Post()
  create(
    @Body() createRecommendationSessionDto: CreateRecommendationSessionDto,
  ) {
    return this.recommendationsService.create(createRecommendationSessionDto);
  }

  @Get()
  findAll() {
    return this.recommendationsService.findAll();
  }
}
