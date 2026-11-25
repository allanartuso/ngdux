import { DEFAULT_PAGE, getDefaultRequestOptions, RequestState } from '@ngdux/data-model-common';
import {
  createLoadingStateActionHandlers,
  createRequestStateActionHandlers,
  getLastPageNumber,
} from '@ngdux/store-common';
import { createEntityAdapter, EntityAdapter, IdSelector } from '@ngrx/entity';
import { ActionCreator, ActionReducer, createReducer, on, ReducerTypes } from '@ngrx/store';

import { ListActions, ListState } from '../models/list.model';

export function createListEntityAdapter<T extends object>(idKey = 'id'): EntityAdapter<T> {
  return createEntityAdapter({
    selectId: ((resource: T) => (resource as Record<string, string | number>)[idKey]) as IdSelector<T>,
  });
}

/**
 * Creates the reducer of a list feature.
 *
 * To extend the state, type `actionHandlers` with your `State` (it is inferred from them, so no cast is needed) and
 * pass the initial values of the added properties in `initialListState` (it may also override the ngdux defaults).
 */
export function createListReducer<T, E, S = T, Params = Record<string, string>>(
  entityAdapter: EntityAdapter<S>,
  actions: ListActions<T, E, S, Params>,
  actionHandlers?: ReducerTypes<ListState<S, E, Params>, ActionCreator[]>[],
  initialListState?: Partial<ListState<S, E, Params>>,
): ActionReducer<ListState<S, E, Params>>;
export function createListReducer<T, E, S, Params, State extends ListState<S, E, Params>>(
  entityAdapter: EntityAdapter<S>,
  actions: ListActions<T, E, S, Params>,
  actionHandlers: ReducerTypes<State, ActionCreator[]>[],
  initialListState: Omit<NoInfer<State>, keyof ListState<S, E, Params>> & Partial<ListState<S, E, Params>>,
): ActionReducer<State>;
export function createListReducer<T, E, S, Params, Extra extends object>(
  entityAdapter: EntityAdapter<S>,
  actions: ListActions<T, E, S, Params>,
  actionHandlers: ReducerTypes<ListState<S, E, Params> & Extra, ActionCreator[]>[] = [],
  initialListState: Extra & Partial<ListState<S, E, Params>>,
): ActionReducer<ListState<S, E, Params> & Extra> {
  const initialState: ListState<S, E, Params> & Extra = {
    ...createInitialListState<S, E, Params>(entityAdapter),
    ...initialListState,
  };
  const reducer = createReducer(
    initialState,
    ...createListActionHandlers<T, E, S, Params, ListState<S, E, Params> & Extra>(entityAdapter, actions),
    ...actionHandlers,
  );

  // Reset restarts from the initial state; `reset` handlers in `actionHandlers` still run on top of it.
  return (state, action) => reducer(action.type === actions.reset.type ? undefined : state, action);
}

function createInitialListState<T, E, Params = Record<string, string>>(
  entityAdapter: EntityAdapter<T>,
): ListState<T, E, Params> {
  return entityAdapter.getInitialState({
    ...getDefaultRequestOptions<Params>(),
    lastPageNumber: undefined,
    selectedResourceIds: [],
    loadingState: RequestState.IDLE,
    requestState: RequestState.IDLE,
    errors: undefined,
  });
}

function createListActionHandlers<T, E, S, Params, State extends ListState<S, E, Params>>(
  entityAdapter: EntityAdapter<S>,
  actions: ListActions<T, E, S, Params>,
): ReducerTypes<State, ActionCreator[]>[] {
  return [
    on(actions.initialize, state =>
      entityAdapter.removeAll({
        ...state,
        selectedResourceIds: [],
        pagingOptions: {
          ...state.pagingOptions,
          page: DEFAULT_PAGE,
        },
        requestState: RequestState.IDLE,
      }),
    ),
    on(actions.changePageSize, actions.setPageSize, (state, { pageSize }) => ({
      ...state,
      pagingOptions: { page: DEFAULT_PAGE, pageSize },
      lastPageNumber: undefined,
    })),
    on(actions.changePageNumber, (state, { pageNumber }) => ({
      ...state,
      pagingOptions: { ...state.pagingOptions, page: pageNumber },
    })),
    on(actions.changePagingOptions, (state, { pagingOptions }) => ({
      ...state,
      pagingOptions,
    })),
    on(actions.changeSorting, actions.setSorting, (state, { sortingOptions }) => ({
      ...state,
      sortingOptions,
      pagingOptions: { ...state.pagingOptions, page: DEFAULT_PAGE },
    })),
    on(actions.changeFiltering, actions.setFiltering, (state, { filteringOptions }) => ({
      ...state,
      filteringOptions,
      pagingOptions: { ...state.pagingOptions, page: DEFAULT_PAGE },
      lastPageNumber: undefined,
    })),
    on(actions.changeRequestParams, actions.setRequestParams, (state, { params }) => ({
      ...state,
      requestParameters: params,
      pagingOptions: { ...state.pagingOptions, page: DEFAULT_PAGE },
    })),
    on(actions.changeSelectedResources, (state, { selectedResourceIds }) => ({
      ...state,
      selectedResourceIds,
    })),
    on(actions.loadFirstPage, state => ({
      ...state,
      pagingOptions: { ...state.pagingOptions, page: 1 },
    })),
    on(actions.loadPageSuccess, (state, { resources, pagingOptions }) => {
      const lastPageNumber = getLastPageNumber(resources, pagingOptions) || state.lastPageNumber;
      if (lastPageNumber && pagingOptions.page > lastPageNumber) {
        return {
          ...state,
          pagingOptions: {
            ...state.pagingOptions,
            page: lastPageNumber,
          },
          lastPageNumber,
          selectedResourceIds: [],
        };
      }

      return entityAdapter.setAll(resources, {
        ...state,
        lastPageNumber,
        selectedResourceIds: [],
      });
    }),
    on(actions.deleteSuccess, state => ({
      ...state,
      selectedResourceIds: [] as string[],
    })),
    on(actions.mutationUnavailable, state => ({ ...state, requestState: RequestState.FAILURE })),
    ...createLoadingStateActionHandlers<State>(actions.loadPage, actions.loadPageSuccess, actions.loadPageFailure),
    ...createRequestStateActionHandlers<State, E>(
      undefined,
      actions.delete,
      actions.deleteSuccess,
      actions.deleteFailure,
    ),
    ...createRequestStateActionHandlers<State, E>(
      actions.resetRequestState,
      actions.patch,
      actions.patchSuccess,
      actions.patchFailure,
    ),
  ];
}
