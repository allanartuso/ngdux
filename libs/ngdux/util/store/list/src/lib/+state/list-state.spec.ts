const mockActions = 'mockActions';
jest.mock('./list-actions', () => ({
  createListActions: jest.fn().mockReturnValue(mockActions)
}));

const mockReducer = 'mockReducer';
const mockAdapter = 'mockAdapter';
jest.mock('./list-reducer', () => ({
  createListReducer: jest.fn().mockReturnValue(() => mockReducer),
  createListEntityAdapter: jest.fn().mockReturnValue(mockAdapter)
}));

const mockSelectors = 'mockSelectors';
jest.mock('./list-selectors', () => ({
  createListSelectors: jest.fn().mockReturnValue(mockSelectors)
}));

const mockFeatureSelector = 'mockFeatureSelector';
jest.mock('@ngrx/store', () => ({
  createFeatureSelector: jest.fn().mockReturnValue(mockFeatureSelector)
}));

import { createFeatureSelector } from '@ngrx/store';
import { createListActions } from './list-actions';
import { createListReducer } from './list-reducer';
import { createListSelectors } from './list-selectors';
import { createListState } from './list-state';

describe('listState', () => {
  const featureName = 'testFeatureName';
  const { actions, reducer, selectors } = createListState(featureName);

  it('create list actions', () => {
    expect(createListActions).toHaveBeenCalledWith(featureName);
    expect(actions).toBe(mockActions);
  });

  it('create list reducer', () => {
    expect(createListReducer).toHaveBeenCalledWith(mockAdapter, mockActions);
    expect(reducer(undefined, { type: '' })).toBe(mockReducer);
  });

  it('create list selectors', () => {
    expect(createFeatureSelector).toHaveBeenCalledWith(featureName);
    expect(createListSelectors).toHaveBeenCalledWith(mockAdapter, mockFeatureSelector);
    expect(selectors).toStrictEqual(mockSelectors);
  });
});
