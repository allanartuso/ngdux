import { Inject, Injectable } from '@angular/core';
import { createFeatureSelector, ReducerManager } from '@ngrx/store';
import { FormActions, FormSelectors, FormState, FORM_FEATURE_KEY } from '../models/form.model';
import { createFormActions } from './form-actions';
import { createFormReducer } from './form-reducer';
import { createFormSelectors } from './form-selectors';

@Injectable()
export abstract class AbstractFormReducerManager<T, E> {
  actions: FormActions<T, E>;
  selectors: FormSelectors<T, E>;

  constructor(
    private readonly reducerManager: ReducerManager,
    @Inject(FORM_FEATURE_KEY) private readonly featureKey: string
  ) {
    this.setActions();
    this.addReducer();
    this.setSelectors();
  }

  protected setActions() {
    this.actions = createFormActions<T, E>(this.featureKey);
  }

  protected addReducer() {
    if (!Object.keys(this.reducerManager.currentReducers).includes(this.featureKey)) {
      const reducer = createFormReducer(this.actions);
      this.reducerManager.addReducer(this.featureKey, reducer);
    }
  }

  protected setSelectors() {
    const getState = createFeatureSelector<FormState<T, E>>(this.featureKey);
    this.selectors = createFormSelectors(getState);
  }
}
