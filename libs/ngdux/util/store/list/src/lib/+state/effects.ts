import { Inject, Injectable, Optional } from '@angular/core';
import { ListNotificationService, ListService } from '@ngdux/data-model-common';
import { Actions, OnIdentifyEffects } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { LIST_FEATURE_KEY, LIST_NOTIFICATION_SERVICE, LIST_SERVICE } from '../models/list.model';
import { AbstractListEffects } from '../state-generator/abstract-list-effects';
import { ListReducerManager } from './state.service';

@Injectable()
export class ListEffects<T extends { [key: string]: any }, Error = unknown, S extends { [key: string]: any } = T>
  extends AbstractListEffects<T, Error, S>
  implements OnIdentifyEffects
{
  constructor(
    actions$: Actions,
    store: Store,
    usersReducerManager: ListReducerManager<T, Error, S>,
    @Inject(LIST_FEATURE_KEY) private readonly featureKey: string,
    @Inject(LIST_SERVICE) usersService: ListService<T, S>,
    @Optional() @Inject(LIST_NOTIFICATION_SERVICE) notificationService: ListNotificationService<Error>
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
