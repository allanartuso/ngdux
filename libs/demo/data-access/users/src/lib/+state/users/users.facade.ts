import { Injectable } from '@angular/core';
import { UserDto } from '@demo/demo/data-model/users';
import { ErrorDto } from '@ngdux/data-model-common';
import { AbstractListFacade } from '@ngdux/list';
import { Store } from '@ngrx/store';
import { UsersReducerManager } from './users-state.service';

@Injectable()
export class UsersFacade extends AbstractListFacade<UserDto, ErrorDto> {
  constructor(store: Store, usersReducerManager: UsersReducerManager) {
    super(store, usersReducerManager.actions, usersReducerManager.selectors);
  }
}
