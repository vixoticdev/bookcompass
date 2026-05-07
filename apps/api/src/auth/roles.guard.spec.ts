import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { RolesGuard } from './roles.guard';

describe('RolesGuard', () => {
  const handler = () => undefined;
  class TestController {}

  function buildContext(role: 'reader' | 'admin') {
    return {
      getHandler: jest.fn().mockReturnValue(handler),
      getClass: jest.fn().mockReturnValue(TestController),
      switchToHttp: () => ({
        getRequest: () => ({ user: { role } }),
      }),
    } as unknown as ExecutionContext;
  }

  it('allows admin users through admin-only routes', () => {
    const getAllAndOverride = jest.fn().mockReturnValue(['admin']);
    const reflector = {
      getAllAndOverride,
    } as unknown as Reflector;
    const guard = new RolesGuard(reflector);

    expect(guard.canActivate(buildContext('admin'))).toBe(true);
  });

  it('rejects reader users from admin-only routes', () => {
    const getAllAndOverride = jest.fn().mockReturnValue(['admin']);
    const reflector = {
      getAllAndOverride,
    } as unknown as Reflector;
    const guard = new RolesGuard(reflector);

    expect(guard.canActivate(buildContext('reader'))).toBe(false);
  });

  it('falls through when no role metadata is declared', () => {
    const getAllAndOverride = jest.fn().mockReturnValue(undefined);
    const reflector = {
      getAllAndOverride,
    } as unknown as Reflector;
    const guard = new RolesGuard(reflector);

    expect(guard.canActivate(buildContext('reader'))).toBe(true);
    expect(getAllAndOverride).toHaveBeenCalledWith(ROLES_KEY, [
      handler,
      TestController,
    ]);
  });
});
