import { AbstractFormEffects } from '@ngdux/form';
import { UserEffects } from './user.effects';

describe('UserEffects', () => {
  it('should extend abstract form effects', () => {
    expect(UserEffects.prototype).toBeInstanceOf(AbstractFormEffects);
  });
});
