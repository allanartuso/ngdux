import { DEFAULT_PAGE, DEFAULT_REQUEST_OPTIONS, RequestState } from '@ngdux/data-model-common';
import {
  createLoadingStateActionHandlers,
  createRequestStateActionHandlers,
  getLastPageNumber
} from '@ngdux/store-common';
import { EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { ActionReducer, ReducerTypes, createReducer, on } from '@ngrx/store';
import { ActionCreator } from '@ngrx/store/src/models';

import { ListActions, ListState } from '../models/list.model';

export function createListEntityAdapter<T extends { [key: string]: any }>(idKey = 'id'): EntityAdapter<T> {
  return createEntityAdapter({
    selectId: resource => resource[idKey]
  });
}

export function createListReducer<T, E, S = T>(
  entityAdapter: EntityAdapter<S>,
  actions: ListActions<T, E, S>,
  actionHandlers?: ReducerTypes<ListState<S, E>, ActionCreator[]>[],
  initialListState?: { [key: string]: unknown }
): ActionReducer<ListState<S, E>> {
  const initialState: ListState<S, E> = { ...createInitialListState<S, E>(entityAdapter), ...initialListState };
  return createReducer<ListState<S, E>>(
    initialState,
    ...createListActionHandlers<T, E, S>(initialState, entityAdapter, actions),
    ...(actionHandlers || [])
  );
}

function createInitialListState<T, E>(entityAdapter: EntityAdapter<T>): ListState<T, E> {
  return entityAdapter.getInitialState({
    ...DEFAULT_REQUEST_OPTIONS,
    lastPageNumber: undefined,
    selectedResourceIds: [],
    loadingState: RequestState.IDLE,
    requestState: RequestState.IDLE,
    errors: undefined
  });
}

function createListActionHandlers<T, E, S>(
  initialListState: ListState<S, E>,
  entityAdapter: EntityAdapter<S>,
  actions: ListActions<T, E, S>
): ReducerTypes<ListState<S, E>, ActionCreator[]>[] {
  return [
    on(actions.reset, () => initialListState),
    on(actions.initialize, (state: ListState<S, E>) =>
      entityAdapter.removeAll({
        ...state,
        selectedResourceIds: [],
        pagingOptions: {
          ...state.pagingOptions,
          page: DEFAULT_PAGE
        },
        requestState: RequestState.IDLE
      })
    ),
    on(actions.changePageSize, actions.setPageSize, (state: ListState<S, E>, { pageSize }) => ({
      ...state,
      pagingOptions: { page: DEFAULT_PAGE, pageSize },
      lastPageNumber: undefined
    })),
    on(actions.changePageNumber, (state: ListState<S, E>, { pageNumber }) => ({
      ...state,
      pagingOptions: { ...state.pagingOptions, page: pageNumber }
    })),
    on(actions.changeSorting, actions.setSorting, (state: ListState<S, E>, { sortingOptions }) => ({
      ...state,
      sortingOptions,
      pagingOptions: { ...state.pagingOptions, page: DEFAULT_PAGE }
    })),
    on(actions.changeFiltering, actions.setFiltering, (state: ListState<S, E>, { filteringOptions }) => ({
      ...state,
      filteringOptions,
      pagingOptions: { ...state.pagingOptions, page: DEFAULT_PAGE },
      lastPageNumber: undefined
    })),
    on(actions.changeRequestParams, actions.setRequestParams, (state: ListState<S, E>, { params }) => ({
      ...state,
      params,
      pagingOptions: { ...state.pagingOptions, page: DEFAULT_PAGE }
    })),
    on(actions.changeSelectedResources, (state: ListState<S, E>, { selectedResourceIds }) => ({
      ...state,
      selectedResourceIds
    })),
    on(actions.loadFirstPage, (state: ListState<S, E>) => ({
      ...state,
      pagingOptions: { ...state.pagingOptions, page: 1 }
    })),
    on(actions.loadPageSuccess, (state: ListState<S, E>, { resources, pagingOptions }) => {
      const lastPageNumber = getLastPageNumber(resources, pagingOptions) || state.lastPageNumber;
      if (lastPageNumber && pagingOptions.page > lastPageNumber) {
        return {
          ...state,
          pagingOptions: {
            ...state.pagingOptions,
            page: lastPageNumber
          },
          lastPageNumber,
          selectedResourceIds: []
        };
      }

      return entityAdapter.setAll(resources, {
        ...state,
        lastPageNumber,
        selectedResourceIds: []
      });
    }),
    on(actions.deleteSuccess, (state: ListState<S, E>) => ({
      ...state,
      selectedResourceIds: [] as string[]
    })),
    ...createLoadingStateActionHandlers<ListState<S, E>>(
      actions.loadPage,
      actions.loadPageSuccess,
      actions.loadPageFailure
    ),
    ...createRequestStateActionHandlers<ListState<S, E>, E>(
      undefined,
      actions.delete,
      actions.deleteSuccess,
      actions.deleteFailure
    ),
    ...createRequestStateActionHandlers<ListState<S, E>, E>(
      actions.resetRequestState,
      actions.patch,
      actions.patchSuccess,
      actions.patchFailure
    )
  ];
}
