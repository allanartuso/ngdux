import { RequestState, getDefaultRequestOptions } from '@ngdux/data-model-common';
import { TestResource, createTestResources } from '@ngdux/store-common/test';
import { createFeatureSelector } from '@ngrx/store';
import { TestErrors } from '../models/list.fixture';
import { ListState } from '../models/list.model';
import { createListEntityAdapter } from './list-reducer';
import { createListSelectors } from './list-selectors';

describe('list selectors', () => {
  let state: ListState<TestResource, TestErrors>;
  let resources: TestResource[];
  const requestOptions = getDefaultRequestOptions();

  const testEntityAdapter = createListEntityAdapter<TestResource>();
  const listSelectors = createListSelectors<TestResource, TestErrors>(
    testEntityAdapter,
    createFeatureSelector('testFeature')
  );

  const initialState = testEntityAdapter.getInitialState({
    ...requestOptions,
    lastPageNumber: undefined,
    currentResourceId: undefined,
    selectedResourceIds: [],
    loadingState: RequestState.IDLE,
    requestState: RequestState.IDLE,
    errors: undefined
  });

  beforeEach(() => {
    resources = createTestResources();
    state = testEntityAdapter.addMany(resources, { ...initialState });
    state.selectedResourceIds = [resources[0].id, resources[1].id];
  });

  it('getPagingOptions', () => {
    expect(listSelectors.getPagingOptions.projector(state)).toBe(state.pagingOptions);
  });

  it('getCurrentPageNumber', () => {
    expect(listSelectors.getCurrentPageNumber.projector(state.pagingOptions)).toBe(state.pagingOptions.page);
  });

  it('getLastPageNumber', () => {
    const lastPageNumber = 5;
    state.lastPageNumber = lastPageNumber;

    expect(listSelectors.getLastPageNumber.projector(state)).toBe(lastPageNumber);
  });

  it('getSortingOptions', () => {
    expect(listSelectors.getSortingOptions.projector(state)).toBe(state.sortingOptions);
  });

  it('getFilteringOptions', () => {
    expect(listSelectors.getFilteringOptions.projector(state)).toBe(state.filteringOptions);
  });

  it('getLoadingState', () => {
    expect(listSelectors.getLoadingState.projector(state)).toBe(state.loadingState);
  });

  it('isLastPage', () => {
    const lastPageNumber = 1;
    state.pagingOptions.page = lastPageNumber;

    expect(listSelectors.isLastPage.projector(state.pagingOptions, lastPageNumber)).toBe(true);
  });

  it('getRequestState', () => {
    expect(listSelectors.getRequestState.projector(state)).toBe(state.requestState);
  });

  describe('getCurrentPageData', () => {
    const pageSize = 2;

    beforeEach(() => {
      resources = createTestResources();
      state = testEntityAdapter.addMany(resources, { ...initialState });
      state.pagingOptions.pageSize = pageSize;
    });

    it('returns current page data', () => {
      const allResources = testEntityAdapter.getSelectors().selectAll(state);

      expect(listSelectors.getCurrentPageData.projector(allResources)).toStrictEqual(allResources);
    });
  });

  describe('getTotalCount', () => {
    beforeEach(() => {
      resources = createTestResources();
      state = testEntityAdapter.setAll(resources, { ...initialState });
    });

    it('gets the total count if it is not last page', () => {
      state.pagingOptions.pageSize = resources.length;

      expect(listSelectors.getTotalCount.projector(state.pagingOptions, false, resources)).toStrictEqual(
        resources.length * 2
      );
    });

    it('gets the total count if is the last page', () => {
      const pageSize = 5;
      state.pagingOptions.pageSize = pageSize;

      expect(listSelectors.getTotalCount.projector(state.pagingOptions, true, resources)).toStrictEqual(
        resources.length
      );
    });

    it('gets the total count if is the last page and it is not the first page', () => {
      const pageSize = 5;
      const page = 2;
      state.pagingOptions.pageSize = pageSize;
      state.pagingOptions.page = page;

      expect(listSelectors.getTotalCount.projector(state.pagingOptions, true, resources)).toStrictEqual(
        resources.length + pageSize
      );
    });
  });

  describe('getSelectionRecord', () => {
    let selectedResourceIds: string[];
    beforeEach(() => {
      resources = createTestResources();
      state = testEntityAdapter.addMany(resources, { ...initialState });
      selectedResourceIds = [resources[0].id, resources[2].id];
      state.selectedResourceIds = selectedResourceIds;
    });

    it('gets the selected resources', () => {
      const record = testEntityAdapter.getSelectors().selectEntities(state);
      expect(listSelectors.getSelectionRecord.projector(selectedResourceIds, record)).toStrictEqual({
        [selectedResourceIds[0]]: resources[0],
        [selectedResourceIds[1]]: resources[2]
      });
    });
  });

  it('getSelectedResourceIds', () => {
    expect(listSelectors.getSelectedResourceIds.projector(state)).toBe(state.selectedResourceIds);
  });

  it('getSelected', () => {
    const allResources = testEntityAdapter.getSelectors().selectEntities(state);

    expect(listSelectors.getSelectedItems.projector(state.selectedResourceIds, allResources)).toStrictEqual(
      resources.slice(0, 2)
    );
  });

  describe('isReady', () => {
    it('returns true when the resources are loaded', () => {
      const allResources = testEntityAdapter.getSelectors().selectAll(state);

      expect(listSelectors.isReady.projector(allResources, RequestState.SUCCESS)).toBe(true);
    });

    it('returns false when the resources loading state is in progress', () => {
      const allResources = testEntityAdapter.getSelectors().selectAll(state);

      expect(listSelectors.isReady.projector(allResources, RequestState.IN_PROGRESS)).toBe(false);
    });

    it('returns false when the resources are not defined', () => {
      expect(listSelectors.isReady.projector(undefined, RequestState.IDLE)).toBe(false);
    });
  });

  describe('areSelectedReady', () => {
    let selectedResources: { [x: string]: TestResource };
    let selectedResourceIds: string[];

    beforeEach(() => {
      selectedResourceIds = [resources[0].id, resources[1].id];
      selectedResources = {
        [resources[0].id]: resources[0],
        [resources[1].id]: resources[1]
      };
    });

    it('returns true when the selected resources are loaded', () => {
      expect(
        listSelectors.areSelectedReady.projector(selectedResourceIds, selectedResources, RequestState.SUCCESS)
      ).toBe(true);
    });

    it('returns false when the one or more selected resources are not loaded', () => {
      selectedResourceIds = [resources[1].id, resources[2].id];

      expect(
        listSelectors.areSelectedReady.projector(selectedResourceIds, selectedResources, RequestState.SUCCESS)
      ).toBe(false);
    });

    it('returns false when the request is in progress', () => {
      expect(
        listSelectors.areSelectedReady.projector(selectedResourceIds, selectedResources, RequestState.IN_PROGRESS)
      ).toBe(false);
    });
  });

  describe('isDeleteDisabled', () => {
    it('returns true when no resources are selected ', () => {
      const selectedResourceIds: string[] = [];

      expect(listSelectors.isDeleteDisabled.projector(selectedResourceIds)).toBe(true);
    });

    it('returns false if at least one resource is selected', () => {
      const selectedResourceIds = [resources[0].id];

      expect(listSelectors.isDeleteDisabled.projector(selectedResourceIds)).toBe(false);
    });
  });

  describe('isCopyDisabled', () => {
    it('returns true when no resources are selected', () => {
      const selectedResourceIds: string[] = [];

      expect(listSelectors.isCopyDisabled.projector(selectedResourceIds)).toBe(true);
    });

    it('returns true if more than one resource is selected', () => {
      const selectedResourceIds = [resources[0].id, resources[1].id];

      expect(listSelectors.isCopyDisabled.projector(selectedResourceIds)).toBe(true);
    });

    it('returns false if one resource is selected', () => {
      const selectedResourceIds = [resources[0].id];

      expect(listSelectors.isCopyDisabled.projector(selectedResourceIds)).toBe(false);
    });
  });
});
