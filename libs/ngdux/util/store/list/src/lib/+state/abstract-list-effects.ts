import { ListNotificationService, ListService } from '@ngdux/data-model-common';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, concatMap, exhaustMap, filter, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';

import { ListActions, ListSelectors } from '../models/list.model';

export abstract class AbstractListEffects<T, E, S = T> {
  texts = {
    deleteConfirmationTitle: 'Delete resources',
    deleteConfirmationMessage: 'Are you sure to delete the selected resources?'
  };

  reload$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        this.listActions.changePageSize,
        this.listActions.changeSorting,
        this.listActions.changeFiltering,
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

  changePagingOptions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(this.listActions.changePagingOptions),
      withLatestFrom(this.store.pipe(select(this.listSelectors.getPagingOptions))),
      map(([action, pagingOptions]) => {
        if (action.pagingOptions.pageSize !== pagingOptions.pageSize) {
          return this.listActions.changePageSize({ pageSize: action.pagingOptions.pageSize });
        } else {
          return this.listActions.changePageNumber({ pageNumber: action.pagingOptions.page });
        }
      })
    )
  );

  loadPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(this.listActions.loadPage),
      withLatestFrom(
        this.store.pipe(select(this.listSelectors.getPagingOptions)),
        this.store.pipe(select(this.listSelectors.getSortingOptions)),
        this.store.pipe(select(this.listSelectors.getFilteringOptions))
      ),
      concatMap(([, pagingOptions, sortingOptions, filteringOptions]) => {
        return this.service
          .loadResources({
            pagingOptions,
            sortingOptions,
            filteringOptions
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
      exhaustMap(action =>
        this.service.patchResources(action.resourceIds, action.resource).pipe(
          map(resources => this.listActions.patchSuccess({ resources })),
          catchError((errors: E) => of(this.listActions.patchFailure({ errors })))
        )
      )
    )
  );

  showRemovalsDialog$ = createEffect(() =>
    this.actions$.pipe(
      ofType(this.listActions.showRemovalsConfirmation),
      switchMap(() => {
        return this.notificationService.openConfirmationDialog({
          message: this.texts.deleteConfirmationMessage,
          title: this.texts.deleteConfirmationTitle
        });
      }),
      filter(confirmed => confirmed),
      withLatestFrom(this.store.pipe(select(this.listSelectors.getSelectedResourceIds))),
      map(([, resourceIds]) => this.listActions.delete({ resourceIds }))
    )
  );

  delete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(this.listActions.delete),
      exhaustMap(({ resourceIds }) =>
        this.service.deleteResources(resourceIds).pipe(
          map(() => this.listActions.deleteSuccess({ resourceIds })),
          catchError((errors: E) => of(this.listActions.deleteFailure({ errors })))
        )
      )
    )
  );

  deleteUsersSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(this.listActions.deleteSuccess),
        tap(({ resourceIds }) => {
          this.notificationService.onListDelete(resourceIds);
        })
      ),
    { dispatch: false }
  );

  errorsHandler$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(this.listActions.loadPageFailure, this.listActions.deleteFailure, this.listActions.patchFailure),
        tap(({ errors }) => {
          this.notificationService.onListErrors(errors);
        })
      ),
    { dispatch: false }
  );

  protected constructor(
    protected readonly actions$: Actions,
    protected readonly store: Store,
    private readonly service: ListService<T, S>,
    private readonly listActions: ListActions<T, E, S>,
    private readonly listSelectors: ListSelectors<S, E>,
    private readonly notificationService: ListNotificationService<E>
  ) {}
}
