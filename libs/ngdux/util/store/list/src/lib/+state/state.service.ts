import { Inject, Injectable } from '@angular/core';
import { EntityAdapter } from '@ngrx/entity';
import { ReducerManager, createFeatureSelector } from '@ngrx/store';
import { LIST_FEATURE_KEYS, ListActions, ListSelectors, ListState } from '../models/list.model';
import { createListActions } from '../state-generator/list-actions';
import { createListEntityAdapter, createListReducer } from '../state-generator/list-reducer';
import { createListSelectors } from '../state-generator/list-selectors';

@Injectable()
export class ListStateService<
  T extends { [key: string]: any },
  Error = unknown,
  S extends { [key: string]: any } = T,
  Params = Record<string, string>
> {
  protected actions: Record<string, ListActions<T, Error, S, Params>> = {};
  protected selectors: Record<string, ListSelectors<S, Error, Params>> = {};
  private entityAdapter: EntityAdapter<S>;

  constructor(private readonly reducerManager: ReducerManager, @Inject(LIST_FEATURE_KEYS) featureKeys: string[]) {
    this.entityAdapter = this.getEntityAdapter();
    featureKeys.forEach(featureKey => {
      if (!this.actions[featureKey]) {
        this.actions[featureKey] = this.getActions(featureKey);
        this.addReducer(featureKey, this.actions[featureKey]);
        this.selectors[featureKey] = this.getSelectors(featureKey);
      }
    });
  }

  protected getActions(featureKey: string) {
    return createListActions<T, Error, S, Params>(featureKey);
  }

  private getEntityAdapter() {
    return createListEntityAdapter<S>();
  }

  protected addReducer(featureKey: string, actions: ListActions<T, Error, S, Params>) {
    const currentReducers: string[] = Object.keys(this.reducerManager.currentReducers || {});

    if (!currentReducers.includes(featureKey)) {
      const reducer = createListReducer<T, Error, S, Params>(this.entityAdapter, actions);
      this.reducerManager.addReducer(featureKey, reducer);
    }
  }

  protected getSelectors(featureKey: string) {
    const getState = createFeatureSelector<ListState<S, Error, Params>>(featureKey);
    return createListSelectors(this.entityAdapter, getState);
  }

  getFeatureActions(featureKey: string) {
    return this.actions[featureKey];
  }

  getFeatureSelectors(featureKey: string) {
    return this.selectors[featureKey];
  }
}
