import { ListNotificationService, ListService } from '@ngdux/data-model-common';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, exhaustMap, filter, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';

import { ListActions, ListSelectors } from '../models/list.model';

/**
 * @deprecated This class is deprecated and will be removed in a future release. Please use `createListEffects` instead.
 */
export abstract class AbstractListEffects<T, E = unknown, S = T, Params = Record<string, string>> {
  reload$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        this.listActions.changePageSize,
        this.listActions.changeSorting,
        this.listActions.changeFiltering,
        this.listActions.changePagingOptions,
        this.listActions.changeRequestParams,
        this.listActions.initialize,
        this.listActions.reset,
        this.listActions.changePageNumber,
        this.listActions.patchSuccess,
        this.listActions.deleteSuccess
      ),
      map(() => this.listActions.loadPage())
    )
  );

  loadFirstPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(this.listActions.loadFirstPage),
      map(() => this.listActions.changePageNumber({ pageNumber: 1 }))
    )
  );

  loadPreviousPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(this.listActions.loadPreviousPage),
      withLatestFrom(this.store.pipe(select(this.listSelectors.getCurrentPageNumber))),
      filter(([, currentPageNumber]) => currentPageNumber > 1),
      map(([, currentPageNumber]) => this.listActions.changePageNumber({ pageNumber: currentPageNumber - 1 }))
    )
  );

  loadNextPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(this.listActions.loadNextPage),
      withLatestFrom(
        this.store.pipe(select(this.listSelectors.isLastPage)),
        this.store.pipe(select(this.listSelectors.getCurrentPageNumber))
      ),
      filter(([, isLastPage]) => !isLastPage),
      map(([, , currentPageNumber]) => this.listActions.changePageNumber({ pageNumber: currentPageNumber + 1 }))
    )
  );

  loadPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(this.listActions.loadPage),
      withLatestFrom(
        this.store.pipe(select(this.listSelectors.getPagingOptions)),
        this.store.pipe(select(this.listSelectors.getSortingOptions)),
        this.store.pipe(select(this.listSelectors.getFilteringOptions)),
        this.store.pipe(select(this.listSelectors.getRequestParameters))
      ),
      switchMap(([, pagingOptions, sortingOptions, filteringOptions, requestParameters]) => {
        return this.service
          .loadResources({
            pagingOptions,
            sortingOptions,
            filteringOptions,
            requestParameters
          })
          .pipe(
            map(resources =>
              this.listActions.loadPageSuccess({
                resources,
                pagingOptions
              })
            ),
            catchError((errors: E) => of(this.listActions.loadPageFailure({ errors })))
          );
      })
    )
  );

  patch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(this.listActions.patch),
      exhaustMap(action => {
        if (!this.service.patchResources) {
          throw new Error('patchResources not implement in the ListService');
        }

        return this.service.patchResources(action.resourceIds, action.resource).pipe(
          map(resources => this.listActions.patchSuccess({ resources })),
          catchError((errors: E) => of(this.listActions.patchFailure({ errors })))
        );
      })
    )
  );

  delete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(this.listActions.delete),
      exhaustMap(({ resourceIds }) => {
        if (!this.service.deleteResources) {
          throw new Error('deleteResources not implement in the ListService');
        }

        return this.service.deleteResources(resourceIds).pipe(
          map(() => this.listActions.deleteSuccess({ resourceIds })),
          catchError((errors: E) => of(this.listActions.deleteFailure({ errors })))
        );
      })
    )
  );

  deleteSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(this.listActions.deleteSuccess),
        tap(({ resourceIds }) => {
          this.notificationService?.onListDelete(resourceIds);
        })
      ),
    { dispatch: false }
  );

  errorsHandler$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(this.listActions.loadPageFailure, this.listActions.deleteFailure, this.listActions.patchFailure),
        tap(({ errors }) => {
          this.notificationService?.onListErrors(errors);
        })
      ),
    { dispatch: false }
  );

  protected constructor(
    protected readonly actions$: Actions,
    protected readonly store: Store,
    protected readonly service: ListService<T, S, Params>,
    protected readonly listActions: ListActions<T, E, S, Params>,
    protected readonly listSelectors: ListSelectors<S, E, Params>,
    protected readonly notificationService?: ListNotificationService<E>
  ) {}
}
