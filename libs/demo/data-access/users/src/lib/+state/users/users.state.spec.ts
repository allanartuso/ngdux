jest.mock('@ngdux/list', () => ({
  createListState: jest.fn().mockReturnValue([])
}));

import { createListState } from '@ngdux/list';
import { USERS_FEATURE_KEY } from './users.state';

describe('User state', () => {
  it('creates the user state function correctly', () => {
    expect(createListState).toHaveBeenCalledWith(USERS_FEATURE_KEY);
  });
});
