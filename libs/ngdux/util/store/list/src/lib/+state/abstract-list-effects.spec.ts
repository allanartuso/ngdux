import { TestBed } from '@angular/core/testing';
import { DEFAULT_REQUEST_OPTIONS, ListService, RequestState } from '@ngdux/data-model-common';
import { createTestResources, TestResource } from '@ngdux/store-common/test';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jest-marbles';
import { Observable, of, throwError } from 'rxjs';
import {
  createTestErrors,
  testEntityAdapter,
  TestErrors,
  testListActions,
  TestListEffects,
  testListSelectors,
  TestListService
} from '../models/list.fixture';
import { ListState } from '../models/list.model';

describe('TestEffects', () => {
  let actions$: Observable<Action>;
  let effects: TestListEffects;
  let resourcesService: ListService<TestResource>;
  let store: MockStore;
  let resources: TestResource[];
  let initialState: ListState<TestResource, TestErrors>;

  const tenantId = 2;
  const testErrors: TestErrors = createTestErrors();

  beforeEach(() => {
    resources = createTestResources(tenantId);

    initialState = testEntityAdapter.getInitialState({
      ...DEFAULT_REQUEST_OPTIONS,
      lastPageNumber: undefined,
      selectedResourceIds: [],
      loadingState: RequestState.IDLE,
      requestState: RequestState.IDLE,
      errors: undefined
    });
    initialState = testEntityAdapter.addMany(resources, initialState);

    TestBed.configureTestingModule({
      providers: [
        TestListEffects,
        TestListService,
        provideMockActions(() => actions$),
        provideMockStore({
          selectors: [
            { selector: testListSelectors.isLastPage, value: false },
            { selector: testListSelectors.getCurrentPageNumber, value: DEFAULT_REQUEST_OPTIONS.pagingOptions.page },
            { selector: testListSelectors.getPagingOptions, value: DEFAULT_REQUEST_OPTIONS.pagingOptions },
            { selector: testListSelectors.getSortingOptions, value: DEFAULT_REQUEST_OPTIONS.sortingOptions },
            { selector: testListSelectors.getFilteringOptions, value: DEFAULT_REQUEST_OPTIONS.filteringOptions }
          ]
        })
      ]
    });

    effects = TestBed.inject(TestListEffects);
    resourcesService = TestBed.inject(TestListService);
    resourcesService.loadResources = jest.fn().mockImplementation(() => of(resources));
    resourcesService.patchResources = jest.fn().mockImplementation(() => of(resources));
    resourcesService.deleteResources = jest.fn().mockImplementation(() => of(resources));
    store = TestBed.inject(MockStore);
  });

  describe('initialize$', () => {
    it('emits load page action to the pages 1 and 2', () => {
      actions$ = hot('a', { a: testListActions.initialize() });
      const expected = hot('(ab)', {
        a: testListActions.loadPage({ pageNumber: 1 }),
        b: testListActions.loadPage({ pageNumber: 2 })
      });

      expect(effects.initialize$).toBeObservable(expected);
    });
  });

  describe('loadPage$', () => {
    it('should emit success when the api respond successfully', () => {
      const pageNumber = 3;
      const pagingOptions = { ...initialState.pagingOptions, page: pageNumber };
      actions$ = hot('a', { a: testListActions.loadPage({ pageNumber }) });
      const expected = hot('a', { a: testListActions.loadPageSuccess({ resources, pagingOptions }) });

      expect(effects.loadPage$).toBeObservable(expected);
    });

    it('should emit failure when an error is thrown', () => {
      resourcesService.loadResources = jest.fn().mockImplementation(() => throwError(testErrors));
      actions$ = hot('a', { a: testListActions.loadPage({ pageNumber: 3 }) });
      const expected = hot('a', {
        a: testListActions.loadPageFailure({ errors: testErrors })
      });

      expect(effects.loadPage$).toBeObservable(expected);
    });
  });

  describe('loadPreviousPage$', () => {
    it('emits load page action to the previous page', () => {
      const currentPageNumber = 2;
      store.overrideSelector(testListSelectors.getCurrentPageNumber, currentPageNumber);
      actions$ = hot('a', {
        a: testListActions.loadPreviousPage()
      });
      const expected = hot('a', {
        a: testListActions.loadPage({
          pageNumber: currentPageNumber - 1
        })
      });

      expect(effects.loadPreviousPage$).toBeObservable(expected);
    });
    it('does not emit load page action to the previous page if the current page is the first page', () => {
      actions$ = hot('a', {
        a: testListActions.loadPreviousPage()
      });
      const expected = hot('-');

      expect(effects.loadPreviousPage$).toBeObservable(expected);
    });
  });

  describe('loadNextPage$', () => {
    it('emits load page action to the next page', () => {
      actions$ = hot('a', {
        a: testListActions.loadNextPage()
      });
      const expected = hot('a', {
        a: testListActions.loadPage({
          pageNumber: initialState.pagingOptions.page + 1
        })
      });

      expect(effects.loadNextPage$).toBeObservable(expected);
    });
  });

  describe('changeRequestOptions$', () => {
    it('emits remove all and initialize actions', () => {
      actions$ = hot('a', { a: testListActions.changePageSize({ pageSize: 10 }) });
      const expected = hot('a', { a: testListActions.initialize() });

      expect(effects.changeRequestOptions$).toBeObservable(expected);
    });
  });

  describe('delete$', () => {
    let resourceIds: string[];

    beforeEach(() => {
      resourceIds = ['testId1'];
    });

    it('should emit success and refresh the list when service call is successful', () => {
      const expected = hot('(ab)', {
        a: testListActions.deleteSuccess({ resourceIds }),
        b: testListActions.refresh()
      });
      actions$ = hot('a', { a: testListActions.delete({ resourceIds }) });

      expect(effects.delete$).toBeObservable(expected);
    });

    it('should emit failure when error is thrown without any successes.', () => {
      store.overrideSelector(testListSelectors.getSelected, resources);
      resourcesService.deleteResources = jest.fn().mockImplementation(() => throwError(testErrors));
      const expected = hot('a', {
        a: testListActions.deleteFailure({ errors: testErrors })
      });
      actions$ = hot('a', { a: testListActions.delete({ resourceIds }) });

      expect(effects.delete$).toBeObservable(expected);
    });
  });

  describe('refresh$', () => {
    it('reloads the current and next page.', () => {
      const currentPageNumber = 2;
      store.overrideSelector(testListSelectors.getCurrentPageNumber, currentPageNumber);
      const expected = hot('(ab)', {
        a: testListActions.loadPage({ pageNumber: currentPageNumber }),
        b: testListActions.loadPage({ pageNumber: currentPageNumber + 1 })
      });
      actions$ = hot('a', { a: testListActions.refresh() });

      expect(effects.refresh$).toBeObservable(expected);
    });
  });

  describe('patch$', () => {
    let resourceIds: string[];
    let resource: Partial<TestResource>;

    beforeEach(() => {
      resourceIds = ['testId1'];
      resource = {
        name: 'testName'
      };
    });

    it('emits an info notification when receiving patch success action', () => {
      const expectedActions = hot('(ab)', {
        a: testListActions.patchSuccess({ resources }),
        b: testListActions.refresh()
      });
      actions$ = hot('a', {
        a: testListActions.patch({
          resourceIds,
          resource
        })
      });

      expect(effects.patch$).toBeObservable(expectedActions);
      expect(effects.patch$).toSatisfyOnFlush(() => {
        expect(resourcesService.patchResources).toHaveBeenCalledWith(resourceIds, resource);
      });
    });
  });
});
