import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BooksService } from '../books/books.service';
import { DnfService } from '../dnf/dnf.service';
import { ProfilesService } from '../profiles/profiles.service';
import { ReadingEventsService } from '../reading-events/reading-events.service';
import { CreateRecommendationSessionDto } from './dto/create-recommendation-session.dto';
import { RecommendationSession } from './schemas/recommendation-session.schema';

@Injectable()
export class RecommendationsService {
  constructor(
    @InjectModel(RecommendationSession.name)
    private readonly recommendationSessionModel: Model<RecommendationSession>,
    private readonly profilesService: ProfilesService,
    private readonly readingEventsService: ReadingEventsService,
    private readonly dnfService: DnfService,
    private readonly booksService: BooksService,
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

  async buildInput(
    userId: string,
    context: CreateRecommendationSessionDto['context'],
  ) {
    const [profile, readingEvents, dnfRecords, catalogCandidates] =
      await Promise.all([
        this.profilesService.findByUserId(userId),
        this.readingEventsService.findByUserId(userId),
        this.dnfService.findByUserId(userId),
        this.booksService.findAll({
          outcome: context.selectedOutcome,
          depth: context.preferredDepth,
          maxEstimatedMinutes: context.availableMinutes,
          limit: 50,
          offset: 0,
        }),
      ]);

    return {
      userId,
      context,
      profile,
      readingEvents,
      dnfRecords,
      catalogCandidates: catalogCandidates.items,
      candidateTotal: catalogCandidates.total,
    };
  }
}
