import { GUARDS_METADATA } from '@nestjs/common/constants';
import { ROLES_KEY } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { DnfController } from './dnf.controller';
import { DnfService } from './dnf.service';

describe('DnfController', () => {
  const dnfService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findByUserId: jest.fn(),
  } as unknown as jest.Mocked<DnfService>;
  const currentUser = {
    id: '507f1f77bcf86cd799439011',
    email: 'reader@bookcompass.local',
    role: 'reader' as const,
  };

  let controller: DnfController;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new DnfController(dnfService);
  });

  it('lists only the authenticated reader DNF history through GET /dnf-records/me', async () => {
    const records = [
      {
        _id: 'dnf-1',
        userId: currentUser.id,
        bookId: '507f1f77bcf86cd799439012',
        stoppedAtPercent: 30,
        reason: 'too-slow',
      },
    ];
    dnfService.findByUserId.mockResolvedValue(records as never);

    await expect(controller.findMine(currentUser)).resolves.toBe(records);
    expect(dnfService.findByUserId.mock.calls[0]).toEqual([currentUser.id]);
  });

  it('marks the global list endpoint as admin guarded', () => {
    const findAllHandler = Object.getOwnPropertyDescriptor(
      DnfController.prototype,
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
