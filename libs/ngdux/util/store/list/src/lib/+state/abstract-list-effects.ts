import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import {
  FilteringOptions,
  ListNotificationService,
  ListService,
  PagingOptions,
  SortingOptions
} from '@ngdux/data-model-common';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { createAction, select, Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, concatMap, exhaustMap, filter, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';

import { ListActions, ListSelectors } from '../models/list.model';

export abstract class AbstractListEffects<T, E, S = T> {
  texts = {
    deleteConfirmationTitle: 'Delete resources',
    deleteConfirmationMessage: 'Are you sure to delete the selected resources?',
    deletedMessage: 'The resources were deleted successfully.'
  };

  initialize$ = createEffect(() =>
    this.actions$.pipe(
      ofType(this.listActions.initialize, this.listActions.reinitialize),
      switchMap(() => {
        return [this.listActions.loadPage({ pageNumber: 1 }), this.listActions.loadPage({ pageNumber: 2 })];
      })
    )
  );

  loadPreviousPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(this.listActions.loadPreviousPage),
      withLatestFrom(this.store.pipe(select(this.listSelectors.getCurrentPageNumber))),
      filter(([, currentPageNumber]) => currentPageNumber > 1),
      map(([, currentPageNumber]) => this.listActions.loadPage({ pageNumber: currentPageNumber - 1 }))
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
      map(([, , currentPageNumber]) => this.listActions.loadPage({ pageNumber: currentPageNumber + 1 }))
    )
  );

  refresh$ = createEffect(() =>
    this.actions$.pipe(
      ofType(this.listActions.refresh),
      withLatestFrom(this.store.pipe(select(this.listSelectors.getCurrentPageNumber))),
      switchMap(([, currentPageNumber]) => [
        this.listActions.loadPage({ pageNumber: currentPageNumber }),
        this.listActions.loadPage({ pageNumber: currentPageNumber + 1 })
      ])
    )
  );

  changePagingOptions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(this.listActions.changePagingOptions),
      withLatestFrom(this.store.pipe(select(this.listSelectors.getPagingOptions))),
      map(([action, pagingOptions]) => {
        if (action.pagingOptions.pageSize !== pagingOptions.pageSize) {
          return this.listActions.changePageSize({ pageSize: action.pagingOptions.pageSize });
        } else if (action.pagingOptions.page === pagingOptions.page + 1) {
          return this.listActions.loadNextPage();
        } else if (action.pagingOptions.page === pagingOptions.page - 1) {
          return this.listActions.loadPreviousPage();
        } else if (action.pagingOptions.page === 1) {
          return this.listActions.loadFirstPage();
        }

        return createAction('Not implement page options action');
      })
    )
  );

  changeRequestOptions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        this.listActions.changePageSize,
        this.listActions.changeSorting,
        this.listActions.changeFiltering,
        this.listActions.loadFirstPage
      ),
      map(() => this.listActions.initialize())
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
      concatMap(
        ([{ pageNumber }, pagingOptions, sortingOptions, filteringOptions]: [
          { pageNumber: number },
          PagingOptions,
          SortingOptions,
          FilteringOptions
        ]) => {
          pagingOptions = {
            page: pageNumber,
            pageSize: pagingOptions.pageSize
          };

          return this.service
            .queryResources({
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
        }
      )
    )
  );

  patch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(this.listActions.patch),
      exhaustMap(action =>
        this.service.patchResources(action.resourceIds, action.resource).pipe(
          switchMap(resources => [this.listActions.patchSuccess({ resources }), this.listActions.refresh()]),
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
          switchMap(() => [this.listActions.deleteSuccess({ resourceIds }), this.listActions.refresh()]),
          catchError((errors: E) => of(this.listActions.deleteFailure({ errors })))
        )
      )
    )
  );

  deleteUsersSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(this.listActions.deleteSuccess),
        tap(() => {
          this.snackBar.open(this.texts.deletedMessage, 'Ok');
        })
      ),
    { dispatch: false }
  );

  copySelected$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(this.listActions.copySelected),
        withLatestFrom(this.store.pipe(select(this.listSelectors.getSelectedResourceIds))),
        tap(([, resourceIds]) => {
          this.router.navigate([resourceIds[0]], { state: { selectedResourceId: resourceIds[0] } });
        })
      ),
    { dispatch: false }
  );

  navigateToSelected$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(this.listActions.navigateToSelected),
        tap(action => {
          this.router.navigate([action.resourceId]);
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
    protected readonly router: Router,
    protected readonly actions$: Actions,
    protected readonly store: Store,
    protected readonly snackBar: MatSnackBar,
    private readonly service: ListService<T, S>,
    private readonly listActions: ListActions<T, E, S>,
    private readonly listSelectors: ListSelectors<S, E>,
    private readonly notificationService: ListNotificationService<E>
  ) {}
}
