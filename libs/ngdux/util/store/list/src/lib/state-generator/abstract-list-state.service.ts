import { Inject, Injectable } from '@angular/core';
import { EntityAdapter } from '@ngrx/entity';
import { ReducerManager, createFeatureSelector } from '@ngrx/store';
import { LIST_FEATURE_KEY, ListActions, ListSelectors, ListState } from '../models/list.model';
import { createListActions } from './list-actions';
import { createListEntityAdapter, createListReducer } from './list-reducer';
import { createListSelectors } from './list-selectors';

/**
 * @deprecated This class is deprecated and will be removed in a future release.
 */
@Injectable()
export abstract class AbstractListReducerManager<
  T extends { [key: string]: any },
  E,
  S extends { [key: string]: any } = T,
  Params = Record<string, string>
> {
  actions: ListActions<T, E, S, Params>;
  selectors: ListSelectors<S, E, Params>;
  private entityAdapter: EntityAdapter<S>;

  constructor(
    private readonly reducerManager: ReducerManager,
    @Inject(LIST_FEATURE_KEY) private readonly featureKey: string
  ) {
    this.actions = this.getActions();
    this.entityAdapter = this.getEntityAdapter();
    this.addReducer();
    this.selectors = this.getSelectors();
  }

  protected getActions() {
    return createListActions<T, E, S, Params>(this.featureKey);
  }

  private getEntityAdapter() {
    return createListEntityAdapter<S>();
  }

  protected addReducer() {
    const currentReducers: string[] = Object.keys(this.reducerManager.currentReducers || {});

    if (!currentReducers.includes(this.featureKey)) {
      const reducer = createListReducer<T, E, S, Params>(this.entityAdapter, this.actions);
      this.reducerManager.addReducer(this.featureKey, reducer);
    }
  }

  protected getSelectors() {
    const getState = createFeatureSelector<ListState<S, E, Params>>(this.featureKey);
    return createListSelectors(this.entityAdapter, getState);
  }
}
