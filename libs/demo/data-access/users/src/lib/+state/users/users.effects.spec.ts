import { AbstractListEffects } from '@ngdux/list';
import { UsersEffects } from './users.effects';

describe('UsersEffects', () => {
  it('shout extend abstract form effects', () => {
    expect(UsersEffects.prototype).toBeInstanceOf(AbstractListEffects);
  });
});
