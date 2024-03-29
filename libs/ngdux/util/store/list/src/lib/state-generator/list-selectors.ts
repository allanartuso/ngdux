/* eslint-disable @typescript-eslint/ban-types */
import { RequestOptions, RequestState } from '@ngdux/data-model-common';
import { EntityAdapter } from '@ngrx/entity';
import { DefaultProjectorFn, MemoizedSelector, createSelector } from '@ngrx/store';
import { ListSelectors, ListState } from '../models/list.model';

export function createListSelectors<T, E, Params = Record<string, string>>(
  entityAdapter: EntityAdapter<T>,
  getListState: MemoizedSelector<object, ListState<T, E, Params>, DefaultProjectorFn<ListState<T, E, Params>>>
): ListSelectors<T, E, Params> {
  const getAll = createSelector(getListState, entityAdapter.getSelectors().selectAll);

  const getPagingOptions = createSelector(getListState, state => state.pagingOptions);

  const getRequestOptions = createSelector(
    getListState,
    (state): RequestOptions => ({
      pagingOptions: state.pagingOptions,
      sortingOptions: state.sortingOptions,
      filteringOptions: state.filteringOptions
    })
  );

  const getLastPageNumber = createSelector(getListState, state => state.lastPageNumber);

  const isLastPage = createSelector(getPagingOptions, getLastPageNumber, ({ page }, lastPageNumber) => {
    return lastPageNumber ? lastPageNumber <= page : false;
  });

  const getCurrentPageData = createSelector(getAll, resources => {
    return resources;
  });

  const getSortingOptions = createSelector(getListState, state => state.sortingOptions);

  const getRequestParameters = createSelector(getListState, state => state.requestParameters);

  const getFilteringOptions = createSelector(getListState, state => state.filteringOptions);

  const getCurrentPageNumber = createSelector(getPagingOptions, options => options?.page);

  const getSelectedResourceIds = createSelector(getListState, state => state.selectedResourceIds);

  const getLoadingState = createSelector(getListState, state => state.loadingState);

  const getSelectedItems = createSelector(
    getSelectedResourceIds,
    createSelector(getListState, entityAdapter.getSelectors().selectEntities),
    (selectedResourceIds, resources): T[] =>
      selectedResourceIds.reduce((acc, selectedResourceId): T[] => {
        const resource = resources[selectedResourceId];
        if (resource) {
          acc.push(resource);
        }
        return acc;
      }, [] as T[])
  );

  const getSelectionRecord = createSelector(
    getSelectedResourceIds,
    createSelector(getListState, entityAdapter.getSelectors().selectEntities),
    (selectedResourceIds, resources): Record<string, T> =>
      selectedResourceIds.reduce((selected, selectedResourceId) => {
        const resource = resources[selectedResourceId];
        if (resource) {
          selected[selectedResourceId] = resource;
        }
        return selected;
      }, {} as Record<string, T>)
  );

  const getRequestState = createSelector(getListState, state => state.requestState);

  const getErrors = createSelector(getListState, state => state.errors);

  const isReady = createSelector(
    getAll,
    getLoadingState,
    (users, loadingState) => !!users && loadingState === RequestState.SUCCESS
  );

  const areSelectedReady = createSelector(
    getSelectedResourceIds,
    getSelectionRecord,
    getLoadingState,
    (selectedResourceIds, resources, loadingState) => {
      return selectedResourceIds.every(resourceId => !!resources[resourceId]) && loadingState === RequestState.SUCCESS;
    }
  );

  const isDeleteDisabled = createSelector(getSelectedResourceIds, selectedResourceIds => !selectedResourceIds.length);

  const isCopyDisabled = createSelector(
    getSelectedResourceIds,
    selectedResourceIds => selectedResourceIds.length !== 1
  );

  const getTotalCount = createSelector(
    getPagingOptions,
    isLastPage,
    getCurrentPageData,
    (pagingOptions, isLastPage, currentPageData) => {
      if (!pagingOptions) {
        return 0;
      }

      if (isLastPage) {
        return (pagingOptions.page - 1) * pagingOptions.pageSize + currentPageData.length;
      }
      return (pagingOptions.page + 1) * pagingOptions.pageSize;
    }
  );

  return {
    getAll,
    getRequestOptions,
    isLastPage,
    getCurrentPageData,
    getPagingOptions,
    getSortingOptions,
    getFilteringOptions,
    getRequestParameters,
    getCurrentPageNumber,
    getLastPageNumber,
    getLoadingState,
    getSelectedResourceIds,
    getSelectedItems,
    getSelectionRecord,
    getRequestState,
    getErrors,
    areSelectedReady,
    isReady,
    isDeleteDisabled,
    isCopyDisabled,
    getTotalCount
  };
}
