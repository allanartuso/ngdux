import { Injectable } from '@angular/core';
import { UserDto } from '@demo/demo/data-model/users';
import { ErrorDto } from '@ngdux/data-model-common';
import { AbstractListReducerManager } from '@ngdux/list';

export const USERS_DEFAULT_FEATURE_KEY = 'users';

@Injectable()
export class UsersReducerManager extends AbstractListReducerManager<UserDto, ErrorDto> {}
