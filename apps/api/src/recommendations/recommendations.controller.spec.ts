import { GUARDS_METADATA } from '@nestjs/common/constants';
import { ROLES_KEY } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { RecommendationsController } from './recommendations.controller';
import { RecommendationsService } from './recommendations.service';

describe('RecommendationsController', () => {
  const recommendationsService = {
    getActiveTuning: jest.fn(),
    getAdminAnalytics: jest.fn(),
    updateActiveTuning: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn(),
    findByUserId: jest.fn(),
    recordFeedback: jest.fn(),
  } as unknown as jest.Mocked<RecommendationsService>;
  const currentUser = {
    id: '507f1f77bcf86cd799439011',
    email: 'reader@bookcompass.local',
    role: 'reader' as const,
  };

  let controller: RecommendationsController;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new RecommendationsController(recommendationsService);
  });

  it('lists only the authenticated reader recommendation sessions through GET /recommendation-sessions/me', async () => {
    const sessions = [
      {
        _id: 'session-1',
        userId: currentUser.id,
        status: 'scored',
        candidates: [],
      },
    ];
    recommendationsService.findByUserId.mockResolvedValue(sessions as never);

    await expect(controller.findMine(currentUser)).resolves.toBe(sessions);
    expect(recommendationsService.findByUserId.mock.calls[0]).toEqual([
      currentUser.id,
    ]);
  });

  it('records feedback through the authenticated reader ownership boundary', async () => {
    const session = {
      _id: '507f1f77bcf86cd799439011',
      status: 'feedback-recorded',
    };
    const feedback = {
      bookId: '507f1f77bcf86cd799439013',
      status: 'started',
    };
    recommendationsService.recordFeedback.mockResolvedValue(session as never);

    await expect(
      controller.recordFeedback(
        '507f1f77bcf86cd799439011',
        feedback,
        currentUser,
      ),
    ).resolves.toBe(session);
    expect(recommendationsService.recordFeedback.mock.calls[0]).toEqual([
      currentUser.id,
      '507f1f77bcf86cd799439011',
      feedback,
    ]);
  });

  it('marks the global list endpoint as admin guarded', () => {
    const findAllHandler = Object.getOwnPropertyDescriptor(
      RecommendationsController.prototype,
      'findAll',
    )?.value as object;
    const guards = Reflect.getMetadata(
      GUARDS_METADATA,
      findAllHandler,
    ) as unknown[];

    expect(guards).toContain(RolesGuard);
    expect(Reflect.getMetadata(ROLES_KEY, findAllHandler)).toEqual(['admin']);
  });

  it('marks the admin analytics endpoint as admin guarded', () => {
    const handler = Object.getOwnPropertyDescriptor(
      RecommendationsController.prototype,
      'adminAnalytics',
    )?.value as object;
    const guards = Reflect.getMetadata(GUARDS_METADATA, handler) as unknown[];

    expect(guards).toContain(RolesGuard);
    expect(Reflect.getMetadata(ROLES_KEY, handler)).toEqual(['admin']);
  });

  it('reads and updates admin tuning through admin-only handlers', async () => {
    const tuning = {
      key: 'active',
      outcomeFitWeight: 1,
      personalFitWeight: 1.2,
      contextFitWeight: 1,
      timeFitWeight: 1,
      behaviorFitWeight: 1,
      dnfRiskWeight: 1.4,
      maxRecommendations: 10,
    };
    recommendationsService.getActiveTuning.mockResolvedValue(tuning);
    recommendationsService.updateActiveTuning.mockResolvedValue(tuning);

    await expect(controller.adminTuning()).resolves.toBe(tuning);
    await expect(
      controller.updateAdminTuning({ personalFitWeight: 1.2 }),
    ).resolves.toBe(tuning);
    expect(recommendationsService.updateActiveTuning.mock.calls[0]).toEqual([
      { personalFitWeight: 1.2 },
    ]);
  });

  it.each(['adminTuning', 'updateAdminTuning'] as const)(
    'marks %s as admin guarded',
    (methodName) => {
      const handler = Object.getOwnPropertyDescriptor(
        RecommendationsController.prototype,
        methodName,
      )?.value as object;
      const guards = Reflect.getMetadata(GUARDS_METADATA, handler) as unknown[];

      expect(guards).toContain(RolesGuard);
      expect(Reflect.getMetadata(ROLES_KEY, handler)).toEqual(['admin']);
    },
  );
});
