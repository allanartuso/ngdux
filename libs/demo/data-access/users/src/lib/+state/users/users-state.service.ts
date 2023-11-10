import { Inject, Injectable } from '@angular/core';
import { UserDto } from '@demo/demo/data-model/users';
import { ErrorDto } from '@ngdux/data-model-common';
import { AbstractListReducerManager } from '@ngdux/list';
import { ReducerManager } from '@ngrx/store';
import { USER_LIST_FEATURE_KEY } from '../../models/users.model';

export const USERS_DEFAULT_FEATURE_KEY = 'users';

@Injectable()
export class UsersReducerManager extends AbstractListReducerManager<UserDto, ErrorDto> {
  constructor(reducerManager: ReducerManager, @Inject(USER_LIST_FEATURE_KEY) featureKey: string) {
    super(reducerManager, featureKey);
  }
}
