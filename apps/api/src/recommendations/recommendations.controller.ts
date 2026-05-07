import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthenticatedUser } from '../auth/auth.types';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateRecommendationSessionDto } from './dto/create-recommendation-session.dto';
import { RecordRecommendationFeedbackDto } from './dto/record-recommendation-feedback.dto';
import { UpdateRecommendationTuningDto } from './dto/update-recommendation-tuning.dto';
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

  @UseGuards(JwtAuthGuard)
  @Get('me')
  findMine(@CurrentUser() user: AuthenticatedUser) {
    return this.recommendationsService.findByUserId(user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('admin/analytics')
  adminAnalytics() {
    return this.recommendationsService.getAdminAnalytics();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('admin/tuning')
  adminTuning() {
    return this.recommendationsService.getActiveTuning();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch('admin/tuning')
  updateAdminTuning(@Body() tuningDto: UpdateRecommendationTuningDto) {
    return this.recommendationsService.updateActiveTuning(tuningDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':sessionId/feedback')
  recordFeedback(
    @Param('sessionId') sessionId: string,
    @Body() feedbackDto: RecordRecommendationFeedbackDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.recommendationsService.recordFeedback(
      user.id,
      sessionId,
      feedbackDto,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  findAll() {
    return this.recommendationsService.findAll();
  }
}
