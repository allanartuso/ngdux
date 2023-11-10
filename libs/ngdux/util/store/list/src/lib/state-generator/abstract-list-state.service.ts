import { Inject, Injectable } from '@angular/core';
import { EntityAdapter } from '@ngrx/entity';
import { ReducerManager, createFeatureSelector } from '@ngrx/store';
import { LIST_FEATURE_KEY, ListActions, ListSelectors, ListState } from '../models/list.model';
import { createListActions } from './list-actions';
import { createListEntityAdapter, createListReducer } from './list-reducer';
import { createListSelectors } from './list-selectors';

@Injectable()
export abstract class AbstractListReducerManager<
  T extends { [key: string]: any },
  E,
  S extends { [key: string]: any } = T
> {
  actions: ListActions<T, E, S>;
  selectors: ListSelectors<S, E>;
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
    return createListActions<T, E, S>(this.featureKey);
  }

  private getEntityAdapter() {
    return createListEntityAdapter<S>();
  }

  protected addReducer() {
    const currentReducers: string[] = Object.keys(this.reducerManager.currentReducers || {});

    if (!currentReducers.includes(this.featureKey)) {
      const reducer = createListReducer<T, E, S>(this.entityAdapter, this.actions);
      this.reducerManager.addReducer(this.featureKey, reducer);
    }
  }

  protected getSelectors() {
    const getState = createFeatureSelector<ListState<S, E>>(this.featureKey);
    return createListSelectors(this.entityAdapter, getState);
  }
}
