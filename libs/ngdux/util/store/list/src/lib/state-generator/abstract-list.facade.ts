import { ActionPayload } from '@ngdux/store-common';
import { select, Store } from '@ngrx/store';
import { ListActions, ListSelectors } from '../models/list.model';

export abstract class AbstractListFacade<T, E, S = T, Params = Record<string, string>> {
  readonly resources$ = this.store.pipe(select(this.listSelectors.getAll));
  readonly loadingState$ = this.store.pipe(select(this.listSelectors.getLoadingState));
  readonly requestState$ = this.store.pipe(select(this.listSelectors.getRequestState));
  readonly errors$ = this.store.pipe(select(this.listSelectors.getErrors));
  readonly isReady$ = this.store.pipe(select(this.listSelectors.isReady));
  readonly areSelectedReady$ = this.store.pipe(select(this.listSelectors.areSelectedReady));
  readonly currentPageData$ = this.store.pipe(select(this.listSelectors.getCurrentPageData));
  readonly currentPageNumber$ = this.store.pipe(select(this.listSelectors.getCurrentPageNumber));
  readonly filteringOptions$ = this.store.pipe(select(this.listSelectors.getFilteringOptions));
  readonly requestParameters$ = this.store.pipe(select(this.listSelectors.getRequestParameters));
  readonly lastPageNumber$ = this.store.pipe(select(this.listSelectors.getLastPageNumber));
  readonly pagingOptions$ = this.store.pipe(select(this.listSelectors.getPagingOptions));
  readonly requestOptions$ = this.store.pipe(select(this.listSelectors.getRequestOptions));
  readonly sortingOptions$ = this.store.pipe(select(this.listSelectors.getSortingOptions));
  readonly selectedItems$ = this.store.pipe(select(this.listSelectors.getSelectedItems));
  readonly totalCount$ = this.store.pipe(select(this.listSelectors.getTotalCount));

  constructor(
    protected readonly store: Store,
    private readonly listActions: ListActions<T, E, S, Params>,
    private readonly listSelectors: ListSelectors<S, E, Params>
  ) {}

  setPageSize(props: ActionPayload<ListActions<T, E, S, Params>['setPageSize']>): void {
    this.store.dispatch(this.listActions.setPageSize(props));
  }

  setFiltering(props: ActionPayload<ListActions<T, E, S, Params>['setFiltering']>): void {
    this.store.dispatch(this.listActions.setFiltering(props));
  }

  setSorting(props: ActionPayload<ListActions<T, E, S, Params>['setSorting']>): void {
    this.store.dispatch(this.listActions.setSorting(props));
  }

  setRequestParameters(props: ActionPayload<ListActions<T, E, S, Params>['setRequestParams']>) {
    this.store.dispatch(this.listActions.setRequestParams(props));
  }

  changeFiltering(props: ActionPayload<ListActions<T, E, S, Params>['changeFiltering']>): void {
    this.store.dispatch(this.listActions.changeFiltering(props));
  }

  changePagingOptions(props: ActionPayload<ListActions<T, E, S, Params>['changePagingOptions']>): void {
    this.store.dispatch(this.listActions.changePagingOptions(props));
  }

  changePageSize(props: ActionPayload<ListActions<T, E, S, Params>['changePageSize']>): void {
    this.store.dispatch(this.listActions.changePageSize(props));
  }

  changePageNumber(props: ActionPayload<ListActions<T, E, S, Params>['changePageNumber']>): void {
    this.store.dispatch(this.listActions.changePageNumber(props));
  }

  changeSelectedResources(props: ActionPayload<ListActions<T, E, S, Params>['changeSelectedResources']>): void {
    this.store.dispatch(this.listActions.changeSelectedResources(props));
  }

  changeSorting(props: ActionPayload<ListActions<T, E, S, Params>['changeSorting']>): void {
    this.store.dispatch(this.listActions.changeSorting(props));
  }

  changeRequestParams(props: ActionPayload<ListActions<T, E, S, Params>['changeRequestParams']>): void {
    this.store.dispatch(this.listActions.changeRequestParams(props));
  }

  loadPage(): void {
    this.store.dispatch(this.listActions.loadPage());
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

  patch(props: ActionPayload<ListActions<T, E, S, Params>['patch']>): void {
    this.store.dispatch(this.listActions.patch(props));
  }

  delete(props: ActionPayload<ListActions<T, E, S, Params>['delete']>): void {
    this.store.dispatch(this.listActions.delete(props));
  }

  initialize(): void {
    this.store.dispatch(this.listActions.initialize());
  }

  reinitialize(): void {
    this.store.dispatch(this.listActions.reset());
  }

  resetRequestState(): void {
    this.store.dispatch(this.listActions.resetRequestState());
  }

  /**
   * @deprecated The method will be removed. The AbstractFacade will not be responsible for it anymore
   */
  showRemovalsConfirmation(): void {
    this.store.dispatch(this.listActions.showRemovalsConfirmation());
  }
}
