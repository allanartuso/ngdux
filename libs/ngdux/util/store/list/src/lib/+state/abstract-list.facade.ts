import { ActionPayload } from '@ngdux/store-common';
import { select, Store } from '@ngrx/store';
import { ListActions, ListSelectors } from '../models/list.model';

export abstract class AbstractListFacade<T, E, S = T> {
  readonly resources$ = this.store.pipe(select(this.listSelectors.getAll));
  readonly loadingState$ = this.store.pipe(select(this.listSelectors.getLoadingState));
  readonly requestState$ = this.store.pipe(select(this.listSelectors.getRequestState));
  readonly errors$ = this.store.pipe(select(this.listSelectors.getErrors));
  readonly isReady$ = this.store.pipe(select(this.listSelectors.isReady));
  readonly areSelectedReady$ = this.store.pipe(select(this.listSelectors.areSelectedReady));
  readonly currentPageData$ = this.store.pipe(select(this.listSelectors.getCurrentPageData));
  readonly currentPageNumber$ = this.store.pipe(select(this.listSelectors.getCurrentPageNumber));
  readonly filteringOptions$ = this.store.pipe(select(this.listSelectors.getFilteringOptions));
  readonly lastPageNumber$ = this.store.pipe(select(this.listSelectors.getLastPageNumber));
  readonly pagingOptions$ = this.store.pipe(select(this.listSelectors.getPagingOptions));
  readonly requestOptions$ = this.store.pipe(select(this.listSelectors.getRequestOptions));
  readonly selected$ = this.store.pipe(select(this.listSelectors.getSelected));

  constructor(
    protected readonly store: Store,
    private readonly listActions: ListActions<T, E, S>,
    private readonly listSelectors: ListSelectors<S, E>
  ) {}

  initializeRequestOptions(): void {
    this.store.dispatch(this.listActions.initializeRequestOptions());
  }

  changeFiltering(props: ActionPayload<ListActions<T, E>['changeFiltering']>): void {
    this.store.dispatch(this.listActions.changeFiltering(props));
  }

  changePageSize(props: ActionPayload<ListActions<T, E>['changePageSize']>): void {
    this.store.dispatch(this.listActions.changePageSize(props));
  }

  changePagingOptions(props: ActionPayload<ListActions<T, E>['changePagingOptions']>): void {
    this.store.dispatch(this.listActions.changePagingOptions(props));
  }

  changeSelected(props: ActionPayload<ListActions<T, E>['changeSelected']>): void {
    this.store.dispatch(this.listActions.changeSelected(props));
  }

  changeSorting(props: ActionPayload<ListActions<T, E>['changeSorting']>): void {
    this.store.dispatch(this.listActions.changeSorting(props));
  }

  loadPage(props: ActionPayload<ListActions<T, E>['loadPage']>): void {
    this.store.dispatch(this.listActions.loadPage(props));
  }

  loadFirstPage(): void {
    this.store.dispatch(this.listActions.loadFirstPage());
  }

  loadNextPage(): void {
    this.store.dispatch(this.listActions.loadNextPage());
  }

  loadPreviousPage(): void {
    this.store.dispatch(this.listActions.loadPreviousPage());
  }

  patch(props: ActionPayload<ListActions<T, E>['patch']>): void {
    this.store.dispatch(this.listActions.patch(props));
  }

  delete(props: ActionPayload<ListActions<T, E>['delete']>): void {
    this.store.dispatch(this.listActions.delete(props));
  }

  refresh(): void {
    this.store.dispatch(this.listActions.refresh());
  }

  initialize(): void {
    this.store.dispatch(this.listActions.initialize());
  }

  reinitialize(): void {
    this.store.dispatch(this.listActions.reinitialize());
  }

  resetRequestState(): void {
    this.store.dispatch(this.listActions.resetRequestState());
  }

  showRemovalsConfirmation(): void {
    this.store.dispatch(this.listActions.showRemovalsConfirmation());
  }
}
