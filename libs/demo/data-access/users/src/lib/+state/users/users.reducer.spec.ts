const mockReducerFunction = jest.fn();
jest.mock('@ngdux/list', () => ({
  createListEntityAdapter: jest.fn(),
  createListActions: jest.fn(),
  createListReducer: jest.fn().mockReturnValue(mockReducerFunction)
}));

import { UserDto } from '@demo/demo/data-model/users';
import { ErrorDto } from '@ngdux/data-model-common';
import { createListActions, createListEntityAdapter, createListReducer, ListState } from '@ngdux/list';
import { Action } from '@ngrx/store';
import { usersReducer } from './users.reducer';

describe('UsersReducer', () => {
  beforeEach(() => {
    mockReducerFunction.mockReset();
  });

  it('creates the user reducer function correctly', () => {
    const testListState = {} as ListState<UserDto, ErrorDto>;
    const testAction = {} as Action;

    usersReducer(testListState, testAction);

    expect(createListEntityAdapter).toHaveBeenCalled();
    expect(createListActions).toHaveBeenCalled();
    expect(createListReducer).toHaveBeenCalled();
    expect(mockReducerFunction).toHaveBeenCalledWith(testListState, testAction);
  });
});
