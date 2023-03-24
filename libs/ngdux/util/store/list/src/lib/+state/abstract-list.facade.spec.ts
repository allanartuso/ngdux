import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  FilteringLogic,
  FilteringOptions,
  PagingOptions,
  RequestState,
  SortingDirection,
  SortingOptions
} from '@ngdux/data-model-common';
import { commonFixture } from '@ngdux/data-model-common/test';
import { createTestResource, createTestResources, TestResource } from '@ngdux/store-common/test';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jest-marbles';
import { testListActions, testListSelectors } from '../models/list.fixture';
import { AbstractListFacade } from './abstract-list.facade';

@Injectable({ providedIn: 'root' })
class TestListFacade extends AbstractListFacade<TestResource, string[]> {
  constructor(store: Store) {
    super(store, testListActions, testListSelectors);
  }
}

describe('TestListFacade', () => {
  let facade: TestListFacade;
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
        provideMockStore({
          selectors: [
            { selector: testListSelectors.getAll, value: resources },
            { selector: testListSelectors.getLoadingState, value: loadingState },
            { selector: testListSelectors.getRequestState, value: requestState },
            { selector: testListSelectors.getErrors, value: errors },
            { selector: testListSelectors.isReady, value: isReady }
          ]
        })
      ]
    });

    facade = TestBed.inject(TestListFacade);
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
      logic: FilteringLogic.AND
    };

    facade.changeFiltering({ filteringOptions });

    expect(store.dispatch).toHaveBeenCalledWith(testListActions.changeFiltering({ filteringOptions }));
  });

  it('triggers changePageSize action', () => {
    const pageSize = commonFixture.getNumberInRange(0, 100);

    facade.changePageSize({ pageSize });

    expect(store.dispatch).toHaveBeenCalledWith(testListActions.changePageSize({ pageSize }));
  });

  it('triggers changePagingOptions action', () => {
    const pagingOptions: PagingOptions = {
      page: commonFixture.getNumberInRange(0, 100),
      pageSize: commonFixture.getNumberInRange(0, 100)
    };

    facade.changePagingOptions({ pagingOptions });

    expect(store.dispatch).toHaveBeenCalledWith(testListActions.changePagingOptions({ pagingOptions }));
  });

  it('triggers changeSelected action', () => {
    const selectedResourceIds = createTestResources().map(r => r.id);

    facade.changeSelected({ selectedResourceIds });

    expect(store.dispatch).toHaveBeenCalledWith(testListActions.changeSelected({ selectedResourceIds }));
  });

  it('triggers changeSorting action', () => {
    const sortingOptions: SortingOptions = { field: { field: 'field', direction: SortingDirection.ASCENDING } };

    facade.changeSorting({ sortingOptions });

    expect(store.dispatch).toHaveBeenCalledWith(testListActions.changeSorting({ sortingOptions }));
  });

  it('triggers initialize action', () => {
    facade.initialize();

    expect(store.dispatch).toHaveBeenCalledWith(testListActions.initialize());
  });

  it('triggers initializeRequestOptions action', () => {
    facade.initializeRequestOptions();

    expect(store.dispatch).toHaveBeenCalledWith(testListActions.initializeRequestOptions());
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
    const pageNumber = commonFixture.getNumberInRange(0, 100);

    facade.loadPage({ pageNumber });

    expect(store.dispatch).toHaveBeenCalledWith(testListActions.loadPage({ pageNumber }));
  });

  it('triggers patch action', () => {
    const resourceIds = createTestResources().map(r => r.id);
    const resource = createTestResource();

    facade.patch({ resourceIds, resource });

    expect(store.dispatch).toHaveBeenCalledWith(testListActions.patch({ resourceIds, resource }));
  });

  it('triggers refresh action', () => {
    facade.refresh();

    expect(store.dispatch).toHaveBeenCalledWith(testListActions.refresh());
  });

  it('triggers reinitialize action', () => {
    facade.reinitialize();

    expect(store.dispatch).toHaveBeenCalledWith(testListActions.reinitialize());
  });

  it('triggers resetRequestState action', () => {
    facade.resetRequestState();

    expect(store.dispatch).toHaveBeenCalledWith(testListActions.resetRequestState());
  });

  it('triggers showRemovalsConfirmation action', () => {
    facade.showRemovalsConfirmation();

    expect(store.dispatch).toHaveBeenCalledWith(testListActions.showRemovalsConfirmation());
  });
});
