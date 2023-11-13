import { Optional } from '@angular/core';
import { ListNotificationService, ListService } from '@ngdux/data-model-common';
import { Actions, OnIdentifyEffects } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AbstractListEffects } from '../state-generator/abstract-list-effects';
import { ListStateService } from './state.service';

export class ListEffects<
    T extends { [key: string]: any },
    Error = unknown,
    S extends { [key: string]: any } = T,
    Params = Record<string, string>
  >
  extends AbstractListEffects<T, Error, S, Params>
  implements OnIdentifyEffects
{
  constructor(
    actions$: Actions,
    store: Store,
    listStateService: ListStateService<T, Error, S, Params>,
    private readonly featureKey: string,
    service: ListService<T, S, Params>,
    @Optional() notificationService?: ListNotificationService<Error>
  ) {
    super(
      actions$,
      store,
      service,
      listStateService.getFeatureActions(featureKey),
      listStateService.getFeatureSelectors(featureKey),
      notificationService
    );
  }

  ngrxOnIdentifyEffects() {
    return this.featureKey;
  }
}
