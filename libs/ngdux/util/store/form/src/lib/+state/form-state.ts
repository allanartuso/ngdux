import { AbstractType, EnvironmentProviders, InjectionToken, Provider, inject } from '@angular/core';
import { FormNotificationService, FormService } from '@ngdux/data-model-common';
import { provideEffects } from '@ngrx/effects';
import { Action, createFeatureSelector, provideState } from '@ngrx/store';
import { FormFacade, FormState } from '../models/form.model';
import { createFormActions } from './form-actions';
import { createFormEffects } from './form-effects';
import { provideFormFacade } from './form-facade';
import { createFormReducer } from './form-reducer';
import { createFormSelectors } from './form-selectors';

export function createFormState<DTO, ERROR, CREATE_DTO = DTO>(featureName: string) {
  const actions = createFormActions<DTO, ERROR, CREATE_DTO>(featureName);
  const reducer = createFormReducer(actions);
  const getState = createFeatureSelector<FormState<DTO, ERROR>>(featureName);
  const selectors = createFormSelectors(getState);

  return {
    actions,
    reducer: (state: FormState<DTO, ERROR>, action: Action): FormState<DTO, ERROR> => reducer(state, action),
    selectors,
  };
}

export function provideFormState<DTO, ERROR, CREATE_DTO = DTO>(
  featureKey: string,
  facadeToken: InjectionToken<FormFacade<DTO, ERROR, CREATE_DTO>>,
  service: AbstractType<FormService<DTO, CREATE_DTO>>,
  notificationService: AbstractType<FormNotificationService<ERROR>>,
): (Provider | EnvironmentProviders)[] {
  const { actions, selectors, reducer } = createFormState<DTO, ERROR, CREATE_DTO>(featureKey);

  return [
    provideState(featureKey, reducer),
    provideFormFacade(facadeToken, actions, selectors),
    provideEffects([
      createFormEffects(
        actions,
        () => inject(service),
        () => inject(notificationService),
      ),
    ]),
    service as Provider,
    notificationService as Provider,
  ];
}
