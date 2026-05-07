import { GUARDS_METADATA } from '@nestjs/common/constants';
import { ROLES_KEY } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { ReadingEventsController } from './reading-events.controller';
import { ReadingEventsService } from './reading-events.service';

describe('ReadingEventsController', () => {
  const readingEventsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findByUserId: jest.fn(),
  } as unknown as jest.Mocked<ReadingEventsService>;
  const currentUser = {
    id: '507f1f77bcf86cd799439011',
    email: 'reader@bookcompass.local',
    role: 'reader' as const,
  };

  let controller: ReadingEventsController;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new ReadingEventsController(readingEventsService);
  });

  it('lists only the authenticated reader timeline through GET /reading-events/me', async () => {
    const events = [
      {
        _id: 'event-1',
        userId: currentUser.id,
        bookId: '507f1f77bcf86cd799439012',
        eventType: 'liked',
      },
    ];
    readingEventsService.findByUserId.mockResolvedValue(events as never);

    await expect(controller.findMine(currentUser)).resolves.toBe(events);
    expect(readingEventsService.findByUserId.mock.calls[0]).toEqual([
      currentUser.id,
    ]);
  });

  it('marks the global list endpoint as admin guarded', () => {
    const findAllHandler = Object.getOwnPropertyDescriptor(
      ReadingEventsController.prototype,
      'findAll',
    )?.value as object;
    const guards = Reflect.getMetadata(
      GUARDS_METADATA,
      findAllHandler,
    ) as unknown[];

    expect(guards).toContain(RolesGuard);
    expect(Reflect.getMetadata(ROLES_KEY, findAllHandler)).toEqual(['admin']);
  });
});
