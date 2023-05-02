import { Inject, Injectable } from '@angular/core';
import { CreateUserDto, UserDto } from '@demo/demo/data-model/users';
import { NotificationService } from '@demo/shared/util-notification';
import { ErrorDto } from '@ngdux/data-model-common';
import { AbstractFormEffects, FORM_FEATURE_KEY } from '@ngdux/form';
import { Actions, OnIdentifyEffects } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { UserService } from '../../services/user.service';
import { UserReducerManager } from './user-state.service';

@Injectable()
export class UserEffects extends AbstractFormEffects<UserDto, ErrorDto, CreateUserDto> implements OnIdentifyEffects {
  constructor(
    actions$: Actions,
    store: Store,
    userService: UserService,
    formNotificationService: NotificationService,
    userReducerManager: UserReducerManager,
    @Inject(FORM_FEATURE_KEY) private readonly featureKey: string
  ) {
    super(actions$, store, userService, userReducerManager.actions, formNotificationService);
  }

  ngrxOnIdentifyEffects() {
    return this.featureKey;
  }
}
