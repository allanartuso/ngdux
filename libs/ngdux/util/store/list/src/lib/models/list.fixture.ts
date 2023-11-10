import { Injectable } from '@angular/core';
import { ListNotificationService, ListService } from '@ngdux/data-model-common';
import { TestResource } from '@ngdux/store-common/test';
import { Actions } from '@ngrx/effects';
import { Store, createFeatureSelector } from '@ngrx/store';
import { AbstractListEffects } from '../state-generator/abstract-list-effects';
import { createListActions } from '../state-generator/list-actions';
import { createListEntityAdapter } from '../state-generator/list-reducer';
import { createListSelectors } from '../state-generator/list-selectors';

export type TestErrors = string[];

export const featureKey = 'testFeature';
export const testListActions = createListActions<TestResource, TestErrors>(featureKey);
export const testEntityAdapter = createListEntityAdapter<TestResource>();
export const testListSelectors = createListSelectors<TestResource, TestErrors>(
  testEntityAdapter,
  createFeatureSelector(featureKey)
);

@Injectable()
export class TestListService implements ListService<TestResource> {
  loadResources = jest.fn();
  patchResources = jest.fn();
  deleteResources = jest.fn();
}

const mockNotificationService: ListNotificationService<TestErrors> = {
  openConfirmationDialog: jest.fn(),
  onListErrors: jest.fn(),
  onListDelete: jest.fn()
};

@Injectable()
export class TestListEffects extends AbstractListEffects<TestResource, TestErrors> {
  constructor(actions$: Actions, store: Store, testService: TestListService) {
    super(actions$, store, testService, testListActions, testListSelectors, mockNotificationService);
  }
}

export function createTestErrors(): TestErrors {
  return ['test message'];
}
