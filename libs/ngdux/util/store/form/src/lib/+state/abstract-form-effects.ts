import { FormNotificationService, FormService } from '@ngdux/data-model-common';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, exhaustMap, map, switchMap, tap } from 'rxjs/operators';
import { FormActions } from '../models/form.model';

export abstract class AbstractFormEffects<T, E> {
  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(this.formActions.load),
      switchMap(({ id }) =>
        this.service.loadResource(id).pipe(
          map(resource => this.formActions.loadSuccess({ resource })),
          catchError((errors: E) => of(this.formActions.loadFailure({ errors })))
        )
      )
    )
  );

  create$ = createEffect(() =>
    this.actions$.pipe(
      ofType(this.formActions.create),
      switchMap(action =>
        this.service.createResource(action.resource).pipe(
          map(resource => this.formActions.createSuccess({ resource })),
          catchError((errors: E) => of(this.formActions.createFailure({ errors })))
        )
      )
    )
  );

  update$ = createEffect(() =>
    this.actions$.pipe(
      ofType(this.formActions.save),
      switchMap(({ resource }) =>
        this.service.saveResource(resource).pipe(
          map(response => this.formActions.saveSuccess({ resource: response })),
          catchError((errors: E) => of(this.formActions.saveFailure({ errors })))
        )
      )
    )
  );

  delete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(this.formActions.delete),
      exhaustMap(action =>
        this.service.deleteResource(action.id).pipe(
          map(() => this.formActions.deleteSuccess({ id: action.id })),
          catchError((errors: E) => of(this.formActions.deleteFailure({ errors })))
        )
      )
    )
  );

  errorsHandler$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          this.formActions.saveFailure,
          this.formActions.loadFailure,
          this.formActions.deleteFailure,
          this.formActions.createFailure
        ),
        tap(({ errors }) => {
          this.notificationService.onFormErrors(errors);
        })
      ),
    { dispatch: false }
  );

  protected constructor(
    protected readonly actions$: Actions,
    protected readonly store: Store,
    private readonly service: FormService<T>,
    private readonly formActions: FormActions<T, E>,
    private readonly notificationService: FormNotificationService<E>
  ) {}
}
