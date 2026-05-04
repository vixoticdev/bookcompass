import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';

type CreateUserInput = {
  displayName: string;
  email: string;
  passwordHash: string;
  role: 'reader';
};

type TestUser = CreateUserInput & {
  _id: string;
};

describe('AuthService', () => {
  const jwtService = {
    sign: jest.fn().mockReturnValue('signed-token'),
  } as unknown as JwtService;

  const usersService = {
    create: jest.fn<Promise<TestUser>, [CreateUserInput]>(),
    findByEmail: jest.fn(),
    findById: jest.fn(),
  };

  let authService: AuthService;

  beforeEach(() => {
    jest.clearAllMocks();
    authService = new AuthService(jwtService, usersService);
  });

  it('hashes passwords and returns a token on signup', async () => {
    usersService.create.mockImplementation((input) =>
      Promise.resolve({
        _id: 'user-1',
        displayName: 'Demo Reader',
        email: 'reader@bookcompass.local',
        passwordHash: input.passwordHash,
        role: 'reader',
      }),
    );

    const response = await authService.signup({
      displayName: 'Demo Reader',
      email: 'reader@bookcompass.local',
      password: 'bookcompass-demo',
    });

    const [createInput] = usersService.create.mock.calls[0];

    expect(createInput.displayName).toBe('Demo Reader');
    expect(createInput.email).toBe('reader@bookcompass.local');
    expect(createInput.role).toBe('reader');
    expect(createInput.passwordHash).not.toContain('bookcompass-demo');
    expect(response).toEqual({
      accessToken: 'signed-token',
      user: {
        _id: 'user-1',
        displayName: 'Demo Reader',
        email: 'reader@bookcompass.local',
        role: 'reader',
      },
    });
  });

  it('rejects login when credentials are invalid', async () => {
    usersService.findByEmail.mockResolvedValue(undefined);

    await expect(
      authService.login({
        email: 'reader@bookcompass.local',
        password: 'wrong-password',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });
});
