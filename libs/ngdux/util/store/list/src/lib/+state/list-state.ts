import { Action, createFeatureSelector } from '@ngrx/store';
import { ListState } from '../models/list.model';
import { createListActions } from './list-actions';
import { createListEntityAdapter, createListReducer } from './list-reducer';
import { createListSelectors } from './list-selectors';

export function createListState<T extends { [key: string]: any }, E, S extends { [key: string]: any } = T>(
  featureName: string
) {
  const actions = createListActions<T, E, S>(featureName);
  const entityAdapter = createListEntityAdapter<S>();
  const reducer = createListReducer<T, E, S>(entityAdapter, actions);
  const getState = createFeatureSelector<ListState<S, E>>(featureName);
  const selectors = createListSelectors<S, E>(entityAdapter, getState);

  return {
    actions,
    reducer: (state: ListState<S, E>, action: Action): ListState<S, E> => reducer(state, action),
    selectors,
    entityAdapter
  };
}
