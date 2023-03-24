import { Injectable } from '@angular/core';
import { UserDto } from '@demo/demo/data-model/users';
import { ErrorDto } from '@ngdux/data-model-common';
import { AbstractFormFacade } from '@ngdux/form';
import { Store } from '@ngrx/store';
import { UserReducerManager } from './user-state.service';

@Injectable()
export class UserFacade extends AbstractFormFacade<UserDto, ErrorDto> {
  constructor(store: Store, userReducerManager: UserReducerManager) {
    super(store, userReducerManager.actions, userReducerManager.selectors);
  }
}
