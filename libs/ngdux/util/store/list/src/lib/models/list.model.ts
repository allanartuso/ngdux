/* eslint-disable @typescript-eslint/ban-types */
import { InjectionToken, Type } from '@angular/core';
import {
  ErrorDto,
  FilteringOptions,
  ListNotificationService,
  ListService,
  PagingOptions,
  RequestOptions,
  RequestState,
  SortingField
} from '@ngdux/data-model-common';
import { ApiRequestState, LoadingState } from '@ngdux/store-common';
import { EntityState } from '@ngrx/entity';
import { ActionCreator, MemoizedSelector } from '@ngrx/store';
import { TypedAction } from '@ngrx/store/src/models';

export const LIST_FEATURE_KEY = new InjectionToken<string>('LIST_FEATURE_KEY');
export const LIST_FEATURE_KEYS = new InjectionToken<string>('LIST_FEATURE_KEYS');
export const LIST_SERVICES = new InjectionToken<string>('LIST_SERVICES');
export const LIST_NOTIFICATION_SERVICES = new InjectionToken<string>('LIST_NOTIFICATION_SERVICES');

export interface ListState<T, E = unknown, Params = Record<string, string>>
  extends EntityState<T>,
    RequestOptions<Params>,
    ApiRequestState<E>,
    LoadingState {
  selectedResourceIds: string[];
  lastPageNumber?: number;
}

export interface ListSelectors<T, E = unknown, Params = Record<string, string>> {
  getAll: MemoizedSelector<object, T[]>;
  getRequestOptions: MemoizedSelector<object, RequestOptions>;
  isLastPage: MemoizedSelector<object, boolean>;
  getCurrentPageData: MemoizedSelector<object, T[]>;
  getPagingOptions: MemoizedSelector<object, PagingOptions>;
  getSortingOptions: MemoizedSelector<object, SortingField[]>;
  getFilteringOptions: MemoizedSelector<object, FilteringOptions>;
  getRequestParameters: MemoizedSelector<object, Params | undefined>;
  getCurrentPageNumber: MemoizedSelector<object, number>;
  getLastPageNumber: MemoizedSelector<object, number | undefined>;
  getLoadingState: MemoizedSelector<object, RequestState>;
  getSelectedResourceIds: MemoizedSelector<object, string[]>;
  getSelectedItems: MemoizedSelector<object, T[]>;
  getSelectionRecord: MemoizedSelector<object, Record<string, T>>;
  getRequestState: MemoizedSelector<object, RequestState>;
  getErrors: MemoizedSelector<object, E | undefined>;
  areSelectedReady: MemoizedSelector<object, boolean>;
  isReady: MemoizedSelector<object, boolean>;
  isDeleteDisabled: MemoizedSelector<object, boolean>;
  isCopyDisabled: MemoizedSelector<object, boolean>;
  getTotalCount: MemoizedSelector<object, number>;
}

export interface ListActions<Entity, Error = unknown, Summary = Entity, Params = Record<string, string>> {
  /**
   * Set the page size without reloading the list
   */
  setPageSize: ActionCreator<string, (props: { pageSize: number }) => { pageSize: number } & TypedAction<string>>;
  /**
   * Set the sorting options without reloading the list
   */
  setSorting: ActionCreator<
    string,
    (props: { sortingOptions: SortingField[] }) => { sortingOptions: SortingField[] } & TypedAction<string>
  >;
  /**
   * Set the filtering options without reloading the list
   */
  setFiltering: ActionCreator<
    string,
    (props: { filteringOptions: FilteringOptions }) => { filteringOptions: FilteringOptions } & TypedAction<string>
  >;
  /**
   * Set the request parameters without reloading the list
   */
  setRequestParams: ActionCreator<string, (props: { params: Params }) => { params: Params } & TypedAction<string>>;

  /**
   * Change the paging options and reload the list
   */
  changePagingOptions: ActionCreator<
    string,
    (props: { pagingOptions: PagingOptions }) => { pagingOptions: PagingOptions } & TypedAction<string>
  >;

  /**
   * Change the page number and reload the list
   */
  changePageNumber: ActionCreator<
    string,
    (props: { pageNumber: number }) => { pageNumber: number } & TypedAction<string>
  >;
  /**
   * Change the page size and reload the list
   */
  changePageSize: ActionCreator<string, (props: { pageSize: number }) => { pageSize: number } & TypedAction<string>>;
  /**
   * Change the sorting options and reload the list
   */
  changeSorting: ActionCreator<
    string,
    (props: { sortingOptions: SortingField[] }) => { sortingOptions: SortingField[] } & TypedAction<string>
  >;
  /**
   * Change the filtering options and reload the list
   */
  changeFiltering: ActionCreator<
    string,
    (props: { filteringOptions: FilteringOptions }) => { filteringOptions: FilteringOptions } & TypedAction<string>
  >;
  /**
   * Change the request parameters and reload the list
   */
  changeRequestParams: ActionCreator<string, (props: { params: Params }) => { params: Params } & TypedAction<string>>;

  changeSelectedResources: ActionCreator<
    string,
    (props: { selectedResourceIds: string[] }) => { selectedResourceIds: string[] } & TypedAction<string>
  >;
  loadPage: ActionCreator<string, () => TypedAction<string>>;
  loadPageSuccess: ActionCreator<
    string,
    (props: {
      resources: Summary[];
      pagingOptions: PagingOptions;
    }) => { resources: Summary[]; pagingOptions: PagingOptions } & TypedAction<string>
  >;
  loadPageFailure: ActionCreator<string, (props: { errors: Error }) => { errors: Error } & TypedAction<string>>;
  delete: ActionCreator<string, (props: { resourceIds: string[] }) => { resourceIds: string[] } & TypedAction<string>>;
  deleteSuccess: ActionCreator<
    string,
    (props: { resourceIds: string[] }) => { resourceIds: string[] } & TypedAction<string>
  >;
  deleteFailure: ActionCreator<string, (props: { errors: Error }) => { errors: Error } & TypedAction<string>>;
  patch: ActionCreator<
    string,
    (props: {
      resourceIds: string[];
      resource: Partial<Entity>;
    }) => { resourceIds: string[]; resource: Partial<Entity> } & TypedAction<string>
  >;
  patchSuccess: ActionCreator<
    string,
    (props: { resources: (Entity | ErrorDto)[] }) => { resources: (Entity | ErrorDto)[] } & TypedAction<string>
  >;
  patchFailure: ActionCreator<string, (props: { errors: Error }) => { errors: Error } & TypedAction<string>>;
  loadNextPage: ActionCreator<string, () => TypedAction<string>>;

  /**
   * Remove the current data, set the page number to 1 and deselect resources.
   * Keep all the rest, like filteringOptions and sortingOptions
   */
  initialize: ActionCreator<string, () => TypedAction<string>>;
  /**
   * Reset to the initial state
   */
  reset: ActionCreator<string, () => TypedAction<string>>;
  loadPreviousPage: ActionCreator<string, () => TypedAction<string>>;
  loadFirstPage: ActionCreator<string, () => TypedAction<string>>;
  /**
   * Reset the request state to idle
   */
  resetRequestState: ActionCreator<string, () => TypedAction<string>>;
}

export interface NgduxListStateModuleConfig<
  T extends { [key: string]: any },
  E,
  S = T,
  Params = Record<string, string>
> {
  service: Type<ListService<T, S, Params>>;
  notificationService?: Type<ListNotificationService<E>>;
}
