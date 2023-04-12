/* eslint-disable @typescript-eslint/ban-types */
import { RequestOptions, RequestState } from '@ngdux/data-model-common';
import { EntityAdapter } from '@ngrx/entity';
import { createSelector, DefaultProjectorFn, MemoizedSelector } from '@ngrx/store';
import { ListSelectors, ListState } from '../models/list.model';

export function createListSelectors<T, E>(
  entityAdapter: EntityAdapter<T>,
  getListState: MemoizedSelector<object, ListState<T, E>, DefaultProjectorFn<ListState<T, E>>>
): ListSelectors<T, E> {
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
    return lastPageNumber <= page;
  });

  const getCurrentPageData = createSelector(getAll, resources => {
    return resources;
  });

  const getSortingOptions = createSelector(getListState, state => state.sortingOptions);

  const getFilteringOptions = createSelector(getListState, state => state.filteringOptions);

  const getCurrentPageNumber = createSelector(getPagingOptions, options => options.page);

  const getSelectedResourceIds = createSelector(getListState, state => state.selectedResourceIds);

  const getLoadingState = createSelector(getListState, state => state.loadingState);

  const getSelected = createSelector(
    getSelectedResourceIds,
    createSelector(getListState, entityAdapter.getSelectors().selectEntities),
    (selectedResourceIds, resources): T[] =>
      selectedResourceIds.map(selectedResourceId => resources[selectedResourceId])
  );

  const getSelectionRecord = createSelector(
    getSelectedResourceIds,
    createSelector(getListState, entityAdapter.getSelectors().selectEntities),
    (selectedResourceIds, resources): Record<string, T> => {
      console.log(selectedResourceIds);
      console.log(resources);
      const res = selectedResourceIds.reduce((selected, selectedResourceId) => {
        selected[selectedResourceId] = resources[selectedResourceId];
        return selected;
      }, {} as Record<string, T>);
      console.log(res);
      return res;
    }
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

  const getTotalCount = createSelector(getPagingOptions, getCurrentPageData, (pagingOptions, currentPageData) => {
    return (pagingOptions.page - 1) * pagingOptions.pageSize + currentPageData.length;
  });

  return {
    getAll,
    getRequestOptions,
    isLastPage,
    getCurrentPageData,
    getPagingOptions,
    getSortingOptions,
    getFilteringOptions,
    getCurrentPageNumber,
    getLastPageNumber,
    getLoadingState,
    getSelectedResourceIds,
    getSelected,
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
