import { ErrorDto, FilteringOptions, PagingOptions, SortingOptions } from '@ngdux/data-model-common';
import { createAction, props } from '@ngrx/store';
import { ListActions } from '../models/list.model';

export function createListActions<T, E, S = T>(featureName: string): ListActions<T, E, S> {
  const resetRequestState = createAction(`[${featureName} Page] Reset ${featureName} Request State`);
  const initialize = createAction(`[${featureName} Page] Initialize ${featureName}`);
  const reset = createAction(`[Organization ${featureName} Page] Reset ${featureName}`);

  const loadNextPage = createAction(`[${featureName} Page] Load Next ${featureName} Page`);
  const loadPreviousPage = createAction(`[${featureName} Page] Load Previous ${featureName} Page`);
  const loadFirstPage = createAction(`[${featureName} Page] Load First ${featureName} Page`);

  const changePageSize = createAction(
    `[${featureName} Page] Change ${featureName} Page Size`,
    props<{ pageSize: number }>()
  );

  const changePageNumber = createAction(
    `[${featureName} Page] Change ${featureName} Page Number`,
    props<{ pageNumber: number }>()
  );

  const changePagingOptions = createAction(
    `[${featureName} Page] Change ${featureName} Page Options`,
    props<{ pagingOptions: PagingOptions }>()
  );
  const changeSorting = createAction(
    `[${featureName} Page] Change ${featureName} Sorting`,
    props<{ sortingOptions: SortingOptions }>()
  );
  const changeFiltering = createAction(
    `[${featureName} Page] Change ${featureName} Filtering`,
    props<{ filteringOptions: FilteringOptions }>()
  );
  const changeSelectedResources = createAction(
    `[${featureName} Page] Change Selected Resources ${featureName}`,
    props<{ selectedResourceIds: string[] }>()
  );

  const loadPage = createAction(`[${featureName} Page] Load ${featureName} Page`);
  const loadPageSuccess = createAction(
    `[${featureName} Page] Load ${featureName} Page Success`,
    props<{ resources: S[]; pagingOptions: PagingOptions }>()
  );
  const loadPageFailure = createAction(
    `[${featureName} Page] Load ${featureName} Page Failure`,
    props<{ errors: E }>()
  );

  const deleteAction = createAction(`[${featureName} Page] Delete ${featureName}`, props<{ resourceIds: string[] }>());
  const deleteSuccess = createAction(
    `[${featureName} Page] Delete ${featureName} Success`,
    props<{ resourceIds: string[] }>()
  );
  const deleteFailure = createAction(`[${featureName} Page] Delete ${featureName} Failure`, props<{ errors: E }>());

  const patch = createAction(
    `[${featureName} Page] Patch ${featureName}`,
    props<{ resourceIds: string[]; resource: Partial<T> }>()
  );
  const patchSuccess = createAction(
    `[${featureName} Page] Patch ${featureName} Success`,
    props<{ resources: (T | ErrorDto)[] }>()
  );
  const patchFailure = createAction(`[${featureName} Page] Patch ${featureName} Failure`, props<{ errors: E }>());

  const showRemovalsConfirmation = createAction(`[${featureName} Page] Show ${featureName} Removal Confirmation`);

  return {
    initialize,
    reset,
    changePageSize,
    changePageNumber,
    changePagingOptions,
    changeSorting,
    changeFiltering,
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
