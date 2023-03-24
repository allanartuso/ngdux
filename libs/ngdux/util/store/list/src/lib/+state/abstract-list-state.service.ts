import { Inject, Injectable } from '@angular/core';
import { EntityAdapter } from '@ngrx/entity';
import { createFeatureSelector, ReducerManager } from '@ngrx/store';
import { ListActions, ListSelectors, ListState, LIST_FEATURE_KEY } from '../models/list.model';
import { createListActions } from './list-actions';
import { createListEntityAdapter, createListReducer } from './list-reducer';
import { createListSelectors } from './list-selectors';

@Injectable()
export abstract class AbstractListReducerManager<T, E, S> {
  actions: ListActions<T, E, S>;
  selectors: ListSelectors<S, E>;
  private entityAdapter: EntityAdapter<S>;

  constructor(
    private readonly reducerManager: ReducerManager,
    @Inject(LIST_FEATURE_KEY) private readonly featureKey: string
  ) {
    this.setActions();
    this.addReducer();
    this.setSelectors();
  }

  protected setActions() {
    this.actions = createListActions<T, E, S>(this.featureKey);
  }

  protected setSelectors() {
    const getState = createFeatureSelector<ListState<S, E>>(this.featureKey);
    this.selectors = createListSelectors(this.entityAdapter, getState);
  }

  protected addReducer() {
    this.entityAdapter = createListEntityAdapter<S>();
    const reducer = createListReducer<T, E, S>(this.entityAdapter, this.actions);
    this.reducerManager.addReducer(this.featureKey, reducer);
  }
}
