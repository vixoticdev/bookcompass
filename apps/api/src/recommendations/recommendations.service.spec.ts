import { RecommendationsService } from './recommendations.service';

describe('RecommendationsService', () => {
  const recommendationSessionModel = {
    create: jest.fn(),
    find: jest.fn(),
  };
  const profilesService = {
    findByUserId: jest.fn(),
  };
  const readingEventsService = {
    findByUserId: jest.fn(),
  };
  const dnfService = {
    findByUserId: jest.fn(),
  };
  const booksService = {
    findAll: jest.fn(),
  };

  let service: RecommendationsService;

  beforeEach(() => {
    jest.clearAllMocks();
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
        limit: 50,
        offset: 0,
      },
    ]);
  });
});
