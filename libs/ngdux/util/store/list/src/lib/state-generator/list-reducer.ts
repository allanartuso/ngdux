import { DEFAULT_PAGE, getDefaultRequestOptions, RequestState } from '@ngdux/data-model-common';
import {
  createLoadingStateActionHandlers,
  createRequestStateActionHandlers,
  getLastPageNumber
} from '@ngdux/store-common';
import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { ActionCreator, ActionReducer, createReducer, on, ReducerTypes } from '@ngrx/store';

import { ListActions, ListState } from '../models/list.model';

export function createListEntityAdapter<T extends { [key: string]: any }>(idKey = 'id'): EntityAdapter<T> {
  return createEntityAdapter({
    selectId: resource => resource[idKey]
  });
}

export function createListReducer<T, E, S = T, Params = Record<string, string>>(
  entityAdapter: EntityAdapter<S>,
  actions: ListActions<T, E, S, Params>,
  actionHandlers?: ReducerTypes<ListState<S, E, Params>, ActionCreator[]>[],
  initialListState?: { [key: string]: unknown }
): ActionReducer<ListState<S, E, Params>> {
  const initialState: ListState<S, E, Params> = {
    ...createInitialListState<S, E, Params>(entityAdapter),
    ...initialListState
  };
  return createReducer<ListState<S, E, Params>>(
    initialState,
    ...createListActionHandlers<T, E, S, Params>(initialState, entityAdapter, actions),
    ...(actionHandlers || [])
  );
}

function createInitialListState<T, E, Params = Record<string, string>>(
  entityAdapter: EntityAdapter<T>
): ListState<T, E, Params> {
  return entityAdapter.getInitialState({
    ...getDefaultRequestOptions<Params>(),
    lastPageNumber: undefined,
    selectedResourceIds: [],
    loadingState: RequestState.IDLE,
    requestState: RequestState.IDLE,
    errors: undefined
  });
}

function createListActionHandlers<T, E, S, Params>(
  initialListState: ListState<S, E, Params>,
  entityAdapter: EntityAdapter<S>,
  actions: ListActions<T, E, S, Params>
): ReducerTypes<ListState<S, E, Params>, ActionCreator[]>[] {
  return [
    on(actions.reset, () => initialListState),
    on(actions.initialize, (state: ListState<S, E, Params>) =>
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
    on(actions.changePageSize, actions.setPageSize, (state: ListState<S, E, Params>, { pageSize }) => ({
      ...state,
      pagingOptions: { page: DEFAULT_PAGE, pageSize },
      lastPageNumber: undefined
    })),
    on(actions.changePageNumber, (state: ListState<S, E, Params>, { pageNumber }) => ({
      ...state,
      pagingOptions: { ...state.pagingOptions, page: pageNumber }
    })),
    on(actions.changePagingOptions, (state: ListState<S, E, Params>, { pagingOptions }) => ({
      ...state,
      pagingOptions
    })),
    on(actions.changeSorting, actions.setSorting, (state: ListState<S, E, Params>, { sortingOptions }) => ({
      ...state,
      sortingOptions,
      pagingOptions: { ...state.pagingOptions, page: DEFAULT_PAGE }
    })),
    on(actions.changeFiltering, actions.setFiltering, (state: ListState<S, E, Params>, { filteringOptions }) => ({
      ...state,
      filteringOptions,
      pagingOptions: { ...state.pagingOptions, page: DEFAULT_PAGE },
      lastPageNumber: undefined
    })),
    on(
      actions.changeRequestParams,
      actions.setRequestParams,
      (state: ListState<S, E, Params>, { params }): ListState<S, E, Params> => ({
        ...state,
        requestParameters: params,
        pagingOptions: { ...state.pagingOptions, page: DEFAULT_PAGE }
      })
    ),
    on(actions.changeSelectedResources, (state: ListState<S, E, Params>, { selectedResourceIds }) => ({
      ...state,
      selectedResourceIds
    })),
    on(actions.loadFirstPage, (state: ListState<S, E, Params>) => ({
      ...state,
      pagingOptions: { ...state.pagingOptions, page: 1 }
    })),
    on(actions.loadPageSuccess, (state: ListState<S, E, Params>, { resources, pagingOptions }) => {
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
    on(actions.deleteSuccess, (state: ListState<S, E, Params>) => ({
      ...state,
      selectedResourceIds: [] as string[]
    })),
    ...createLoadingStateActionHandlers<ListState<S, E, Params>>(
      actions.loadPage,
      actions.loadPageSuccess,
      actions.loadPageFailure
    ),
    ...createRequestStateActionHandlers<ListState<S, E, Params>, E>(
      undefined,
      actions.delete,
      actions.deleteSuccess,
      actions.deleteFailure
    ),
    ...createRequestStateActionHandlers<ListState<S, E, Params>, E>(
      actions.resetRequestState,
      actions.patch,
      actions.patchSuccess,
      actions.patchFailure
    )
  ];
}
