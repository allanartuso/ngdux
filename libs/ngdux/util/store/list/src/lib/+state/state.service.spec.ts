const mockReducerFunction = jest.fn();
const mockListActions = { allListActions: {} };
const mockListSelectors = { allListSelectors: {} };
const mockEntityAdapter = { entityAdapter: {} };
const mockFeatureSelector = { featureSelector: {} };

jest.mock('../state-generator/list-actions', () => ({
  createListActions: jest.fn().mockReturnValue(mockListActions)
}));

jest.mock('../state-generator/list-reducer', () => ({
  createListEntityAdapter: jest.fn().mockReturnValue(mockEntityAdapter),
  createListReducer: jest.fn().mockReturnValue(mockReducerFunction)
}));

jest.mock('../state-generator/list-selectors', () => ({
  createListSelectors: jest.fn().mockReturnValue(mockListSelectors)
}));

jest.mock('@ngrx/store', () => {
  const actualModule = jest.requireActual('@ngrx/store');

  return {
    ...actualModule,
    createFeatureSelector: jest.fn().mockReturnValue(mockFeatureSelector)
  };
});

import { TestBed } from '@angular/core/testing';
import { commonFixture } from '@ngdux/data-model-common/test';
import { TestResource } from '@ngdux/store-common/test';
import { createFeatureSelector, ReducerManager } from '@ngrx/store';
import { LIST_FEATURE_KEYS } from '../models/list.model';

import { createListActions } from '../state-generator/list-actions';
import { createListEntityAdapter, createListReducer } from '../state-generator/list-reducer';
import { createListSelectors } from '../state-generator/list-selectors';
import { ListStateService } from './state.service';

describe('ListStateService', () => {
  let service: ListStateService<TestResource, string[]>;
  let featureKey: string;
  let mockReducerManager: Partial<ReducerManager>;

  beforeEach(() => {
    featureKey = commonFixture.getWord();
    mockReducerManager = {
      addReducer: jest.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        ListStateService,
        { provide: ReducerManager, useValue: mockReducerManager },
        { provide: LIST_FEATURE_KEYS, useValue: [featureKey] }
      ]
    });

    service = TestBed.inject(ListStateService<TestResource, string[]>);
  });

  it('initialize the store', () => {
    expect(createListActions).toHaveBeenCalledWith(featureKey);
    expect(createListEntityAdapter).toHaveBeenCalledWith();
    expect(createListReducer).toHaveBeenCalledWith(mockEntityAdapter, mockListActions);
    expect(mockReducerManager.addReducer).toHaveBeenCalledWith(featureKey, mockReducerFunction);
    expect(createFeatureSelector).toHaveBeenCalledWith(featureKey);
    expect(createListSelectors).toHaveBeenCalledWith(mockEntityAdapter, mockFeatureSelector);
  });

  it('set actions and selectors', () => {
    expect(service.getFeatureActions(featureKey)).toStrictEqual(mockListActions);
    expect(service.getFeatureSelectors(featureKey)).toStrictEqual(mockListSelectors);
  });
});
