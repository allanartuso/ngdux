const mockReducerFunction = jest.fn();
const mockFormActions = { allFormActions: {} };
const mockFormSelectors = { allFormSelectors: {} };
const mockFeatureSelector = { featureSelector: {} };

jest.mock('./form-actions', () => ({
  createFormActions: jest.fn().mockReturnValue(mockFormActions)
}));

jest.mock('./form-reducer', () => ({
  createFormReducer: jest.fn().mockReturnValue(mockReducerFunction)
}));

jest.mock('./form-selectors', () => ({
  createFormSelectors: jest.fn().mockReturnValue(mockFormSelectors)
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
import { FORM_FEATURE_KEY } from '../models/form.model';
import { AbstractFormReducerManager } from './abstract-form-state.service';
import { createFormActions } from './form-actions';
import { createFormReducer } from './form-reducer';
import { createFormSelectors } from './form-selectors';

@Injectable()
export class TestReducerManager extends AbstractFormReducerManager<TestResource, string[]> {}

describe('AbstractFormReducerManager', () => {
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
        { provide: FORM_FEATURE_KEY, useValue: featureKey }
      ]
    });

    service = TestBed.inject(TestReducerManager);
  });

  it('initialize the store', () => {
    expect(createFormActions).toHaveBeenCalledWith(featureKey);
    expect(createFormReducer).toHaveBeenCalledWith(mockFormActions);
    expect(mockReducerManager.addReducer).toHaveBeenCalledWith(featureKey, mockReducerFunction);
    expect(createFeatureSelector).toHaveBeenCalledWith(featureKey);
    expect(createFormSelectors).toHaveBeenCalledWith(mockFeatureSelector);
  });

  it('set actions and selectors', () => {
    expect(service.actions).toStrictEqual(mockFormActions);
    expect(service.selectors).toStrictEqual(mockFormSelectors);
  });
});
