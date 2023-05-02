import { Action, createFeatureSelector } from '@ngrx/store';
import { FormState } from '../models/form.model';
import { createFormActions } from './form-actions';
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
    selectors
  };
}
