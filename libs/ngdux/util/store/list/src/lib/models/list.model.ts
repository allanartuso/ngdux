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
import { Action, ActionCreator, MemoizedSelector } from '@ngrx/store';

export const LIST_FEATURE_KEY = new InjectionToken<string>('LIST_FEATURE_KEY');
export const LIST_FEATURE_KEYS = new InjectionToken<string>('LIST_FEATURE_KEYS');
export const LIST_SERVICES = new InjectionToken<string>('LIST_SERVICES');
export const LIST_NOTIFICATION_SERVICES = new InjectionToken<string>('LIST_NOTIFICATION_SERVICES');

export interface ListState<T, E = unknown, Params = Record<string, string>>
  extends EntityState<T>, RequestOptions<Params>, ApiRequestState<E>, LoadingState {
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
  setPageSize: ActionCreator<string, (props: { pageSize: number }) => { pageSize: number } & Action<string>>;
  /**
   * Set the sorting options without reloading the list
   */
  setSorting: ActionCreator<
    string,
    (props: { sortingOptions: SortingField[] }) => { sortingOptions: SortingField[] } & Action<string>
  >;
  /**
   * Set the filtering options without reloading the list
   */
  setFiltering: ActionCreator<
    string,
    (props: { filteringOptions: FilteringOptions }) => { filteringOptions: FilteringOptions } & Action<string>
  >;
  /**
   * Set the request parameters without reloading the list
   */
  setRequestParams: ActionCreator<string, (props: { params: Params }) => { params: Params } & Action<string>>;

  /**
   * Change the paging options and reload the list
   */
  changePagingOptions: ActionCreator<
    string,
    (props: { pagingOptions: PagingOptions }) => { pagingOptions: PagingOptions } & Action<string>
  >;

  /**
   * Change the page number and reload the list
   */
  changePageNumber: ActionCreator<string, (props: { pageNumber: number }) => { pageNumber: number } & Action<string>>;
  /**
   * Change the page size and reload the list
   */
  changePageSize: ActionCreator<string, (props: { pageSize: number }) => { pageSize: number } & Action<string>>;
  /**
   * Change the sorting options and reload the list
   */
  changeSorting: ActionCreator<
    string,
    (props: { sortingOptions: SortingField[] }) => { sortingOptions: SortingField[] } & Action<string>
  >;
  /**
   * Change the filtering options and reload the list
   */
  changeFiltering: ActionCreator<
    string,
    (props: { filteringOptions: FilteringOptions }) => { filteringOptions: FilteringOptions } & Action<string>
  >;
  /**
   * Change the request parameters and reload the list
   */
  changeRequestParams: ActionCreator<string, (props: { params: Params }) => { params: Params } & Action<string>>;

  changeSelectedResources: ActionCreator<
    string,
    (props: { selectedResourceIds: string[] }) => { selectedResourceIds: string[] } & Action<string>
  >;
  loadPage: ActionCreator<string, () => Action<string>>;
  loadPageSuccess: ActionCreator<
    string,
    (props: {
      resources: Summary[];
      pagingOptions: PagingOptions;
    }) => { resources: Summary[]; pagingOptions: PagingOptions } & Action<string>
  >;
  loadPageFailure: ActionCreator<string, (props: { errors: Error }) => { errors: Error } & Action<string>>;
  delete: ActionCreator<string, (props: { resourceIds: string[] }) => { resourceIds: string[] } & Action<string>>;
  deleteSuccess: ActionCreator<
    string,
    (props: { resourceIds: string[] }) => { resourceIds: string[] } & Action<string>
  >;
  deleteFailure: ActionCreator<string, (props: { errors: Error }) => { errors: Error } & Action<string>>;
  patch: ActionCreator<
    string,
    (props: {
      resourceIds: string[];
      resource: Partial<Entity>;
    }) => { resourceIds: string[]; resource: Partial<Entity> } & Action<string>
  >;
  patchSuccess: ActionCreator<
    string,
    (props: { resources: (Entity | ErrorDto)[] }) => { resources: (Entity | ErrorDto)[] } & Action<string>
  >;
  patchFailure: ActionCreator<string, (props: { errors: Error }) => { errors: Error } & Action<string>>;
  loadNextPage: ActionCreator<string, () => Action<string>>;

  /**
   * Remove the current data, set the page number to 1 and deselect resources.
   * Keep all the rest, like filteringOptions and sortingOptions
   */
  initialize: ActionCreator<string, () => Action<string>>;
  /**
   * Reset to the initial state
   */
  reset: ActionCreator<string, () => Action<string>>;
  loadPreviousPage: ActionCreator<string, () => Action<string>>;
  loadFirstPage: ActionCreator<string, () => Action<string>>;
  /**
   * Reset the request state to idle
   */
  resetRequestState: ActionCreator<string, () => Action<string>>;
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
