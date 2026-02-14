import { ActionPayload } from '@ngdux/store-common';
import { select, Store } from '@ngrx/store';
import { FormActions, FormSelectors } from '../models/form.model';

/**
 * @deprecated This class is deprecated and will be removed in a future release. Please use `provideFormFacade` or `createFormFacade` instead.
 */
export abstract class AbstractFormFacade<DTO, E, CREATE_DTO = DTO> {
  readonly resource$ = this.store.pipe(select(this.formSelectors.getResource));
  readonly loadingState$ = this.store.pipe(select(this.formSelectors.getLoadingState));
  readonly requestState$ = this.store.pipe(select(this.formSelectors.getRequestState));
  readonly errors$ = this.store.pipe(select(this.formSelectors.getErrors));
  readonly isReady$ = this.store.pipe(select(this.formSelectors.isReady));

  constructor(
    protected readonly store: Store,
    private readonly formActions: FormActions<DTO, E, CREATE_DTO>,
    private readonly formSelectors: FormSelectors<DTO, E>
  ) {}

  create(props: ActionPayload<FormActions<DTO, E, CREATE_DTO>['create']>): void {
    this.store.dispatch(this.formActions.create(props));
  }

  load(props: ActionPayload<FormActions<DTO, E, CREATE_DTO>['load']>): void {
    this.store.dispatch(this.formActions.load(props));
  }

  save(props: ActionPayload<FormActions<DTO, E, CREATE_DTO>['save']>): void {
    this.store.dispatch(this.formActions.save(props));
  }

  delete(props: ActionPayload<FormActions<DTO, E, CREATE_DTO>['delete']>): void {
    this.store.dispatch(this.formActions.delete(props));
  }

  reset(): void {
    this.store.dispatch(this.formActions.reset());
  }
}
