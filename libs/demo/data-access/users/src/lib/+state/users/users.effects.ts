import { Injectable } from '@angular/core';
import { UserDto } from '@demo/demo/data-model/users';
import { NotificationService } from '@demo/shared/util-notification';
import { ErrorDto } from '@ngdux/data-model-common';
import { AbstractListEffects } from '@ngdux/list';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { UserService } from '../../services/user.service';
import { listActions } from './users.actions';
import { listSelectors } from './users.selectors';

@Injectable()
export class UsersEffects extends AbstractListEffects<UserDto, ErrorDto> {
  override texts = {
    deleteConfirmationTitle: 'Delete users',
    deleteConfirmationMessage: 'Are you sure to delete the selected users?'
  };

  constructor(actions$: Actions, store: Store, usersService: UserService, notificationService: NotificationService) {
    super(actions$, store, usersService, listActions, listSelectors, notificationService);
  }
}
