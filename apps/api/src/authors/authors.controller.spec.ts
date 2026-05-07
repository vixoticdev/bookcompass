import { GUARDS_METADATA } from '@nestjs/common/constants';
import { ROLES_KEY } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { AuthorsController } from './authors.controller';

describe('AuthorsController', () => {
  it('marks catalog creation as admin guarded', () => {
    const createHandler = Object.getOwnPropertyDescriptor(
      AuthorsController.prototype,
      'create',
    )?.value as object;
    const guards = Reflect.getMetadata(
      GUARDS_METADATA,
      createHandler,
    ) as unknown[];

    expect(guards).toContain(RolesGuard);
    expect(Reflect.getMetadata(ROLES_KEY, createHandler)).toEqual(['admin']);
  });
});
