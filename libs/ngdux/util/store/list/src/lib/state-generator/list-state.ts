import { AbstractType, EnvironmentProviders, inject, InjectionToken, Provider } from '@angular/core';
import { ListNotificationService, ListService } from '@ngdux/data-model-common';
import { provideEffects } from '@ngrx/effects';
import { Action, createFeatureSelector, provideState } from '@ngrx/store';
import { ListFacade, ListState } from '../models/list.model';
import { NotificationServicePlaceholder } from '../services/list-notification-service';
import { createListActions } from './list-actions';
import { createListEffects } from './list-effects';
import { provideListFacade } from './list-facade';
import { createListEntityAdapter, createListReducer } from './list-reducer';
import { createListSelectors } from './list-selectors';

export function createListState<
  T extends { [key: string]: any },
  E,
  S extends { [key: string]: any } = T,
  Params = Record<string, string>,
>(featureName: string, idKey?: string) {
  const actions = createListActions<T, E, S, Params>(featureName);
  const entityAdapter = createListEntityAdapter<S>(idKey);
  const reducer = createListReducer<T, E, S, Params>(entityAdapter, actions);
  const getState = createFeatureSelector<ListState<S, E, Params>>(featureName);
  const selectors = createListSelectors<S, E, Params>(entityAdapter, getState);

  return {
    actions,
    reducer: (state: ListState<S, E, Params>, action: Action): ListState<S, E, Params> => reducer(state, action),
    selectors,
    entityAdapter,
  };
}

export function provideListState<
  Data extends { [key: string]: any },
  Error = unknown,
  Summary extends { [key: string]: any } = Data,
  Params = Record<string, string>,
>(
  featureKey: string,
  facadeToken: InjectionToken<ListFacade<Data, Error, Summary, Params>>,
  service: AbstractType<ListService<Data, Summary, Params>>,
  notificationService: AbstractType<ListNotificationService<Error>> = NotificationServicePlaceholder<Error>,
): (Provider | EnvironmentProviders)[] {
  const { actions, selectors, reducer } = createListState<Data, Error, Summary, Params>(featureKey);

  return [
    provideState(featureKey, reducer),
    provideListFacade(facadeToken, actions, selectors),
    provideEffects([
      createListEffects(
        actions,
        selectors,
        () => inject(service),
        () => inject(notificationService),
      ),
    ]),
    service as Provider,
    notificationService as Provider,
  ];
}
