import { Inject, Injectable } from '@angular/core';
import { ReducerManager, createFeatureSelector } from '@ngrx/store';
import { FORM_FEATURE_KEY, FormActions, FormSelectors, FormState } from '../models/form.model';
import { createFormActions } from './form-actions';
import { createFormReducer } from './form-reducer';
import { createFormSelectors } from './form-selectors';

@Injectable()
export abstract class AbstractFormReducerManager<DTO, ERROR, CREATE_DTO = DTO> {
  actions: FormActions<DTO, ERROR, CREATE_DTO>;
  selectors: FormSelectors<DTO, ERROR>;

  constructor(
    private readonly reducerManager: ReducerManager,
    @Inject(FORM_FEATURE_KEY) private readonly featureKey: string
  ) {
    this.actions = this.getActions();
    this.addReducer();
    this.selectors = this.getSelectors();
  }

  protected getActions() {
    return createFormActions<DTO, ERROR, CREATE_DTO>(this.featureKey);
  }

  protected addReducer() {
    const currentReducers: string[] = Object.keys(this.reducerManager.currentReducers || {});
    if (!currentReducers.includes(this.featureKey)) {
      const reducer = createFormReducer(this.actions);
      this.reducerManager.addReducer(this.featureKey, reducer);
    }
  }

  protected getSelectors() {
    const getState = createFeatureSelector<FormState<DTO, ERROR>>(this.featureKey);
    return createFormSelectors(getState);
  }
}
