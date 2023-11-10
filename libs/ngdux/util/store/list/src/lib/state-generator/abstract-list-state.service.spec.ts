const mockReducerFunction = jest.fn();
const mockListActions = { allListActions: {} };
const mockListSelectors = { allListSelectors: {} };
const mockEntityAdapter = { entityAdapter: {} };
const mockFeatureSelector = { featureSelector: {} };

jest.mock('./list-actions', () => ({
  createListActions: jest.fn().mockReturnValue(mockListActions)
}));

jest.mock('./list-reducer', () => ({
  createListEntityAdapter: jest.fn().mockReturnValue(mockEntityAdapter),
  createListReducer: jest.fn().mockReturnValue(mockReducerFunction)
}));

jest.mock('./list-selectors', () => ({
  createListSelectors: jest.fn().mockReturnValue(mockListSelectors)
}));

jest.mock('@ngrx/store', () => {
  const actualModule = jest.requireActual('@ngrx/store');

  return {
    ...actualModule,
    createFeatureSelector: jest.fn().mockReturnValue(mockFeatureSelector)
  };
});

import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { commonFixture } from '@ngdux/data-model-common/test';
import { TestResource } from '@ngdux/store-common/test';
import { createFeatureSelector, ReducerManager } from '@ngrx/store';
import { LIST_FEATURE_KEY } from '../models/list.model';
import { AbstractListReducerManager } from './abstract-list-state.service';
import { createListActions } from './list-actions';
import { createListEntityAdapter, createListReducer } from './list-reducer';
import { createListSelectors } from './list-selectors';

@Injectable()
export class TestReducerManager extends AbstractListReducerManager<TestResource, string[]> {}

describe('AbstractListReducerManager', () => {
  let service: TestReducerManager;
  let featureKey: string;
  let mockReducerManager: Partial<ReducerManager>;

  beforeEach(() => {
    featureKey = commonFixture.getWord();
    mockReducerManager = {
      addReducer: jest.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        TestReducerManager,
        { provide: ReducerManager, useValue: mockReducerManager },
        { provide: LIST_FEATURE_KEY, useValue: featureKey }
      ]
    });

    service = TestBed.inject(TestReducerManager);
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
    expect(service.actions).toStrictEqual(mockListActions);
    expect(service.selectors).toStrictEqual(mockListSelectors);
  });
});
