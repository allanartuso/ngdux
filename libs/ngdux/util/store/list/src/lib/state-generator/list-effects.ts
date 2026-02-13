import { inject } from '@angular/core';
import { ListNotificationService, ListService } from '@ngdux/data-model-common';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { catchError, exhaustMap, filter, map, of, switchMap, tap, withLatestFrom } from 'rxjs';
import { ListActions, ListSelectors } from '../models/list.model';

export function createListEffects<Data, Error = unknown, Summary = Data, Params = Record<string, string>>(
  listActions: ListActions<Data, Error, Summary, Params>,
  listSelectors: ListSelectors<Summary, Error, Params>,
  listService: () => ListService<Data, Summary, Params>,
  notificationService: () => ListNotificationService<Error>
) {
  return {
    reload$: createEffect((actions$ = inject(Actions)) => reloadEffect(actions$, listActions), { functional: true }),
    loadFirstPage$: createEffect((actions$ = inject(Actions)) => loadFirstPageEffect(actions$, listActions), {
      functional: true
    }),
    loadPreviousPage$: createEffect(
      (store = inject(Store), actions$ = inject(Actions)) =>
        loadPreviousPageEffect(store, actions$, listActions, listSelectors),
      { functional: true }
    ),
    loadNextPage$: createEffect(
      (store = inject(Store), actions$ = inject(Actions)) =>
        loadNextPageEffect(store, actions$, listActions, listSelectors),
      { functional: true }
    ),
    loadPage$: createEffect(
      (store = inject(Store), actions$ = inject(Actions), service = listService()) =>
        loadPageEffect(store, actions$, listActions, listSelectors, service),
      { functional: true }
    ),
    patch$: createEffect(
      (actions$ = inject(Actions), service = listService()) => patchEffect(actions$, listActions, service),
      { functional: true }
    ),
    delete$: createEffect(
      (actions$ = inject(Actions), service = listService()) => deleteEffect(actions$, listActions, service),
      { functional: true }
    ),
    deleteSuccess$: createEffect(
      (actions$ = inject(Actions), service = notificationService()) =>
        deleteSuccessEffect(actions$, listActions, service),
      { functional: true, dispatch: false }
    ),
    errorsHandler$: createEffect(
      (actions$ = inject(Actions), service = notificationService()) =>
        errorsHandlerEffect(actions$, listActions, service),
      { functional: true, dispatch: false }
    )
  };
}

function reloadEffect<Data, Error = unknown, Summary = Data, Params = Record<string, string>>(
  actions$: Actions,
  listActions: ListActions<Data, Error, Summary, Params>
) {
  return actions$.pipe(
    ofType(
      listActions.changePageSize,
      listActions.changeSorting,
      listActions.changeFiltering,
      listActions.changePagingOptions,
      listActions.changeRequestParams,
      listActions.initialize,
      listActions.reset,
      listActions.changePageNumber,
      listActions.patchSuccess,
      listActions.deleteSuccess
    ),
    map(() => listActions.loadPage())
  );
}

function loadFirstPageEffect<Data, Error = unknown, Summary = Data, Params = Record<string, string>>(
  actions$: Actions,
  listActions: ListActions<Data, Error, Summary, Params>
) {
  return actions$.pipe(
    ofType(listActions.loadFirstPage),
    map(() => listActions.changePageNumber({ pageNumber: 1 }))
  );
}

function loadPreviousPageEffect<Data, Error = unknown, Summary = Data, Params = Record<string, string>>(
  store: Store,
  actions$: Actions,
  listActions: ListActions<Data, Error, Summary, Params>,
  listSelectors: ListSelectors<Summary, Error, Params>
) {
  return actions$.pipe(
    ofType(listActions.loadPreviousPage),
    withLatestFrom(store.pipe(select(listSelectors.getCurrentPageNumber))),
    filter(([, currentPageNumber]) => currentPageNumber > 1),
    map(([, currentPageNumber]) => listActions.changePageNumber({ pageNumber: currentPageNumber - 1 }))
  );
}

function loadNextPageEffect<Data, Error = unknown, Summary = Data, Params = Record<string, string>>(
  store: Store,
  actions$: Actions,
  listActions: ListActions<Data, Error, Summary, Params>,
  listSelectors: ListSelectors<Summary, Error, Params>
) {
  return actions$.pipe(
    ofType(listActions.loadNextPage),
    withLatestFrom(
      store.pipe(select(listSelectors.isLastPage)),
      store.pipe(select(listSelectors.getCurrentPageNumber))
    ),
    filter(([, isLastPage]) => !isLastPage),
    map(([, , currentPageNumber]) => listActions.changePageNumber({ pageNumber: currentPageNumber + 1 }))
  );
}

function loadPageEffect<Data, Error = unknown, Summary = Data, Params = Record<string, string>>(
  store: Store,
  actions$: Actions,
  listActions: ListActions<Data, Error, Summary, Params>,
  listSelectors: ListSelectors<Summary, Error, Params>,
  service: ListService<Data, Summary, Params>
) {
  return actions$.pipe(
    ofType(listActions.loadPage),
    withLatestFrom(
      store.pipe(select(listSelectors.getPagingOptions)),
      store.pipe(select(listSelectors.getSortingOptions)),
      store.pipe(select(listSelectors.getFilteringOptions)),
      store.pipe(select(listSelectors.getRequestParameters))
    ),
    switchMap(([, pagingOptions, sortingOptions, filteringOptions, requestParameters]) => {
      return service
        .loadResources({
          pagingOptions,
          sortingOptions,
          filteringOptions,
          requestParameters
        })
        .pipe(
          map(resources =>
            listActions.loadPageSuccess({
              resources,
              pagingOptions
            })
          ),
          catchError((errors: Error) => of(listActions.loadPageFailure({ errors })))
        );
    })
  );
}

function patchEffect<Data, Error = unknown, Summary = Data, Params = Record<string, string>>(
  actions$: Actions,
  listActions: ListActions<Data, Error, Summary, Params>,
  service: ListService<Data, Summary, Params>
) {
  return actions$.pipe(
    ofType(listActions.patch),
    exhaustMap(action => {
      if (!service.patchResources) {
        throw new Error('patchResources not implement in the ListService');
      }

      return service.patchResources(action.resourceIds, action.resource).pipe(
        map(resources => listActions.patchSuccess({ resources })),
        catchError((errors: Error) => of(listActions.patchFailure({ errors })))
      );
    })
  );
}

function deleteEffect<Data, Error = unknown, Summary = Data, Params = Record<string, string>>(
  actions$: Actions,
  listActions: ListActions<Data, Error, Summary, Params>,
  service: ListService<Data, Summary, Params>
) {
  return actions$.pipe(
    ofType(listActions.delete),
    exhaustMap(({ resourceIds }) => {
      if (!service.deleteResources) {
        throw new Error('deleteResources not implement in the ListService');
      }

      return service.deleteResources(resourceIds).pipe(
        map(() => listActions.deleteSuccess({ resourceIds })),
        catchError((errors: Error) => of(listActions.deleteFailure({ errors })))
      );
    })
  );
}

function deleteSuccessEffect<Data, Error = unknown, Summary = Data, Params = Record<string, string>>(
  actions$: Actions,
  listActions: ListActions<Data, Error, Summary, Params>,
  notificationService?: ListNotificationService<Error>
) {
  return actions$.pipe(
    ofType(listActions.deleteSuccess),
    tap(({ resourceIds }) => {
      notificationService?.onListDelete(resourceIds);
    })
  );
}

function errorsHandlerEffect<Data, Error = unknown, Summary = Data, Params = Record<string, string>>(
  actions$: Actions,
  listActions: ListActions<Data, Error, Summary, Params>,
  notificationService?: ListNotificationService<Error>
) {
  return actions$.pipe(
    ofType(listActions.loadPageFailure, listActions.deleteFailure, listActions.patchFailure),
    tap(({ errors }) => {
      notificationService?.onListErrors(errors);
    })
  );
}
