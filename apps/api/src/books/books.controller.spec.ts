import { GUARDS_METADATA } from '@nestjs/common/constants';
import { ROLES_KEY } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { BooksController } from './books.controller';

describe('BooksController', () => {
  it('marks catalog creation as admin guarded', () => {
    const createHandler = Object.getOwnPropertyDescriptor(
      BooksController.prototype,
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
