import { Injectable } from '@angular/core';
import { UserDto } from '@demo/demo/data-model/users';
import { ErrorDto } from '@ngdux/data-model-common';
import { AbstractListFacade } from '@ngdux/list';
import { Store } from '@ngrx/store';
import { listActions } from './users.actions';
import { listSelectors } from './users.selectors';

@Injectable()
export class UsersFacade extends AbstractListFacade<UserDto, ErrorDto> {
  constructor(store: Store) {
    super(store, listActions, listSelectors);
  }
}
