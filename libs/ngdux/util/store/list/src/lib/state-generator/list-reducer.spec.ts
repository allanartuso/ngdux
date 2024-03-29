let mockLastPageNumber: number;
jest.mock('@ngdux/store-common', () => ({
  getLastPageNumber: jest.fn().mockImplementation(() => mockLastPageNumber),
  createLoadingStateActionHandlers: jest.fn().mockReturnValue([]),
  createRequestStateActionHandlers: jest.fn().mockReturnValue([])
}));

import {
  FilteringField,
  FilteringLogic,
  FilteringOperator,
  FilteringOptions,
  RequestState,
  SortingDirection,
  SortingOptions,
  getDefaultRequestOptions
} from '@ngdux/data-model-common';
import { createLoadingStateActionHandlers, createRequestStateActionHandlers } from '@ngdux/store-common';
import { TestResource, createTestResource, createTestResources } from '@ngdux/store-common/test';
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
      ...getDefaultRequestOptions(),
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

    const state = testReducer(undefined, testListActions.reset);

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
    const sortingOptions: SortingOptions = { name: { field: 'name', direction: SortingDirection.ASCENDING } };
    const testAction = testListActions.changeSorting({ sortingOptions });

    const state = testReducer(undefined, testAction);

    expect(state).toStrictEqual({
      ...testInitialState,
      sortingOptions: {
        ...state.sortingOptions,
        ...sortingOptions
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
    const testAction = testListActions.changeSelectedResources({ selectedResourceIds });

    const state = testReducer(undefined, testAction);

    expect(state).toStrictEqual({
      ...testInitialState,
      selectedResourceIds
    });
  });

  it('sets multiple selected resource ids', () => {
    const selectedResourceIds: string[] = ['testId1', 'testId2'];
    const testAction = testListActions.changeSelectedResources({ selectedResourceIds });

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

  it('loadPreviousPage does not decrement if the current page is 1', () => {
    const testAction = testListActions.loadPreviousPage();

    const state = testReducer(undefined, testAction);

    expect(state).toStrictEqual(testInitialState);
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
    it('sets the loaded resources when loading a page', () => {
      const loadedResources = createTestResources(2);
      const page = 4;
      const pageSize = 2;

      const testAction = testListActions.loadPageSuccess({
        resources: loadedResources,
        pagingOptions: { page, pageSize }
      });

      const state = testReducer(testInitialState, testAction);

      expect(state).toStrictEqual(
        testEntityAdapter.setAll(loadedResources, {
          ...testInitialState
        })
      );
    });

    it('sets as last page to previous page if the loaded resources are empty', () => {
      const loadedResources: TestResource[] = [];
      const page = 2;
      const pageSize = 5;
      mockLastPageNumber = page - 1;

      const testAction = testListActions.loadPageSuccess({
        resources: loadedResources,
        pagingOptions: { page, pageSize }
      });

      const state = testReducer(testInitialState, testAction);

      expect(state).toStrictEqual(
        testEntityAdapter.setAll(loadedResources, {
          ...testInitialState,
          lastPageNumber: mockLastPageNumber
        })
      );
    });
  });

  it('adds the loading state action handlers to the reducer', () => {
    const testAction = testListActions.loadPage();

    testReducer(testInitialState, testAction);

    expect(createLoadingStateActionHandlers).toHaveBeenCalledTimes(1);
    expect(createLoadingStateActionHandlers).toHaveBeenCalledWith(
      testListActions.loadPage,
      testListActions.loadPageSuccess,
      testListActions.loadPageFailure
    );
  });

  it('adds the request state action handlers to the reducer', () => {
    const testAction = testListActions.loadPage();
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
