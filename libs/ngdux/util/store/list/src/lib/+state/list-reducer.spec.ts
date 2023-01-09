jest.mock('@ngdux/store-common', () => ({
  getLastPageNumber: jest.fn().mockReturnValue(undefined),
  createLoadingStateActionHandlers: jest.fn().mockReturnValue([]),
  createRequestStateActionHandlers: jest.fn().mockReturnValue([])
}));

import {
  DEFAULT_REQUEST_OPTIONS,
  FilteringField,
  FilteringLogic,
  FilteringOperator,
  FilteringOptions,
  RequestState,
  SortingDirection,
  SortingField
} from '@ngdux/data-model-common';
import { createLoadingStateActionHandlers, createRequestStateActionHandlers } from '@ngdux/store-common';
import { createTestResource, createTestResources, TestResource } from '@ngdux/store-common/test';
import { EntityAdapter } from '@ngrx/entity';
import { ActionReducer } from '@ngrx/store';
import { TestErrors } from '../models/list.fixture';
import { ListActions, ListState } from '../models/list.model';
import { createListActions } from './list-actions';
import { createListEntityAdapter, createListReducer } from './list-reducer';

describe('createEntityAdapter', () => {
  it('initializes the id mapping correctly', () => {
    const testResource = createTestResource();

    const entityAdapter = createListEntityAdapter();
    const state = entityAdapter.addOne(testResource, {
      ids: [],
      entities: {}
    });

    expect(state).toStrictEqual({
      ids: [testResource.id],
      entities: { [testResource.id]: testResource }
    });
  });
});

describe('createListReducer', () => {
  let testEntityAdapter: EntityAdapter<TestResource>;
  let testListActions: ListActions<TestResource, TestErrors>;
  let testInitialState: ListState<TestResource, TestErrors>;
  let testReducer: ActionReducer<ListState<TestResource, TestErrors>>;

  beforeEach(() => {
    (createLoadingStateActionHandlers as jest.Mock).mockClear();
    (createRequestStateActionHandlers as jest.Mock).mockClear();

    testEntityAdapter = createListEntityAdapter();
    testListActions = createListActions('testFeature');
    testInitialState = testEntityAdapter.getInitialState({
      ...DEFAULT_REQUEST_OPTIONS,
      lastPageNumber: undefined,
      selectedResourceIds: [],
      loadingState: RequestState.IDLE,
      requestState: RequestState.IDLE,
      errors: undefined
    });
    testReducer = createListReducer<TestResource, TestErrors>(testEntityAdapter, testListActions);
  });

  it('reinitialize the state to the initial state', () => {
    const expectedState = testInitialState;

    const state = testReducer(undefined, testListActions.reinitialize);

    expect(state).toStrictEqual(expectedState);
  });

  it('removes all the resources from the state', () => {
    const testResources = createTestResources();
    const testState = testEntityAdapter.addMany(testResources, {
      ...testInitialState,
      pagingOptions: {
        ...testInitialState.pagingOptions,
        page: 2
      }
    });
    const expectedState = testInitialState;

    const state = testReducer(testState, testListActions.initialize);

    expect(state).toStrictEqual(expectedState);
  });

  it('refresh removes all the resources from the first page', () => {
    const testResources = createTestResources();
    const testState = testEntityAdapter.addMany(testResources, { ...testInitialState });
    const expectedState = testInitialState;

    const state = testReducer(testState, testListActions.refresh);

    expect(state).toStrictEqual(expectedState);
  });

  it('refresh removes all the resources from the second page', () => {
    const testResources = createTestResources();
    const testState: ListState<TestResource, TestErrors> = testEntityAdapter.addMany(testResources, {
      ...testInitialState,
      pagingOptions: {
        page: 2,
        pageSize: 2
      }
    });
    const expectedState = testEntityAdapter.removeOne(testResources[2].id, testState);

    const state = testReducer(testState, testListActions.refresh);

    expect(state).toStrictEqual(expectedState);
  });

  it('sets the page size', () => {
    const pageSize = 10;
    const testAction = testListActions.changePageSize({ pageSize });

    const state = testReducer(undefined, testAction);

    expect(state).toStrictEqual({
      ...testInitialState,
      pagingOptions: {
        ...testInitialState.pagingOptions,
        pageSize
      }
    });
  });

  it('sets the sorting options', () => {
    const sortingField: SortingField = { field: 'name', direction: SortingDirection.ASCENDING };
    const testAction = testListActions.changeSorting({ sortingField });

    const state = testReducer(undefined, testAction);

    expect(state).toStrictEqual({
      ...testInitialState,
      sortingOptions: {
        ...state.sortingOptions,
        [sortingField.field]: sortingField
      }
    });
  });

  it('sets the filtering options', () => {
    const filteringField: FilteringField = {
      field: 'name',
      value: 'abc',
      operator: FilteringOperator.StartsWith
    };
    const filteringOptions: FilteringOptions = {
      logic: FilteringLogic.AND,
      filters: [filteringField]
    };
    const testAction = testListActions.changeFiltering({ filteringOptions });

    const state = testReducer(undefined, testAction);

    expect(state).toStrictEqual({
      ...testInitialState,
      filteringOptions
    });
  });

  it('sets a single selected resource id', () => {
    const selectedResourceIds: string[] = ['testId'];
    const testAction = testListActions.changeSelected({ selectedResourceIds });

    const state = testReducer(undefined, testAction);

    expect(state).toStrictEqual({
      ...testInitialState,
      selectedResourceIds
    });
  });

  it('sets multiple selected resource ids', () => {
    const selectedResourceIds: string[] = ['testId1', 'testId2'];
    const testAction = testListActions.changeSelected({ selectedResourceIds });

    const state = testReducer(undefined, testAction);

    expect(state).toStrictEqual({
      ...testInitialState,
      selectedResourceIds
    });
  });

  it('loadFirstPage sets page to 1', () => {
    testInitialState = {
      ...testInitialState,
      pagingOptions: { ...testInitialState.pagingOptions, page: 2 }
    };
    const testAction = testListActions.loadFirstPage();

    const state = testReducer(testInitialState, testAction);

    expect(state).toStrictEqual({
      ...testInitialState,
      pagingOptions: { ...testInitialState.pagingOptions, page: 1 }
    });
  });

  it('loadPreviousPage decrements by one the page number', () => {
    testInitialState = {
      ...testInitialState,
      pagingOptions: { ...testInitialState.pagingOptions, page: 3 }
    };
    const testAction = testListActions.loadPreviousPage();

    const state = testReducer(testInitialState, testAction);

    expect(state).toStrictEqual({
      ...testInitialState,
      pagingOptions: {
        ...testInitialState.pagingOptions,
        page: testInitialState.pagingOptions.page - 1
      }
    });
  });

  it('loadPreviousPage does not decrement if the current page is 1', () => {
    const testAction = testListActions.loadPreviousPage();

    const state = testReducer(undefined, testAction);

    expect(state).toStrictEqual(testInitialState);
  });

  it('loadNextPage increments by one the page number', () => {
    const testAction = testListActions.loadNextPage();

    const state = testReducer(undefined, testAction);

    expect(state).toStrictEqual({
      ...testInitialState,
      pagingOptions: {
        ...testInitialState.pagingOptions,
        page: testInitialState.pagingOptions.page + 1
      }
    });
  });

  it('loadNextPage does not increments the page number if it is the last page', () => {
    const lastPageNumber = 3;
    testInitialState = {
      ...testInitialState,
      pagingOptions: {
        ...testInitialState.pagingOptions,
        page: lastPageNumber
      },
      lastPageNumber
    };
    const testAction = testListActions.loadNextPage();

    const state = testReducer(testInitialState, testAction);

    expect(state).toStrictEqual(testInitialState);
  });

  describe('loadPageSuccess', () => {
    it('sets the loaded resources and removes the first page found in the state when loading the next page', () => {
      const currentResources = createTestResources(6);
      const loadedResources = createTestResources(2);
      const page = 4;
      const pageSize = 2;
      const testAction = testListActions.loadPageSuccess({
        resources: loadedResources,
        pagingOptions: { page, pageSize }
      });
      testInitialState = testEntityAdapter.addMany(currentResources, {
        ...testInitialState,
        pagingOptions: { page: page - 1, pageSize }
      });

      const state = testReducer(testInitialState, testAction);

      expect(state).toStrictEqual(
        testEntityAdapter.setAll([...currentResources.slice(pageSize, currentResources.length), ...loadedResources], {
          ...testInitialState
        })
      );
    });

    it('sets the loaded resources and removes the last page found in the state when loading the previous page', () => {
      const currentResources = createTestResources(6);
      const loadedResources = createTestResources(2);
      const page = 4;
      const pageSize = 2;
      const testAction = testListActions.loadPageSuccess({
        resources: loadedResources,
        pagingOptions: {
          page: page - 1,
          pageSize
        }
      });
      testInitialState = testEntityAdapter.addMany(currentResources, {
        ...testInitialState,
        pagingOptions: { page, pageSize }
      });

      const state = testReducer(testInitialState, testAction);

      expect(state).toStrictEqual(
        testEntityAdapter.setAll([...loadedResources, ...currentResources.slice(0, -pageSize)], {
          ...testInitialState
        })
      );
    });
  });

  it('adds the loading state action handlers to the reducer', () => {
    const testAction = testListActions.loadPage({ pageNumber: 1 });

    testReducer(testInitialState, testAction);

    expect(createLoadingStateActionHandlers).toHaveBeenCalledTimes(1);
    expect(createLoadingStateActionHandlers).toHaveBeenCalledWith(
      testListActions.loadPage,
      testListActions.loadPageSuccess,
      testListActions.loadPageFailure
    );
  });

  it('adds the request state action handlers to the reducer', () => {
    const testAction = testListActions.loadPage({ pageNumber: 1 });
    testReducer(testInitialState, testAction);

    expect(createRequestStateActionHandlers).toHaveBeenCalledTimes(2);
    expect(createRequestStateActionHandlers).toHaveBeenCalledWith(
      undefined,
      testListActions.delete,
      testListActions.deleteSuccess,
      testListActions.deleteFailure
    );
    expect(createRequestStateActionHandlers).toHaveBeenCalledWith(
      testListActions.resetRequestState,
      testListActions.patch,
      testListActions.patchSuccess,
      testListActions.patchFailure
    );
  });
});
