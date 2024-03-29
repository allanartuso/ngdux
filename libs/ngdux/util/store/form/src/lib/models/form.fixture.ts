import { Injectable } from '@angular/core';
import { FormNotificationService, FormService } from '@ngdux/data-model-common';
import { TestResource } from '@ngdux/store-common/test';
import { Actions } from '@ngrx/effects';
import { createFeatureSelector, Store } from '@ngrx/store';
import { AbstractFormEffects } from '../+state/abstract-form-effects';
import { createFormActions } from '../+state/form-actions';
import { createFormSelectors } from '../+state/form-selectors';

export const featureKey = 'testFeature';

export const testFormActions = createFormActions<TestResource, string[]>(featureKey);
export const testFormSelectors = createFormSelectors<TestResource, string[]>(createFeatureSelector(featureKey));
const mockNotificationService: FormNotificationService<string[]> = {
  onFormErrors: jest.fn(),
  onFormDelete: jest.fn()
};

@Injectable()
export class TestFormService implements FormService<TestResource> {
  loadResource = jest.fn();
  saveResource = jest.fn();
  createResource = jest.fn();
  deleteResource = jest.fn();
}

@Injectable()
export class TestFormEffects extends AbstractFormEffects<TestResource, string[]> {
  constructor(actions$: Actions, store: Store, testService: TestFormService) {
    super(actions$, store, testService, testFormActions, mockNotificationService);
  }
}
