import { ActionPayload } from '@ngdux/store-common';
import { select, Store } from '@ngrx/store';
import { FormActions, FormSelectors } from '../models/form.model';

export abstract class AbstractFormFacade<T, E> {
  readonly resource$ = this.store.pipe(select(this.formSelectors.getResource));
  readonly loadingState$ = this.store.pipe(select(this.formSelectors.getLoadingState));
  readonly requestState$ = this.store.pipe(select(this.formSelectors.getRequestState));
  readonly errors$ = this.store.pipe(select(this.formSelectors.getErrors));
  readonly isReady$ = this.store.pipe(select(this.formSelectors.isReady));

  constructor(
    protected readonly store: Store,
    private readonly formActions: FormActions<T, E>,
    private readonly formSelectors: FormSelectors<T, E>
  ) {}

  create(props: ActionPayload<FormActions<T, E>['create']>): void {
    this.store.dispatch(this.formActions.create(props));
  }

  load(props: ActionPayload<FormActions<T, E>['load']>): void {
    this.store.dispatch(this.formActions.load(props));
  }

  save(props: ActionPayload<FormActions<T, E>['save']>): void {
    this.store.dispatch(this.formActions.save(props));
  }

  delete(props: ActionPayload<FormActions<T, E>['delete']>): void {
    this.store.dispatch(this.formActions.delete(props));
  }

  reset(): void {
    this.store.dispatch(this.formActions.reset());
  }
}
