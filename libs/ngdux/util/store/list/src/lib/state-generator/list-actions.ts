import { ErrorDto, FilteringOptions, PagingOptions, SortingOptions } from '@ngdux/data-model-common';
import { createAction, props } from '@ngrx/store';
import { ListActions } from '../models/list.model';

export function createListActions<T, E, S = T, Params = Record<string, string>>(
  featureName: string
): ListActions<T, E, S, Params> {
  const resetRequestState = createAction(`[${featureName} API] Reset ${featureName} Request State`);
  const initialize = createAction(`[${featureName} API] Initialize ${featureName}`);
  const reset = createAction(`[Organization ${featureName} API] Reset ${featureName}`);

  const loadNextPage = createAction(`[${featureName} API] Load Next ${featureName} Page`);
  const loadPreviousPage = createAction(`[${featureName} API] Load Previous ${featureName} Page`);
  const loadFirstPage = createAction(`[${featureName} API] Load First ${featureName} Page`);

  const setPageSize = createAction(`[${featureName} API] Set ${featureName} Page Size`, props<{ pageSize: number }>());
  const setSorting = createAction(
    `[${featureName} API] Set ${featureName} Sorting`,
    props<{ sortingOptions: SortingOptions }>()
  );
  const setFiltering = createAction(
    `[${featureName} API] Set ${featureName} Filtering`,
    props<{ filteringOptions: FilteringOptions }>()
  );
  const setRequestParams = createAction(
    `[${featureName} API] Set ${featureName} Request Params`,
    props<{ params: Params }>()
  );

  const changePageSize = createAction(
    `[${featureName} API] Change ${featureName} Page Size`,
    props<{ pageSize: number }>()
  );

  const changePageNumber = createAction(
    `[${featureName} API] Change ${featureName} Page Number`,
    props<{ pageNumber: number }>()
  );

  const changePagingOptions = createAction(
    `[${featureName} API] Change ${featureName} Page Options`,
    props<{ pagingOptions: PagingOptions }>()
  );
  const changeSorting = createAction(
    `[${featureName} API] Change ${featureName} Sorting`,
    props<{ sortingOptions: SortingOptions }>()
  );
  const changeFiltering = createAction(
    `[${featureName} API] Change ${featureName} Filtering`,
    props<{ filteringOptions: FilteringOptions }>()
  );
  const changeSelectedResources = createAction(
    `[${featureName} API] Change Selected Resources ${featureName}`,
    props<{ selectedResourceIds: string[] }>()
  );
  const changeRequestParams = createAction(
    `[${featureName} API] Change ${featureName} Request Params`,
    props<{ params: Params }>()
  );

  const loadPage = createAction(`[${featureName} API] Load ${featureName} Page`);
  const loadPageSuccess = createAction(
    `[${featureName} API] Load ${featureName} Page Success`,
    props<{ resources: S[]; pagingOptions: PagingOptions }>()
  );
  const loadPageFailure = createAction(`[${featureName} API] Load ${featureName} Page Failure`, props<{ errors: E }>());

  const deleteAction = createAction(`[${featureName} API] Delete ${featureName}`, props<{ resourceIds: string[] }>());
  const deleteSuccess = createAction(
    `[${featureName} API] Delete ${featureName} Success`,
    props<{ resourceIds: string[] }>()
  );
  const deleteFailure = createAction(`[${featureName} API] Delete ${featureName} Failure`, props<{ errors: E }>());

  const patch = createAction(
    `[${featureName} API] Patch ${featureName}`,
    props<{ resourceIds: string[]; resource: Partial<T> }>()
  );
  const patchSuccess = createAction(
    `[${featureName} API] Patch ${featureName} Success`,
    props<{ resources: (T | ErrorDto)[] }>()
  );
  const patchFailure = createAction(`[${featureName} API] Patch ${featureName} Failure`, props<{ errors: E }>());

  /**
   * @deprecated The method will be removed. The AbstractEffect will not be responsible for it anymore
   */
  const showRemovalsConfirmation = createAction(`[${featureName} API] Show ${featureName} Removal Confirmation`);

  return {
    initialize,
    reset,
    setPageSize,
    setSorting,
    setFiltering,
    setRequestParams,
    changePageSize,
    changePageNumber,
    changePagingOptions,
    changeSorting,
    changeFiltering,
    changeRequestParams,
    loadPreviousPage,
    loadNextPage,
    loadFirstPage,
    changeSelectedResources,
    loadPage,
    loadPageSuccess,
    loadPageFailure,
    delete: deleteAction,
    deleteSuccess,
    deleteFailure,
    patch,
    patchSuccess,
    patchFailure,
    resetRequestState,
    showRemovalsConfirmation
  };
}
