import { inject, InjectionToken } from '@angular/core';
import { RequestState } from '@ngdux/data-model-common';
import { ActionPayload } from '@ngdux/store-common';
import { select, Store } from '@ngrx/store';
import { ListActions, ListFacade, ListSelectors } from '../models/list.model';

export function provideListFacade<Data, Error = unknown, Summary = Data, Params = Record<string, string>>(
  token: InjectionToken<ListFacade<Data, Error, Summary, Params>>,
  listActions: ListActions<Data, Error, Summary, Params>,
  listSelectors: ListSelectors<Summary, Error, Params>,
) {
  return {
    provide: token,
    useFactory: () => createListFacade(listActions, listSelectors, inject(Store)),
  };
}

export function createListFacade<Data, Error = unknown, Summary = Data, Params = Record<string, string>>(
  listActions: ListActions<Data, Error, Summary, Params>,
  listSelectors: ListSelectors<Summary, Error, Params>,
  store: Store,
): ListFacade<Data, Error, Summary, Params> {
  const resources$ = store.pipe(select(listSelectors.getAll));
  const loadingState$ = store.pipe(select(listSelectors.getLoadingState));
  const requestState$ = store.pipe(select(listSelectors.getRequestState));
  const errors$ = store.pipe(select(listSelectors.getErrors));
  const isReady$ = store.pipe(select(listSelectors.isReady));
  const areSelectedReady$ = store.pipe(select(listSelectors.areSelectedReady));
  const currentPageData$ = store.pipe(select(listSelectors.getCurrentPageData));
  const currentPageNumber$ = store.pipe(select(listSelectors.getCurrentPageNumber));
  const filteringOptions$ = store.pipe(select(listSelectors.getFilteringOptions));
  const requestParameters$ = store.pipe(select(listSelectors.getRequestParameters));
  const lastPageNumber$ = store.pipe(select(listSelectors.getLastPageNumber));
  const pagingOptions$ = store.pipe(select(listSelectors.getPagingOptions));
  const requestOptions$ = store.pipe(select(listSelectors.getRequestOptions));
  const sortingOptions$ = store.pipe(select(listSelectors.getSortingOptions));
  const selectedItems$ = store.pipe(select(listSelectors.getSelectedItems));
  const totalCount$ = store.pipe(select(listSelectors.getTotalCount));
  const isLoading$ = loadingState$.pipe(select(state => state === RequestState.IN_PROGRESS));

  return {
    resources$,
    loadingState$,
    requestState$,
    errors$,
    isReady$,
    areSelectedReady$,
    currentPageData$,
    currentPageNumber$,
    filteringOptions$,
    requestParameters$,
    lastPageNumber$,
    pagingOptions$,
    requestOptions$,
    sortingOptions$,
    selectedItems$,
    totalCount$,
    isLoading$,
    setPageSize(props: ActionPayload<ListActions<Data, Error, Summary, Params>['setPageSize']>): void {
      store.dispatch(listActions.setPageSize(props));
    },

    setFiltering(props: ActionPayload<ListActions<Data, Error, Summary, Params>['setFiltering']>): void {
      store.dispatch(listActions.setFiltering(props));
    },

    setSorting(props: ActionPayload<ListActions<Data, Error, Summary, Params>['setSorting']>): void {
      store.dispatch(listActions.setSorting(props));
    },

    setRequestParameters(props: ActionPayload<ListActions<Data, Error, Summary, Params>['setRequestParams']>) {
      store.dispatch(listActions.setRequestParams(props));
    },

    changeFiltering(props: ActionPayload<ListActions<Data, Error, Summary, Params>['changeFiltering']>): void {
      store.dispatch(listActions.changeFiltering(props));
    },
    changePagingOptions(props: ActionPayload<ListActions<Data, Error, Summary, Params>['changePagingOptions']>): void {
      store.dispatch(listActions.changePagingOptions(props));
    },
    changePageSize(props: ActionPayload<ListActions<Data, Error, Summary, Params>['changePageSize']>): void {
      store.dispatch(listActions.changePageSize(props));
    },
    changePageNumber(props: ActionPayload<ListActions<Data, Error, Summary, Params>['changePageNumber']>): void {
      store.dispatch(listActions.changePageNumber(props));
    },
    changeSelectedResources(
      props: ActionPayload<ListActions<Data, Error, Summary, Params>['changeSelectedResources']>,
    ): void {
      store.dispatch(listActions.changeSelectedResources(props));
    },
    changeSorting(props: ActionPayload<ListActions<Data, Error, Summary, Params>['changeSorting']>): void {
      store.dispatch(listActions.changeSorting(props));
    },
    changeRequestParams(props: ActionPayload<ListActions<Data, Error, Summary, Params>['changeRequestParams']>): void {
      store.dispatch(listActions.changeRequestParams(props));
    },

    loadPage(): void {
      store.dispatch(listActions.loadPage());
    },

    loadFirstPage(): void {
      store.dispatch(listActions.loadFirstPage());
    },
    loadNextPage(): void {
      store.dispatch(listActions.loadNextPage());
    },

    loadPreviousPage(): void {
      store.dispatch(listActions.loadPreviousPage());
    },

    patch(props: ActionPayload<ListActions<Data, Error, Summary, Params>['patch']>): void {
      store.dispatch(listActions.patch(props));
    },

    delete(props: ActionPayload<ListActions<Data, Error, Summary, Params>['delete']>): void {
      store.dispatch(listActions.delete(props));
    },

    initialize(): void {
      store.dispatch(listActions.initialize());
    },

    reinitialize(): void {
      store.dispatch(listActions.reset());
    },
    resetRequestState(): void {
      store.dispatch(listActions.resetRequestState());
    },
  };
}
