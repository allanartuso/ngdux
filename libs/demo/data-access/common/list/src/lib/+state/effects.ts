import { Inject, Injectable } from '@angular/core';
import { NotificationService } from '@demo/shared/util-notification';
import { ErrorDto, ListService } from '@ngdux/data-model-common';
import { AbstractListEffects, LIST_FEATURE_KEY } from '@ngdux/list';
import { Actions, OnIdentifyEffects } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { LIST_SERVICE } from '../models/model';
import { ListReducerManager } from './state.service';

@Injectable()
export class ListEffects<T extends { [key: string]: any }, S extends { [key: string]: any } = T>
  extends AbstractListEffects<T, ErrorDto, S>
  implements OnIdentifyEffects
{
  constructor(
    actions$: Actions,
    store: Store,
    usersReducerManager: ListReducerManager<T, ErrorDto, S>,
    notificationService: NotificationService,
    @Inject(LIST_FEATURE_KEY) private readonly featureKey: string,
    @Inject(LIST_SERVICE) usersService: ListService<T, S>
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
