import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ListNotificationService, ListService } from '@ngdux/data-model-common';
import { TestResource } from '@ngdux/store-common/test';
import { Actions } from '@ngrx/effects';
import { createFeatureSelector, Store } from '@ngrx/store';
import { AbstractListEffects } from '../+state/abstract-list-effects';
import { createListActions } from '../+state/list-actions';
import { createListEntityAdapter } from '../+state/list-reducer';
import { createListSelectors } from '../+state/list-selectors';

export type TestErrors = string[];

export const featureKey = 'testFeature';
export const listActions = createListActions<TestResource, TestErrors>(featureKey);
export const testEntityAdapter = createListEntityAdapter<TestResource>();
export const listSelectors = createListSelectors<TestResource, TestErrors>(
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
  constructor(router: Router, actions$: Actions, store: Store, testService: TestListService) {
    super(actions$, store, testService, listActions, listSelectors, mockNotificationService);
  }
}

export function createTestErrors(): TestErrors {
  return ['test message'];
}
