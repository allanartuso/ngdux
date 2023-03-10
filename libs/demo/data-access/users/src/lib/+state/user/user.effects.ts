import { Injectable } from '@angular/core';
import { UserDto } from '@demo/demo/data-model/users';
import { NotificationService } from '@demo/shared/util-notification';
import { ErrorDto } from '@ngdux/data-model-common';
import { AbstractFormEffects } from '@ngdux/form';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { UserService } from '../../services/user.service';
import { userActions } from './user.state';

@Injectable()
export class UserEffects extends AbstractFormEffects<UserDto, ErrorDto> {
  constructor(actions$: Actions, store: Store, userService: UserService, formNotificationService: NotificationService) {
    super(actions$, store, userService, userActions, formNotificationService);
  }
}
