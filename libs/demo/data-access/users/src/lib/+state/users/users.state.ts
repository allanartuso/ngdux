import { UserDto } from '@demo/demo/data-model/users';
import { ErrorDto } from '@ngdux/data-model-common';
import { createListState } from '@ngdux/list';

export const USERS_FEATURE_KEY = 'users';
export const {
  actions: usesActions,
  selectors: usersSelectors,
  reducer: usersReducer,
  entityAdapter: usersEntityAdapter
} = createListState<UserDto, ErrorDto>(USERS_FEATURE_KEY);
