import { Action, createFeatureSelector } from '@ngrx/store';
import { ListState } from '../models/list.model';
import { createListActions } from './list-actions';
import { createListEntityAdapter, createListReducer } from './list-reducer';
import { createListSelectors } from './list-selectors';

export function createListState<
  T extends { [key: string]: any },
  E,
  S extends { [key: string]: any } = T,
  Params = Record<string, string>
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
    entityAdapter
  };
}
