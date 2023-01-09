import { UserDto } from '@demo/demo/data-model/users';
import { ErrorDto } from '@ngdux/data-model-common';
import { createListEntityAdapter, createListReducer, ListState } from '@ngdux/list';
import { Action } from '@ngrx/store';
import { listActions } from './users.actions';

export const USERS_FEATURE_KEY = 'users';
export const entityAdapter = createListEntityAdapter<UserDto>();

const reducer = createListReducer<UserDto, ErrorDto>(entityAdapter, listActions);

export function usersReducer(state: ListState<UserDto, ErrorDto>, action: Action): ListState<UserDto, ErrorDto> {
  return reducer(state, action);
}
