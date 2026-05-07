import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { RecommendationSignal } from '@bookcompass/shared';
import { BooksService } from '../books/books.service';
import { DnfService } from '../dnf/dnf.service';
import { ProfilesService } from '../profiles/profiles.service';
import { ReadingEventsService } from '../reading-events/reading-events.service';
import { CreateRecommendationSessionDto } from './dto/create-recommendation-session.dto';
import { RecordRecommendationFeedbackDto } from './dto/record-recommendation-feedback.dto';
import { RecommendationSession } from './schemas/recommendation-session.schema';

type ScoreableBook = {
  _id?: unknown;
  id?: unknown;
  title: string;
  genres?: string[];
  outcomeTags?: string[];
  pacing?: string;
  difficulty?: string;
  depth?: string;
  formats?: string[];
  estimatedMinutes?: number;
};

type ScoreableProfile = {
  favoriteGenres?: string[];
  dislikedGenres?: string[];
  targetOutcomes?: string[];
  preferredDepth?: string;
  pacingTolerance?: string;
  difficultyTolerance?: string;
  preferredFormats?: string[];
  dailyReadingMinutes?: number;
};

type ScoreableReadingEvent = {
  bookId: unknown;
  eventType: string;
};

type ScoreableDnfRecord = {
  bookId: unknown;
  reason: string;
  stoppedAtPercent?: number;
  pacingSnapshot?: string;
  difficultySnapshot?: string;
};

type ScoredCandidate = {
  bookId: string;
  finalScore: number;
  scoreBreakdown: Record<string, number>;
  signals: RecommendationSignal[];
  explanation: string[];
};

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

  async create(createRecommendationSessionDto: CreateRecommendationSessionDto) {
    const userId = createRecommendationSessionDto.userId;

    if (!userId) {
      return this.recommendationSessionModel.create(
        createRecommendationSessionDto,
      );
    }

    const input = await this.buildInput(
      userId,
      createRecommendationSessionDto.context,
    );
    const candidates = this.scoreCandidates(input);

    return this.recommendationSessionModel.create({
      ...createRecommendationSessionDto,
      candidates,
      status: 'scored',
    });
  }

  findAll() {
    return this.recommendationSessionModel
      .find()
      .sort({ createdAt: -1 })
      .exec();
  }

  findByUserId(userId: string) {
    return this.recommendationSessionModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async recordFeedback(
    userId: string,
    sessionId: string,
    feedbackDto: RecordRecommendationFeedbackDto,
  ) {
    const recordedAt = new Date();
    const session = await this.recommendationSessionModel
      .findOneAndUpdate(
        {
          _id: sessionId,
          userId,
          'candidates.bookId': feedbackDto.bookId,
        },
        {
          $set: {
            status: 'feedback-recorded',
            'candidates.$.feedback': {
              status: feedbackDto.status,
              progressPercent: feedbackDto.progressPercent,
              note: feedbackDto.note,
              recordedAt,
            },
          },
        },
        { returnDocument: 'after' },
      )
      .exec();

    if (!session) {
      throw new NotFoundException('Recommendation candidate was not found');
    }

    const eventType = this.toReadingEventType(feedbackDto.status);
    if (eventType) {
      await this.readingEventsService.create({
        userId,
        bookId: feedbackDto.bookId,
        eventType,
        progressPercent:
          feedbackDto.progressPercent ?? this.defaultProgress(eventType),
        note: feedbackDto.note,
        occurredAt: recordedAt,
      });
    }

    return session;
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

  scoreCandidates(
    input: Awaited<ReturnType<RecommendationsService['buildInput']>>,
  ) {
    return input.catalogCandidates
      .map((book) =>
        this.scoreCandidate(
          book as ScoreableBook,
          input.profile as ScoreableProfile,
          input.readingEvents as ScoreableReadingEvent[],
          input.dnfRecords as ScoreableDnfRecord[],
          input.context,
        ),
      )
      .sort((a, b) => b.finalScore - a.finalScore)
      .slice(0, 10);
  }

  private scoreCandidate(
    book: ScoreableBook,
    profile: ScoreableProfile,
    readingEvents: ScoreableReadingEvent[],
    dnfRecords: ScoreableDnfRecord[],
    context: CreateRecommendationSessionDto['context'],
  ): ScoredCandidate {
    const bookId = this.getBookId(book);
    const signals: RecommendationSignal[] = [];
    const scoreBreakdown = {
      outcomeFit: 0,
      personalFit: 0,
      contextFit: 0,
      timeFit: 0,
      behaviorFit: 0,
      dnfRisk: 0,
    };

    const addSignal = (
      key: keyof typeof scoreBreakdown,
      signalKey: string,
      label: string,
      scoreImpact: number,
    ) => {
      scoreBreakdown[key] += scoreImpact;
      signals.push({ key: signalKey, label, scoreImpact });
    };

    if (book.outcomeTags?.includes(context.selectedOutcome)) {
      addSignal(
        'outcomeFit',
        'selected-outcome',
        `Matches the selected ${context.selectedOutcome} outcome.`,
        35,
      );
    }

    if (profile.targetOutcomes?.includes(context.selectedOutcome)) {
      addSignal(
        'outcomeFit',
        'profile-outcome',
        'Matches an outcome already present in the reader profile.',
        10,
      );
    }

    const favoriteGenreMatches = this.countIntersection(
      book.genres,
      profile.favoriteGenres,
    );
    if (favoriteGenreMatches > 0) {
      addSignal(
        'personalFit',
        'favorite-genres',
        `Shares ${favoriteGenreMatches} preferred genre signal${favoriteGenreMatches === 1 ? '' : 's'}.`,
        Math.min(favoriteGenreMatches * 8, 16),
      );
    }

    const dislikedGenreMatches = this.countIntersection(
      book.genres,
      profile.dislikedGenres,
    );
    if (dislikedGenreMatches > 0) {
      addSignal(
        'personalFit',
        'disliked-genres',
        `Touches ${dislikedGenreMatches} disliked genre signal${dislikedGenreMatches === 1 ? '' : 's'}.`,
        -Math.min(dislikedGenreMatches * 12, 24),
      );
    }

    if (book.depth === context.preferredDepth) {
      addSignal(
        'contextFit',
        'session-depth',
        `Fits the requested ${context.preferredDepth} reading depth.`,
        10,
      );
    }

    if (book.depth === profile.preferredDepth) {
      addSignal(
        'personalFit',
        'profile-depth',
        'Matches the reader profile depth preference.',
        6,
      );
    }

    if (book.pacing === profile.pacingTolerance) {
      addSignal(
        'personalFit',
        'pacing-tolerance',
        'Fits the reader pacing tolerance.',
        6,
      );
    }

    if (book.difficulty === profile.difficultyTolerance) {
      addSignal(
        'personalFit',
        'difficulty-tolerance',
        'Fits the reader difficulty tolerance.',
        6,
      );
    }

    if (this.countIntersection(book.formats, profile.preferredFormats) > 0) {
      addSignal(
        'personalFit',
        'preferred-format',
        'Available in a preferred reading format.',
        4,
      );
    }

    this.applyContextSignals(book, context, addSignal);
    this.applyTimeSignals(book, profile, context, addSignal);
    this.applyBehaviorSignals(bookId, readingEvents, addSignal);
    this.applyDnfSignals(bookId, book, dnfRecords, addSignal);

    const finalScore = Object.values(scoreBreakdown).reduce(
      (total, value) => total + value,
      0,
    );

    return {
      bookId,
      finalScore: Math.max(0, Math.round(finalScore)),
      scoreBreakdown,
      signals,
      explanation: this.buildExplanation(book, signals, scoreBreakdown),
    };
  }

  private applyContextSignals(
    book: ScoreableBook,
    context: CreateRecommendationSessionDto['context'],
    addSignal: (
      key: 'contextFit',
      signalKey: string,
      label: string,
      scoreImpact: number,
    ) => void,
  ) {
    if (
      ['tired', 'stressed'].includes(context.mood) &&
      (book.difficulty === 'challenging' || book.pacing === 'slow')
    ) {
      addSignal(
        'contextFit',
        'mood-risk',
        'Current mood may make slow or challenging books harder to finish.',
        -10,
      );
    }

    if (
      ['focused', 'motivated'].includes(context.mood) &&
      (book.depth === 'deep' || book.difficulty === 'challenging')
    ) {
      addSignal(
        'contextFit',
        'mood-depth-fit',
        'Current mood supports a more demanding read.',
        8,
      );
    }

    if (
      context.energyLevel === 'low' &&
      (book.difficulty === 'easy' || book.depth === 'quick')
    ) {
      addSignal(
        'contextFit',
        'low-energy-fit',
        'Low energy fits a lighter book.',
        6,
      );
    }

    if (
      context.focusLevel === 'high' &&
      (book.depth === 'deep' || book.difficulty === 'challenging')
    ) {
      addSignal(
        'contextFit',
        'high-focus-fit',
        'High focus supports a deeper recommendation.',
        7,
      );
    }
  }

  private applyTimeSignals(
    book: ScoreableBook,
    profile: ScoreableProfile,
    context: CreateRecommendationSessionDto['context'],
    addSignal: (
      key: 'timeFit',
      signalKey: string,
      label: string,
      scoreImpact: number,
    ) => void,
  ) {
    if (!book.estimatedMinutes) {
      return;
    }

    if (book.estimatedMinutes <= context.availableMinutes) {
      addSignal(
        'timeFit',
        'session-time-fit',
        'Can fit inside the available session time.',
        14,
      );
    }

    const weeklyCapacity = (profile.dailyReadingMinutes ?? 30) * 7;
    if (book.estimatedMinutes <= weeklyCapacity) {
      addSignal(
        'timeFit',
        'weekly-capacity-fit',
        'Fits roughly within the reader weekly reading capacity.',
        5,
      );
    }
  }

  private applyBehaviorSignals(
    bookId: string,
    readingEvents: ScoreableReadingEvent[],
    addSignal: (
      key: 'behaviorFit',
      signalKey: string,
      label: string,
      scoreImpact: number,
    ) => void,
  ) {
    const eventTypes = readingEvents
      .filter((event) => String(event.bookId) === bookId)
      .map((event) => event.eventType);

    if (eventTypes.includes('saved')) {
      addSignal(
        'behaviorFit',
        'saved-before',
        'The reader previously saved this book.',
        5,
      );
    }

    if (eventTypes.includes('completed')) {
      addSignal(
        'behaviorFit',
        'completed-before',
        'The reader has already completed this book.',
        -18,
      );
    }

    if (eventTypes.includes('disliked')) {
      addSignal(
        'behaviorFit',
        'disliked-before',
        'The reader previously disliked this book.',
        -25,
      );
    }

    if (eventTypes.includes('abandoned')) {
      addSignal(
        'behaviorFit',
        'abandoned-before',
        'The reader previously abandoned this book.',
        -30,
      );
    }
  }

  private applyDnfSignals(
    bookId: string,
    book: ScoreableBook,
    dnfRecords: ScoreableDnfRecord[],
    addSignal: (
      key: 'dnfRisk',
      signalKey: string,
      label: string,
      scoreImpact: number,
    ) => void,
  ) {
    const directDnf = dnfRecords.find(
      (record) => String(record.bookId) === bookId,
    );
    if (directDnf) {
      addSignal(
        'dnfRisk',
        'direct-dnf',
        `Previously DNF'd for ${directDnf.reason}.`,
        -45,
      );
      return;
    }

    const matchingRisk = dnfRecords.find(
      (record) =>
        (record.pacingSnapshot && record.pacingSnapshot === book.pacing) ||
        (record.difficultySnapshot &&
          record.difficultySnapshot === book.difficulty),
    );

    if (matchingRisk) {
      addSignal(
        'dnfRisk',
        'pattern-dnf-risk',
        `Shares a prior DNF risk pattern tied to ${matchingRisk.reason}.`,
        -12,
      );
      return;
    }

    addSignal(
      'dnfRisk',
      'no-dnf-pattern',
      'No direct DNF pattern was found for this recommendation.',
      6,
    );
  }

  private buildExplanation(
    book: ScoreableBook,
    signals: RecommendationSignal[],
    scoreBreakdown: Record<string, number>,
  ) {
    const strongestPositive = [...signals]
      .filter((signal) => signal.scoreImpact > 0)
      .sort((a, b) => b.scoreImpact - a.scoreImpact)[0];
    const strongestRisk = [...signals]
      .filter((signal) => signal.scoreImpact < 0)
      .sort((a, b) => a.scoreImpact - b.scoreImpact)[0];

    const explanation = [
      `${book.title} scored ${Math.max(
        0,
        Math.round(
          Object.values(scoreBreakdown).reduce(
            (total, value) => total + value,
            0,
          ),
        ),
      )} from outcome, profile, context, time, behavior, and anti-DNF signals.`,
    ];

    if (strongestPositive) {
      explanation.push(strongestPositive.label);
    }

    if (strongestRisk) {
      explanation.push(strongestRisk.label);
    } else {
      explanation.push('Anti-DNF checks did not find a direct risk pattern.');
    }

    return explanation;
  }

  private countIntersection(left: string[] = [], right: string[] = []) {
    const rightSet = new Set(right);
    return left.filter((value) => rightSet.has(value)).length;
  }

  private getBookId(book: ScoreableBook) {
    return String(book._id ?? book.id);
  }

  private toReadingEventType(feedbackStatus: string) {
    const feedbackToEvent: Record<string, string> = {
      accepted: 'saved',
      rejected: 'disliked',
      started: 'started',
      completed: 'completed',
      abandoned: 'abandoned',
    };

    return feedbackToEvent[feedbackStatus];
  }

  private defaultProgress(eventType: string) {
    if (eventType === 'completed') {
      return 100;
    }

    if (eventType === 'started') {
      return 1;
    }

    return undefined;
  }
}
