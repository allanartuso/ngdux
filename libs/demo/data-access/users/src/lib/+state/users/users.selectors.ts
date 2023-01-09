import { UserDto } from '@demo/demo/data-model/users';
import { ErrorDto } from '@ngdux/data-model-common';
import { createListSelectors, ListState } from '@ngdux/list';
import { createFeatureSelector } from '@ngrx/store';
import { entityAdapter, USERS_FEATURE_KEY } from './users.reducer';

const getState = createFeatureSelector<ListState<UserDto, ErrorDto>>(USERS_FEATURE_KEY);

export const listSelectors = createListSelectors(entityAdapter, getState);
