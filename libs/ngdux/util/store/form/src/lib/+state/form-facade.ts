import { inject, InjectionToken } from '@angular/core';
import { ActionPayload } from '@ngdux/store-common';
import { select, Store } from '@ngrx/store';
import { FormActions, FormFacade, FormSelectors } from '../models/form.model';

export function provideFormFacade<DTO, ERROR, CREATE_DTO = DTO>(
  token: InjectionToken<FormFacade<DTO, ERROR, CREATE_DTO>>,
  formActions: FormActions<DTO, ERROR, CREATE_DTO>,
  formSelectors: FormSelectors<DTO, ERROR>
) {
  return {
    provide: token,
    useFactory: () => createFormFacade(formActions, formSelectors, inject(Store))
  };
}

export function createFormFacade<DTO, ERROR, CREATE_DTO = DTO>(
  formActions: FormActions<DTO, ERROR, CREATE_DTO>,
  formSelectors: FormSelectors<DTO, ERROR>,
  store: Store
): FormFacade<DTO, ERROR, CREATE_DTO> {
  const resource$ = store.pipe(select(formSelectors.getResource));
  const loadingState$ = store.pipe(select(formSelectors.getLoadingState));
  const requestState$ = store.pipe(select(formSelectors.getRequestState));
  const errors$ = store.pipe(select(formSelectors.getErrors));
  const isReady$ = store.pipe(select(formSelectors.isReady));

  return {
    resource$,
    loadingState$,
    requestState$,
    errors$,
    isReady$,
    create(props: ActionPayload<FormActions<DTO, ERROR, CREATE_DTO>['create']>): void {
      store.dispatch(formActions.create(props));
    },
    load(props: ActionPayload<FormActions<DTO, ERROR, CREATE_DTO>['load']>): void {
      store.dispatch(formActions.load(props));
    },
    save(props: ActionPayload<FormActions<DTO, ERROR, CREATE_DTO>['save']>): void {
      store.dispatch(formActions.save(props));
    },
    delete(props: ActionPayload<FormActions<DTO, ERROR, CREATE_DTO>['delete']>): void {
      store.dispatch(formActions.delete(props));
    },
    reset(): void {
      store.dispatch(formActions.reset());
    }
  };
}
