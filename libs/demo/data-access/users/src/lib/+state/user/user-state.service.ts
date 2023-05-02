import { Injectable } from '@angular/core';
import { CreateUserDto, UserDto } from '@demo/demo/data-model/users';
import { ErrorDto } from '@ngdux/data-model-common';
import { AbstractFormReducerManager } from '@ngdux/form';

export const USER_DEFAULT_FEATURE_KEY = 'user';

@Injectable()
export class UserReducerManager extends AbstractFormReducerManager<UserDto, ErrorDto, CreateUserDto> {}
