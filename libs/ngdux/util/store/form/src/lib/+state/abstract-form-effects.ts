import { FormNotificationService, FormService } from '@ngdux/data-model-common';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, exhaustMap, map, switchMap, tap } from 'rxjs/operators';
import { FormActions } from '../models/form.model';

export abstract class AbstractFormEffects<DTO, ERROR, CREATE_DTO = DTO> {
  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(this.formActions.load),
      switchMap(({ id }) =>
        this.service.loadResource(id).pipe(
          map(resource => this.formActions.loadSuccess({ resource })),
          catchError((errors: ERROR) => of(this.formActions.loadFailure({ errors })))
        )
      )
    )
  );

  create$ = createEffect(() =>
    this.actions$.pipe(
      ofType(this.formActions.create),
      switchMap(action => {
        if (!this.service.createResource) {
          throw new Error('createResource not implement in the ListService');
        }

        return this.service.createResource(action.resource).pipe(
          map(resource => this.formActions.createSuccess({ resource })),
          catchError((errors: ERROR) => of(this.formActions.createFailure({ errors })))
        );
      })
    )
  );

  update$ = createEffect(() =>
    this.actions$.pipe(
      ofType(this.formActions.save),
      switchMap(({ resource }) => {
        if (!this.service.saveResource) {
          throw new Error('saveResource not implement in the ListService');
        }

        return this.service.saveResource(resource).pipe(
          map(response => this.formActions.saveSuccess({ resource: response })),
          catchError((errors: ERROR) => of(this.formActions.saveFailure({ errors })))
        );
      })
    )
  );

  delete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(this.formActions.delete),
      exhaustMap(action => {
        if (!this.service.deleteResource) {
          throw new Error('deleteResource not implement in the ListService');
        }

        return this.service.deleteResource(action.id).pipe(
          map(() => this.formActions.deleteSuccess({ id: action.id })),
          catchError((errors: ERROR) => of(this.formActions.deleteFailure({ errors })))
        );
      })
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
    private readonly service: FormService<DTO, CREATE_DTO>,
    private readonly formActions: FormActions<DTO, ERROR, CREATE_DTO>,
    private readonly notificationService: FormNotificationService<ERROR>
  ) {}
}
