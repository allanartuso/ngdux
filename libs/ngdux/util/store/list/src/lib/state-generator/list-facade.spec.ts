import { InjectionToken, isSignal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  getDefaultRequestOptions,
  FilteringLogic,
  FilteringOptions,
  PagingOptions,
  RequestState,
  SortingDirection,
  SortingField,
} from '@ngdux/data-model-common';
import { commonFixture } from '@ngdux/data-model-common/test';
import { TestResource, createTestResource, createTestResources } from '@ngdux/store-common/test';
import { firstValueFrom } from 'rxjs';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jest-marbles';
import { testEntityAdapter, testListActions, testListSelectors } from '../models/list.fixture';
import { ListFacade } from '../models/list.model';
import { createListFacade, provideListFacade } from './list-facade';

const facadeToken = new InjectionToken<ListFacade<TestResource, string[]>>('TestListFacade');

describe('createListFacade', () => {
  let facade: ListFacade<TestResource, string[]>;
  let store: MockStore;
  let resources: TestResource[];
  let loadingState: RequestState;
  let requestState: RequestState;
  let errors: string[];
  let isReady: boolean;

  beforeEach(() => {
    resources = createTestResources();
    loadingState = commonFixture.getEnumValue(RequestState);
    requestState = commonFixture.getEnumValue(RequestState);
    errors = [commonFixture.getSentence()];
    isReady = commonFixture.getBoolean();

    TestBed.configureTestingModule({
      providers: [
        provideListFacade(facadeToken, testListActions, testListSelectors),
        provideMockStore({
          initialState: {
            testFeature: testEntityAdapter.getInitialState({
              ...getDefaultRequestOptions(),
              selectedResourceIds: [],
              loadingState: RequestState.IDLE,
              requestState: RequestState.IDLE,
            }),
          },
          selectors: [
            { selector: testListSelectors.getAll, value: resources },
            { selector: testListSelectors.getLoadingState, value: loadingState },
            { selector: testListSelectors.getRequestState, value: requestState },
            { selector: testListSelectors.getErrors, value: errors },
            { selector: testListSelectors.isReady, value: isReady },
          ],
        }),
      ],
    });

    facade = TestBed.inject(facadeToken);
    store = TestBed.inject(MockStore);
    jest.spyOn(store, 'dispatch');
  });

  it('get resource', () => {
    const expected = hot('a', { a: resources });

    expect(facade.resources$).toBeObservable(expected);
  });

  it('triggers delete action', () => {
    const resourceIds = createTestResources().map(r => r.id);

    facade.delete({ resourceIds });

    expect(store.dispatch).toHaveBeenCalledWith(testListActions.delete({ resourceIds }));
  });

  it('triggers changeFiltering action', () => {
    const filteringOptions: FilteringOptions = {
      filters: [],
      logic: FilteringLogic.AND,
    };

    facade.changeFiltering({ filteringOptions });

    expect(store.dispatch).toHaveBeenCalledWith(testListActions.changeFiltering({ filteringOptions }));
  });

  it('triggers changePagingOptions action', () => {
    const pagingOptions: PagingOptions = {
      page: commonFixture.getNumberInRange(0, 100),
      pageSize: commonFixture.getNumberInRange(0, 100),
    };

    facade.changePagingOptions({ pagingOptions });

    expect(store.dispatch).toHaveBeenCalledWith(testListActions.changePagingOptions({ pagingOptions }));
  });

  it('triggers changePageSize action', () => {
    const pageSize = commonFixture.getNumberInRange(0, 100);

    facade.changePageSize({ pageSize });

    expect(store.dispatch).toHaveBeenCalledWith(testListActions.changePageSize({ pageSize }));
  });

  it('triggers changePageNumber action', () => {
    const pageNumber = commonFixture.getNumberInRange(0, 100);

    facade.changePageNumber({ pageNumber });

    expect(store.dispatch).toHaveBeenCalledWith(testListActions.changePageNumber({ pageNumber }));
  });

  it('triggers changeSelected action', () => {
    const selectedResourceIds = createTestResources().map(r => r.id);

    facade.changeSelectedResources({ selectedResourceIds });

    expect(store.dispatch).toHaveBeenCalledWith(testListActions.changeSelectedResources({ selectedResourceIds }));
  });

  it('triggers changeSorting action', () => {
    const sortingOptions: SortingField[] = [{ field: 'field', direction: SortingDirection.ASCENDING }];

    facade.changeSorting({ sortingOptions });

    expect(store.dispatch).toHaveBeenCalledWith(testListActions.changeSorting({ sortingOptions }));
  });

  it('triggers initialize action', () => {
    facade.initialize();

    expect(store.dispatch).toHaveBeenCalledWith(testListActions.initialize());
  });

  it('triggers loadFirstPage action', () => {
    facade.loadFirstPage();

    expect(store.dispatch).toHaveBeenCalledWith(testListActions.loadFirstPage());
  });

  it('triggers loadNextPage action', () => {
    facade.loadNextPage();

    expect(store.dispatch).toHaveBeenCalledWith(testListActions.loadNextPage());
  });

  it('triggers loadPreviousPage action', () => {
    facade.loadPreviousPage();

    expect(store.dispatch).toHaveBeenCalledWith(testListActions.loadPreviousPage());
  });

  it('triggers loadPage action', () => {
    facade.loadPage();

    expect(store.dispatch).toHaveBeenCalledWith(testListActions.loadPage());
  });

  it('triggers patch action', () => {
    const resourceIds = createTestResources().map(r => r.id);
    const resource = createTestResource();

    facade.patch({ resourceIds, resource });

    expect(store.dispatch).toHaveBeenCalledWith(testListActions.patch({ resourceIds, resource }));
  });

  it('triggers reinitialize action', () => {
    facade.reinitialize();

    expect(store.dispatch).toHaveBeenCalledWith(testListActions.reset());
  });

  it('triggers resetRequestState action', () => {
    facade.resetRequestState();

    expect(store.dispatch).toHaveBeenCalledWith(testListActions.resetRequestState());
  });
  it('keeps resources signal and observable in sync', async () => {
    expect(isSignal(facade.resources)).toBe(true);
    expect(facade.resources()).toEqual(await firstValueFrom(facade.resources$));
    store.overrideSelector(testListSelectors.getAll, [{ id: 'updated', name: 'Updated' }]);
    store.refreshState();
    expect(facade.resources()).toEqual([{ id: 'updated', name: 'Updated' }]);
    expect(await firstValueFrom(facade.resources$)).toEqual([{ id: 'updated', name: 'Updated' }]);
  });

  it('keeps loadingState signal and observable in sync', async () => {
    expect(isSignal(facade.loadingState)).toBe(true);
    expect(facade.loadingState()).toEqual(await firstValueFrom(facade.loadingState$));
    store.overrideSelector(testListSelectors.getLoadingState, RequestState.SUCCESS);
    store.refreshState();
    expect(facade.loadingState()).toEqual(RequestState.SUCCESS);
    expect(await firstValueFrom(facade.loadingState$)).toEqual(RequestState.SUCCESS);
  });

  it('keeps requestState signal and observable in sync', async () => {
    expect(isSignal(facade.requestState)).toBe(true);
    expect(facade.requestState()).toEqual(await firstValueFrom(facade.requestState$));
    store.overrideSelector(testListSelectors.getRequestState, RequestState.FAILURE);
    store.refreshState();
    expect(facade.requestState()).toEqual(RequestState.FAILURE);
    expect(await firstValueFrom(facade.requestState$)).toEqual(RequestState.FAILURE);
  });

  it('keeps errors signal and observable in sync', async () => {
    expect(isSignal(facade.errors)).toBe(true);
    expect(facade.errors()).toEqual(await firstValueFrom(facade.errors$));
    store.overrideSelector(testListSelectors.getErrors, ['Updated error']);
    store.refreshState();
    expect(facade.errors()).toEqual(['Updated error']);
    expect(await firstValueFrom(facade.errors$)).toEqual(['Updated error']);
  });

  it('keeps isReady signal and observable in sync', async () => {
    expect(isSignal(facade.isReady)).toBe(true);
    expect(facade.isReady()).toEqual(await firstValueFrom(facade.isReady$));
    store.overrideSelector(testListSelectors.isReady, true);
    store.refreshState();
    expect(facade.isReady()).toEqual(true);
    expect(await firstValueFrom(facade.isReady$)).toEqual(true);
  });

  it('keeps areSelectedReady signal and observable in sync', async () => {
    expect(isSignal(facade.areSelectedReady)).toBe(true);
    expect(facade.areSelectedReady()).toEqual(await firstValueFrom(facade.areSelectedReady$));
    store.overrideSelector(testListSelectors.areSelectedReady, true);
    store.refreshState();
    expect(facade.areSelectedReady()).toEqual(true);
    expect(await firstValueFrom(facade.areSelectedReady$)).toEqual(true);
  });

  it('keeps currentPageData signal and observable in sync', async () => {
    expect(isSignal(facade.currentPageData)).toBe(true);
    expect(facade.currentPageData()).toEqual(await firstValueFrom(facade.currentPageData$));
    store.overrideSelector(testListSelectors.getCurrentPageData, [{ id: 'updated', name: 'Updated' }]);
    store.refreshState();
    expect(facade.currentPageData()).toEqual([{ id: 'updated', name: 'Updated' }]);
    expect(await firstValueFrom(facade.currentPageData$)).toEqual([{ id: 'updated', name: 'Updated' }]);
  });

  it('keeps currentPageNumber signal and observable in sync', async () => {
    expect(isSignal(facade.currentPageNumber)).toBe(true);
    expect(facade.currentPageNumber()).toEqual(await firstValueFrom(facade.currentPageNumber$));
    store.overrideSelector(testListSelectors.getCurrentPageNumber, 3);
    store.refreshState();
    expect(facade.currentPageNumber()).toEqual(3);
    expect(await firstValueFrom(facade.currentPageNumber$)).toEqual(3);
  });

  it('keeps filteringOptions signal and observable in sync', async () => {
    expect(isSignal(facade.filteringOptions)).toBe(true);
    expect(facade.filteringOptions()).toEqual(await firstValueFrom(facade.filteringOptions$));
    store.overrideSelector(testListSelectors.getFilteringOptions, { filters: [], logic: FilteringLogic.OR });
    store.refreshState();
    expect(facade.filteringOptions()).toEqual({ filters: [], logic: FilteringLogic.OR });
    expect(await firstValueFrom(facade.filteringOptions$)).toEqual({ filters: [], logic: FilteringLogic.OR });
  });

  it('keeps requestParameters signal and observable in sync', async () => {
    expect(isSignal(facade.requestParameters)).toBe(true);
    expect(facade.requestParameters()).toEqual(await firstValueFrom(facade.requestParameters$));
    store.overrideSelector(testListSelectors.getRequestParameters, { search: 'updated' });
    store.refreshState();
    expect(facade.requestParameters()).toEqual({ search: 'updated' });
    expect(await firstValueFrom(facade.requestParameters$)).toEqual({ search: 'updated' });
  });

  it('keeps lastPageNumber signal and observable in sync', async () => {
    expect(isSignal(facade.lastPageNumber)).toBe(true);
    expect(facade.lastPageNumber()).toEqual(await firstValueFrom(facade.lastPageNumber$));
    store.overrideSelector(testListSelectors.getLastPageNumber, 5);
    store.refreshState();
    expect(facade.lastPageNumber()).toEqual(5);
    expect(await firstValueFrom(facade.lastPageNumber$)).toEqual(5);
  });

  it('keeps pagingOptions signal and observable in sync', async () => {
    expect(isSignal(facade.pagingOptions)).toBe(true);
    expect(facade.pagingOptions()).toEqual(await firstValueFrom(facade.pagingOptions$));
    store.overrideSelector(testListSelectors.getPagingOptions, { page: 3, pageSize: 25 });
    store.refreshState();
    expect(facade.pagingOptions()).toEqual({ page: 3, pageSize: 25 });
    expect(await firstValueFrom(facade.pagingOptions$)).toEqual({ page: 3, pageSize: 25 });
  });

  it('keeps requestOptions signal and observable in sync', async () => {
    expect(isSignal(facade.requestOptions)).toBe(true);
    expect(facade.requestOptions()).toEqual(await firstValueFrom(facade.requestOptions$));
    store.overrideSelector(testListSelectors.getRequestOptions, {
      pagingOptions: { page: 3, pageSize: 25 },
      sortingOptions: [],
      filteringOptions: { filters: [], logic: FilteringLogic.OR },
    });
    store.refreshState();
    expect(facade.requestOptions()).toEqual({
      pagingOptions: { page: 3, pageSize: 25 },
      sortingOptions: [],
      filteringOptions: { filters: [], logic: FilteringLogic.OR },
    });
    expect(await firstValueFrom(facade.requestOptions$)).toEqual({
      pagingOptions: { page: 3, pageSize: 25 },
      sortingOptions: [],
      filteringOptions: { filters: [], logic: FilteringLogic.OR },
    });
  });

  it('keeps sortingOptions signal and observable in sync', async () => {
    expect(isSignal(facade.sortingOptions)).toBe(true);
    expect(facade.sortingOptions()).toEqual(await firstValueFrom(facade.sortingOptions$));
    store.overrideSelector(testListSelectors.getSortingOptions, [
      { field: 'name', direction: SortingDirection.ASCENDING },
    ]);
    store.refreshState();
    expect(facade.sortingOptions()).toEqual([{ field: 'name', direction: SortingDirection.ASCENDING }]);
    expect(await firstValueFrom(facade.sortingOptions$)).toEqual([
      { field: 'name', direction: SortingDirection.ASCENDING },
    ]);
  });

  it('keeps selectedItems signal and observable in sync', async () => {
    expect(isSignal(facade.selectedItems)).toBe(true);
    expect(facade.selectedItems()).toEqual(await firstValueFrom(facade.selectedItems$));
    store.overrideSelector(testListSelectors.getSelectedItems, [{ id: 'updated', name: 'Updated' }]);
    store.refreshState();
    expect(facade.selectedItems()).toEqual([{ id: 'updated', name: 'Updated' }]);
    expect(await firstValueFrom(facade.selectedItems$)).toEqual([{ id: 'updated', name: 'Updated' }]);
  });

  it('keeps totalCount signal and observable in sync', async () => {
    expect(isSignal(facade.totalCount)).toBe(true);
    expect(facade.totalCount()).toEqual(await firstValueFrom(facade.totalCount$));
    store.overrideSelector(testListSelectors.getTotalCount, 125);
    store.refreshState();
    expect(facade.totalCount()).toEqual(125);
    expect(await firstValueFrom(facade.totalCount$)).toEqual(125);
  });

  it('can create a facade outside an injection context', () => {
    const directFacade = createListFacade(testListActions, testListSelectors, store);
    expect(directFacade.isLoading()).toBe(loadingState === RequestState.IN_PROGRESS);
  });

  it.each(Object.values(RequestState))('derives loading for %s synchronously', async state => {
    store.overrideSelector(testListSelectors.getLoadingState, RequestState.IDLE);
    store.refreshState();
    expect(facade.isLoading()).toBe(false);
    store.overrideSelector(testListSelectors.getLoadingState, state);
    store.refreshState();
    expect(facade.isLoading()).toBe(state === RequestState.IN_PROGRESS);
    expect(await firstValueFrom(facade.isLoading$)).toBe(state === RequestState.IN_PROGRESS);
  });
});
