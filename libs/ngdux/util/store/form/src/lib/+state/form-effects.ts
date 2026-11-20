import { inject } from '@angular/core';
import { FormNotificationService, FormService } from '@ngdux/data-model-common';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, defer, exhaustMap, map, of, switchMap, takeUntil, tap } from 'rxjs';
import { FormActions } from '../models/form.model';

export function createFormEffects<DTO, ERROR, CREATE_DTO = DTO>(
  formActions: FormActions<DTO, ERROR, CREATE_DTO>,
  formService: () => FormService<DTO, CREATE_DTO>,
  notificationService: () => FormNotificationService<ERROR>
) {
  return {
    load$: createEffect(
      (actions$ = inject(Actions), service = formService()) => loadResourceEffect(actions$, formActions, service),
      {
        functional: true
      }
    ),
    create$: createEffect(
      (actions$ = inject(Actions), service = formService()) => createResourceEffect(actions$, formActions, service),
      {
        functional: true
      }
    ),
    update$: createEffect(
      (actions$ = inject(Actions), service = formService()) => updateResourceEffect(actions$, formActions, service),
      {
        functional: true
      }
    ),
    delete$: createEffect(
      (actions$ = inject(Actions), service = formService()) => deleteResourceEffect(actions$, formActions, service),
      {
        functional: true
      }
    ),
    errorsHandler$: createEffect(
      (actions$ = inject(Actions), service = notificationService()) =>
        errorsHandlerEffect(actions$, formActions, service),
      {
        functional: true,
        dispatch: false
      }
    )
  };
}

function loadResourceEffect<DTO, ERROR, CREATE_DTO = DTO>(
  actions$: Actions,
  formActions: FormActions<DTO, ERROR, CREATE_DTO>,
  service: FormService<DTO, CREATE_DTO>
) {
  return actions$.pipe(
    ofType(formActions.load),
    switchMap(({ id }) =>
      defer(() => service.loadResource(id)).pipe(
        takeUntil(actions$.pipe(ofType(formActions.reset))),
        map(resource => formActions.loadSuccess({ resource })),
        catchError((errors: ERROR) => of(formActions.loadFailure({ errors })))
      )
    )
  );
}

function createResourceEffect<DTO, ERROR, CREATE_DTO = DTO>(
  actions$: Actions,
  formActions: FormActions<DTO, ERROR, CREATE_DTO>,
  service: FormService<DTO, CREATE_DTO>
) {
  return actions$.pipe(
    ofType(formActions.create),
    switchMap(({ resource }) => {
      const createResource = service.createResource?.bind(service);
      if (!createResource) {
        return of(formActions.mutationUnavailable({ operation: 'create' }));
      }
      return defer(() => createResource(resource)).pipe(
        takeUntil(actions$.pipe(ofType(formActions.reset))),
        map(resource => formActions.createSuccess({ resource })),
        catchError((errors: ERROR) => of(formActions.createFailure({ errors })))
      );
    })
  );
}

function updateResourceEffect<DTO, ERROR, CREATE_DTO = DTO>(
  actions$: Actions,
  formActions: FormActions<DTO, ERROR, CREATE_DTO>,
  service: FormService<DTO, CREATE_DTO>
) {
  return actions$.pipe(
    ofType(formActions.save),
    switchMap(({ resource }) => {
      const saveResource = service.saveResource?.bind(service);
      if (!saveResource) {
        return of(formActions.mutationUnavailable({ operation: 'save' }));
      }
      return defer(() => saveResource(resource)).pipe(
        takeUntil(actions$.pipe(ofType(formActions.reset))),
        map(response => formActions.saveSuccess({ resource: response })),
        catchError((errors: ERROR) => of(formActions.saveFailure({ errors })))
      );
    })
  );
}

function deleteResourceEffect<DTO, ERROR, CREATE_DTO = DTO>(
  actions$: Actions,
  formActions: FormActions<DTO, ERROR, CREATE_DTO>,
  service: FormService<DTO, CREATE_DTO>
) {
  return actions$.pipe(
    ofType(formActions.delete),
    exhaustMap(({ id }) => {
      const deleteResource = service.deleteResource?.bind(service);
      if (!deleteResource) {
        return of(formActions.mutationUnavailable({ operation: 'delete' }));
      }
      return defer(() => deleteResource(id)).pipe(
        takeUntil(actions$.pipe(ofType(formActions.reset))),
        map(() => formActions.deleteSuccess({ id })),
        catchError((errors: ERROR) => of(formActions.deleteFailure({ errors })))
      );
    })
  );
}

function errorsHandlerEffect<DTO, ERROR, CREATE_DTO = DTO>(
  actions$: Actions,
  formActions: FormActions<DTO, ERROR, CREATE_DTO>,
  notificationService: FormNotificationService<ERROR>
) {
  return actions$.pipe(
    ofType(formActions.saveFailure, formActions.loadFailure, formActions.deleteFailure, formActions.createFailure),
    tap(({ errors }) => {
      notificationService.onFormErrors(errors);
    })
  );
}
