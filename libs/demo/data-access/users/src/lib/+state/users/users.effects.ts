import { Inject, Injectable } from '@angular/core';
import { UserDto } from '@demo/demo/data-model/users';
import { NotificationService } from '@demo/shared/common/util-notification';
import { ErrorDto } from '@ngdux/data-model-common';
import { AbstractListEffects } from '@ngdux/list';
import { Actions, OnIdentifyEffects } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { USER_LIST_FEATURE_KEY } from '../../models/users.model';
import { UserService } from '../../services/user.service';
import { UsersReducerManager } from './users-state.service';

@Injectable()
export class UsersEffects extends AbstractListEffects<UserDto, ErrorDto> implements OnIdentifyEffects {
  override texts = {
    deleteConfirmationTitle: 'Delete users',
    deleteConfirmationMessage: 'Are you sure to delete the selected users?'
  };

  constructor(
    actions$: Actions,
    store: Store,
    usersService: UserService,
    notificationService: NotificationService,
    usersReducerManager: UsersReducerManager,
    @Inject(USER_LIST_FEATURE_KEY) private readonly featureKey: string
  ) {
    super(
      actions$,
      store,
      usersService,
      usersReducerManager.actions,
      usersReducerManager.selectors,
      notificationService
    );
  }

  ngrxOnIdentifyEffects() {
    return this.featureKey;
  }
}
