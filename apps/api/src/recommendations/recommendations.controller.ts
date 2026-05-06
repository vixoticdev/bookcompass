import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthenticatedUser } from '../auth/auth.types';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateRecommendationSessionDto } from './dto/create-recommendation-session.dto';
import { RecommendationsService } from './recommendations.service';

@Controller('recommendation-sessions')
export class RecommendationsController {
  constructor(
    private readonly recommendationsService: RecommendationsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createRecommendationSessionDto: CreateRecommendationSessionDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.recommendationsService.create({
      ...createRecommendationSessionDto,
      userId: user.id,
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  findAll() {
    return this.recommendationsService.findAll();
  }
}
