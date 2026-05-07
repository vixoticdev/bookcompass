import { RecommendationsService } from './recommendations.service';

type CreatedRecommendationCandidate = {
  bookId: string;
  finalScore: number;
  scoreBreakdown: Record<string, number>;
  explanation: string[];
};

type CreatedRecommendationSession = {
  status: string;
  candidates: CreatedRecommendationCandidate[];
};

describe('RecommendationsService', () => {
  const recommendationSessionModel = {
    aggregate: jest.fn(),
    create: jest.fn(),
    find: jest.fn(),
    findOneAndUpdate: jest.fn(),
  };
  const profilesService = {
    findByUserId: jest.fn(),
  };
  const readingEventsService = {
    create: jest.fn(),
    findByUserId: jest.fn(),
  };
  const dnfService = {
    findByUserId: jest.fn(),
  };
  const booksService = {
    findAll: jest.fn(),
    getReviewAnalytics: jest.fn(),
  };

  let service: RecommendationsService;

  beforeEach(() => {
    jest.clearAllMocks();
    recommendationSessionModel.find.mockReturnValue({
      sort: jest.fn().mockReturnValue({ exec: jest.fn() }),
    });
    recommendationSessionModel.findOneAndUpdate.mockReturnValue({
      exec: jest.fn(),
    });
    service = new RecommendationsService(
      recommendationSessionModel as never,
      profilesService as never,
      readingEventsService as never,
      dnfService as never,
      booksService as never,
    );
  });

  it('builds recommendation input from profile, behavior, DNF, and catalog candidates', async () => {
    const context = {
      selectedOutcome: 'productivity',
      mood: 'focused',
      energyLevel: 'medium',
      focusLevel: 'high',
      availableMinutes: 420,
      preferredDepth: 'deep',
    };
    const profile = { userId: 'user-1', targetOutcomes: ['productivity'] };
    const readingEvents = [{ bookId: 'book-1', eventType: 'liked' }];
    const dnfRecords = [{ bookId: 'book-2', reason: 'too-slow' }];
    const catalogCandidates = [{ _id: 'book-3', title: 'Deep Work' }];

    profilesService.findByUserId.mockResolvedValue(profile);
    readingEventsService.findByUserId.mockResolvedValue(readingEvents);
    dnfService.findByUserId.mockResolvedValue(dnfRecords);
    booksService.findAll.mockResolvedValue({
      items: catalogCandidates,
      total: 1,
      limit: 50,
      offset: 0,
    });

    await expect(service.buildInput('user-1', context)).resolves.toEqual({
      userId: 'user-1',
      context,
      profile,
      readingEvents,
      dnfRecords,
      catalogCandidates,
      candidateTotal: 1,
    });
    expect(booksService.findAll.mock.calls[0]).toEqual([
      {
        outcome: 'productivity',
        depth: 'deep',
        maxEstimatedMinutes: 420,
        recommendationEligible: true,
        limit: 50,
        offset: 0,
      },
    ]);
  });

  it('scores and persists a recommendation session with ranked explanations', async () => {
    const context = {
      selectedOutcome: 'productivity',
      mood: 'focused',
      energyLevel: 'medium',
      focusLevel: 'high',
      availableMinutes: 420,
      preferredDepth: 'deep',
    };
    const profile = {
      userId: 'user-1',
      favoriteGenres: ['business', 'productivity'],
      dislikedGenres: ['romance'],
      targetOutcomes: ['productivity'],
      preferredDepth: 'deep',
      pacingTolerance: 'moderate',
      difficultyTolerance: 'challenging',
      preferredFormats: ['ebook'],
      dailyReadingMinutes: 90,
    };
    const readingEvents = [{ bookId: 'book-2', eventType: 'saved' }];
    const dnfRecords = [
      {
        bookId: 'book-4',
        reason: 'too-slow',
        pacingSnapshot: 'slow',
        difficultySnapshot: 'challenging',
      },
    ];
    const catalogCandidates = [
      {
        _id: 'book-1',
        title: 'High Output Management',
        genres: ['business', 'productivity'],
        outcomeTags: ['productivity'],
        pacing: 'moderate',
        difficulty: 'challenging',
        depth: 'deep',
        formats: ['ebook'],
        estimatedMinutes: 360,
      },
      {
        _id: 'book-2',
        title: 'Saved Shallow Read',
        genres: ['romance'],
        outcomeTags: ['productivity'],
        pacing: 'fast',
        difficulty: 'easy',
        depth: 'quick',
        formats: ['audiobook'],
        estimatedMinutes: 120,
      },
    ];

    profilesService.findByUserId.mockResolvedValue(profile);
    readingEventsService.findByUserId.mockResolvedValue(readingEvents);
    dnfService.findByUserId.mockResolvedValue(dnfRecords);
    booksService.findAll.mockResolvedValue({
      items: catalogCandidates,
      total: 2,
      limit: 50,
      offset: 0,
    });
    recommendationSessionModel.create.mockResolvedValue({ _id: 'session-1' });

    await expect(
      service.create({ userId: 'user-1', context }),
    ).resolves.toEqual({ _id: 'session-1' });

    const createCalls = recommendationSessionModel.create.mock
      .calls as unknown[][];
    const createdPayload = createCalls[0][0] as CreatedRecommendationSession;
    expect(createdPayload.status).toBe('scored');
    expect(createdPayload.candidates).toHaveLength(2);
    expect(createdPayload.candidates[0].bookId).toBe('book-1');
    expect(createdPayload.candidates[0].finalScore).toBeGreaterThan(
      createdPayload.candidates[1].finalScore,
    );
    expect(createdPayload.candidates[0].scoreBreakdown).toMatchObject({
      outcomeFit: 45,
      timeFit: 19,
    });
    expect(createdPayload.candidates[0].explanation).toEqual(
      expect.arrayContaining([
        'Matches the selected productivity outcome.',
        'Shares a prior DNF risk pattern tied to too-slow.',
      ]),
    );
  });

  it('penalizes direct DNF records more than reusable DNF pattern risk', () => {
    const context = {
      selectedOutcome: 'productivity',
      mood: 'curious',
      energyLevel: 'medium',
      focusLevel: 'medium',
      availableMinutes: 300,
      preferredDepth: 'balanced',
    };
    const input = {
      userId: 'user-1',
      context,
      profile: {
        favoriteGenres: [],
        dislikedGenres: [],
        targetOutcomes: [],
        preferredFormats: [],
        dailyReadingMinutes: 30,
      },
      readingEvents: [],
      dnfRecords: [
        {
          bookId: 'book-1',
          reason: 'lost-interest',
          pacingSnapshot: 'slow',
        },
      ],
      catalogCandidates: [
        {
          _id: 'book-1',
          title: 'Previously Dropped',
          outcomeTags: ['productivity'],
          pacing: 'slow',
          depth: 'balanced',
          estimatedMinutes: 250,
        },
        {
          _id: 'book-2',
          title: 'Same Risk Pattern',
          outcomeTags: ['productivity'],
          pacing: 'slow',
          depth: 'balanced',
          estimatedMinutes: 250,
        },
      ],
      candidateTotal: 2,
    };

    const scored = service.scoreCandidates(input as never);

    expect(scored[0].bookId).toBe('book-2');
    expect(scored[1].bookId).toBe('book-1');
    expect(scored[1].signals).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: 'direct-dnf',
          scoreImpact: -45,
        }),
      ]),
    );
  });

  it('lists only sessions owned by the authenticated reader', async () => {
    const exec = jest.fn().mockResolvedValue([{ _id: 'session-1' }]);
    const sort = jest.fn().mockReturnValue({ exec });
    recommendationSessionModel.find.mockReturnValue({ sort });

    await expect(service.findByUserId('user-1')).resolves.toEqual([
      { _id: 'session-1' },
    ]);
    expect(recommendationSessionModel.find.mock.calls[0]).toEqual([
      { userId: 'user-1' },
    ]);
    expect(sort.mock.calls[0]).toEqual([{ createdAt: -1 }]);
  });

  it('summarizes admin analytics for catalog review and candidate feedback outcomes', async () => {
    const catalogReview = {
      total: 12,
      eligible: 5,
      ineligible: 7,
      byEnrichmentStatus: {
        imported: 4,
        'needs-review': 3,
        reviewed: 5,
      },
    };
    booksService.getReviewAnalytics.mockResolvedValue(catalogReview);
    recommendationSessionModel.aggregate.mockReturnValue({
      exec: jest.fn().mockResolvedValue([
        { _id: 'accepted', count: 2 },
        { _id: 'completed', count: 1 },
        { _id: 'abandoned', count: 3 },
      ]),
    });

    await expect(service.getAdminAnalytics()).resolves.toEqual({
      catalogReview,
      candidateFeedback: {
        totalRecorded: 6,
        byStatus: {
          accepted: 2,
          completed: 1,
          abandoned: 3,
        },
      },
    });
    const aggregateCalls = recommendationSessionModel.aggregate.mock
      .calls as Array<[unknown[]]>;
    expect(aggregateCalls[0][0]).toEqual([
      { $unwind: '$candidates' },
      { $match: { 'candidates.feedback.status': { $exists: true } } },
      {
        $group: {
          _id: '$candidates.feedback.status',
          count: { $sum: 1 },
        },
      },
    ]);
  });

  it('records feedback on a reader-owned candidate and creates a reusable behavior event', async () => {
    const updatedSession = {
      _id: '507f1f77bcf86cd799439011',
      status: 'feedback-recorded',
    };
    const exec = jest.fn().mockResolvedValue(updatedSession);
    recommendationSessionModel.findOneAndUpdate.mockReturnValue({ exec });
    readingEventsService.create.mockResolvedValue({ _id: 'event-1' });

    await expect(
      service.recordFeedback(
        '507f1f77bcf86cd799439012',
        '507f1f77bcf86cd799439011',
        {
          bookId: '507f1f77bcf86cd799439013',
          status: 'completed',
          note: 'Good match',
        },
      ),
    ).resolves.toBe(updatedSession);

    const updateCall = recommendationSessionModel.findOneAndUpdate.mock
      .calls[0] as [
      Record<string, unknown>,
      { $set: Record<string, unknown> },
      Record<string, unknown>,
    ];
    expect(updateCall[0]).toEqual({
      _id: '507f1f77bcf86cd799439011',
      userId: '507f1f77bcf86cd799439012',
      'candidates.bookId': '507f1f77bcf86cd799439013',
    });
    expect(updateCall[1].$set.status).toBe('feedback-recorded');
    expect(updateCall[1].$set['candidates.$.feedback']).toMatchObject({
      status: 'completed',
      progressPercent: undefined,
      note: 'Good match',
      recordedAt: expect.any(Date) as Date,
    });
    expect(updateCall[2]).toEqual({ returnDocument: 'after' });
    const readingEventCreateCalls = readingEventsService.create.mock
      .calls as Array<[Record<string, unknown>]>;
    const createdEvent = readingEventCreateCalls[0][0];
    expect(createdEvent).toEqual(
      expect.objectContaining({
        userId: '507f1f77bcf86cd799439012',
        bookId: '507f1f77bcf86cd799439013',
        eventType: 'completed',
        progressPercent: 100,
        note: 'Good match',
      }),
    );
  });

  it('rejects feedback for sessions or candidates outside the reader ownership boundary', async () => {
    const exec = jest.fn().mockResolvedValue(null);
    recommendationSessionModel.findOneAndUpdate.mockReturnValue({ exec });

    await expect(
      service.recordFeedback(
        '507f1f77bcf86cd799439012',
        '507f1f77bcf86cd799439011',
        {
          bookId: '507f1f77bcf86cd799439013',
          status: 'accepted',
        },
      ),
    ).rejects.toThrow('Recommendation candidate was not found');
    expect(readingEventsService.create).not.toHaveBeenCalled();
  });
});
