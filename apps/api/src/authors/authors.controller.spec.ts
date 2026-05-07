import { GUARDS_METADATA } from '@nestjs/common/constants';
import { ROLES_KEY } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { AuthorsController } from './authors.controller';

describe('AuthorsController', () => {
  function expectAdminGuard(methodName: keyof AuthorsController) {
    const handler = Object.getOwnPropertyDescriptor(
      AuthorsController.prototype,
      methodName,
    )?.value as object;
    const guards = Reflect.getMetadata(GUARDS_METADATA, handler) as unknown[];

    expect(guards).toContain(RolesGuard);
    expect(Reflect.getMetadata(ROLES_KEY, handler)).toEqual(['admin']);
  }

  it('marks catalog creation as admin guarded', () => {
    expectAdminGuard('create');
  });

  it('marks catalog updates as admin guarded', () => {
    expectAdminGuard('update');
  });

  it('marks catalog deletion as admin guarded', () => {
    expectAdminGuard('remove');
  });
});
