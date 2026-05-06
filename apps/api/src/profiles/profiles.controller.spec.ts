import { NotFoundException } from '@nestjs/common';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';

describe('ProfilesController', () => {
  const profilesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findByUserId: jest.fn(),
    updateByUserId: jest.fn(),
  } as unknown as jest.Mocked<ProfilesService>;
  const currentUser = {
    id: '507f1f77bcf86cd799439011',
    email: 'reader@bookcompass.local',
    role: 'reader' as const,
  };

  let controller: ProfilesController;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new ProfilesController(profilesService);
  });

  it('reads the authenticated reader profile through GET /profiles/me', async () => {
    const profile = {
      _id: 'profile-1',
      userId: currentUser.id,
      favoriteGenres: ['Productivity'],
    };
    profilesService.findByUserId.mockResolvedValue(profile as never);

    await expect(controller.me(currentUser)).resolves.toBe(profile);
    expect(profilesService.findByUserId.mock.calls[0]).toEqual([
      currentUser.id,
    ]);
  });

  it('updates only the authenticated reader profile through PATCH /profiles/me', async () => {
    const update = {
      favoriteGenres: ['Business'],
      dailyReadingMinutes: 45,
    };
    const profile = {
      _id: 'profile-1',
      userId: currentUser.id,
      ...update,
    };
    profilesService.updateByUserId.mockResolvedValue(profile as never);

    await expect(controller.updateMe(update, currentUser)).resolves.toBe(
      profile,
    );
    expect(profilesService.updateByUserId.mock.calls[0]).toEqual([
      currentUser.id,
      update,
    ]);
  });

  it('preserves not-found behavior for missing authenticated profiles', async () => {
    profilesService.findByUserId.mockRejectedValue(
      new NotFoundException('Reading profile not found.'),
    );

    await expect(controller.me(currentUser)).rejects.toThrow(NotFoundException);
  });
});
