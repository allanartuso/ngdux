import { AbstractListEffects } from '@ngdux/list';
import { ListEffects } from './effects';

describe('UsersEffects', () => {
  it('shout extend abstract form effects', () => {
    expect(ListEffects.prototype).toBeInstanceOf(AbstractListEffects);
  });
});
