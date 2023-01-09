import {
  DEFAULT_REQUEST_OPTIONS,
  DEFAULT_STORED_PAGES,
  PagingOptions,
  RequestState,
  SortingDirection
} from '@ngdux/data-model-common';
import {
  createLoadingStateActionHandlers,
  createRequestStateActionHandlers,
  getLastPageNumber
} from '@ngdux/store-common';
import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { ActionReducer, createReducer, on, ReducerTypes } from '@ngrx/store';
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
    on(actions.reinitialize, () => initialListState),
    on(actions.initialize, (state: ListState<S, E>) =>
      entityAdapter.removeAll({
        ...state,
        selectedResourceIds: [],
        pagingOptions: {
          ...state.pagingOptions,
          page: 1
        }
      })
    ),
    on(actions.refresh, (state: ListState<S, E>) => {
      const currentPageStartIndex = (state.pagingOptions.page - 1) * state.pagingOptions.pageSize;
      const resourceIds = state.ids.slice(currentPageStartIndex) as string[];

      return entityAdapter.removeMany(resourceIds, state);
    }),

    on(actions.changePageSize, (state: ListState<S, E>, { pageSize }) => ({
      ...state,
      pagingOptions: { ...state.pagingOptions, pageSize },
      lastPageNumber: undefined
    })),
    on(actions.changeSorting, (state: ListState<S, E>, { sortingField }) => {
      const sortingOptions = { ...state.sortingOptions };
      if (sortingField.direction === SortingDirection.NONE) {
        delete sortingOptions[sortingField.field];
      } else {
        sortingOptions[sortingField.field] = sortingField;
      }
      return {
        ...state,
        sortingOptions
      };
    }),
    on(actions.changeFiltering, (state: ListState<S, E>, { filteringOptions }) => ({
      ...state,
      filteringOptions,
      lastPageNumber: undefined
    })),
    on(actions.changeSelected, (state: ListState<S, E>, { selectedResourceIds }) => ({
      ...state,
      selectedResourceIds
    })),
    on(actions.loadFirstPage, (state: ListState<S, E>) => ({
      ...state,
      pagingOptions: { ...state.pagingOptions, page: 1 }
    })),
    on(actions.loadNextPage, (state: ListState<S, E>) => {
      if (state.pagingOptions.page === state.lastPageNumber) {
        return { ...state };
      }

      if (
        state.pagingOptions.page + 1 === state.lastPageNumber &&
        state.pagingOptions.page + 1 > (DEFAULT_STORED_PAGES + 1) / 2
      ) {
        const resourceIds = state.ids.slice(0, state.pagingOptions.pageSize) as string[];
        state = entityAdapter.removeMany(resourceIds, { ...state });
      }

      return {
        ...state,
        pagingOptions: {
          ...state.pagingOptions,
          page: state.pagingOptions.page + 1
        }
      };
    }),
    on(actions.loadPreviousPage, (state: ListState<S, E>) => {
      if (state.pagingOptions.page === 1) {
        return { ...state };
      }

      return {
        ...state,
        pagingOptions: {
          ...state.pagingOptions,
          page: state.pagingOptions.page - 1
        }
      };
    }),
    on(actions.loadPageSuccess, (state: ListState<S, E>, { resources, pagingOptions }) => {
      if (pagingOptions.page < state.pagingOptions.page) {
        return createPreviousPageSuccessState(entityAdapter, state, resources);
      }

      return createNextPageSuccessState(entityAdapter, state, pagingOptions, resources);
    }),
    on(actions.deleteSuccess, (state: ListState<S, E>) => ({
      ...state,
      selectedResourceIds: [] as string[]
    })),
    on(actions.navigateToSelected, (state: ListState<S, E>, { resourceId }) => ({
      ...state,
      currentResourceId: resourceId
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

function createPreviousPageSuccessState<T, E>(
  entityAdapter: EntityAdapter<T>,
  state: ListState<T, E>,
  resources: T[]
): ListState<T, E> {
  const resourceIds: string[] = state.ids.slice(
    0,
    (DEFAULT_STORED_PAGES - 1) * state.pagingOptions.pageSize
  ) as string[];

  return entityAdapter.setAll([...resources, ...resourceIds.map(resourceId => state.entities[resourceId])], {
    ...state,
    selectedResourceIds: []
  });
}

function createNextPageSuccessState<T, E>(
  entityAdapter: EntityAdapter<T>,
  state: ListState<T, E>,
  pagingOptions: PagingOptions,
  resources: T[]
): ListState<T, E> {
  let resourceIds: string[] = [];
  const lastPageNumber = getLastPageNumber(resources, pagingOptions) || state.lastPageNumber;

  if (pagingOptions.page > DEFAULT_STORED_PAGES && lastPageNumber !== state.pagingOptions.page) {
    resourceIds = state.ids.slice(0, state.pagingOptions.pageSize) as string[];
    state = entityAdapter.removeMany(resourceIds, { ...state });
  }

  return entityAdapter.addMany(resources, {
    ...state,
    lastPageNumber,
    selectedResourceIds: []
  });
}
