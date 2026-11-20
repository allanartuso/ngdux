import { Injectable } from '@angular/core';
import { ListNotificationService, ListService } from '@ngdux/data-model-common';
import { TestResource } from '@ngdux/store-common/test';
import { createFeatureSelector } from '@ngrx/store';
import { createListActions } from '../state-generator/list-actions';
import { createListEntityAdapter } from '../state-generator/list-reducer';
import { createListSelectors } from '../state-generator/list-selectors';

export type TestErrors = string[];

export const featureKey = 'testFeature';
export const testListActions = createListActions<TestResource, TestErrors>(featureKey);
export const testEntityAdapter = createListEntityAdapter<TestResource>();
export const testListSelectors = createListSelectors<TestResource, TestErrors>(
  testEntityAdapter,
  createFeatureSelector(featureKey),
);

@Injectable()
export class TestListService implements ListService<TestResource> {
  loadResources = jest.fn();
  patchResources = jest.fn();
  deleteResources = jest.fn();
}

export const mockNotificationService: ListNotificationService<TestErrors> = {
  onListErrors: jest.fn(),
  onListDelete: jest.fn(),
};

export function createTestErrors(): TestErrors {
  return ['test message'];
}
