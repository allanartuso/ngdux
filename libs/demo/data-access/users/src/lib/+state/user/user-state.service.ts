import { Injectable } from '@angular/core';
import { UserDto } from '@demo/demo/data-model/users';
import { ErrorDto } from '@ngdux/data-model-common';
import { AbstractFormReducerManager } from '@ngdux/form';

@Injectable()
export class UserReducerManager extends AbstractFormReducerManager<UserDto, ErrorDto> {}
