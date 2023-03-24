import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RequestState } from '@ngdux/data-model-common';
import { commonFixture } from '@ngdux/data-model-common/test';
import { createTestResource, TestResource } from '@ngdux/store-common/test';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jest-marbles';
import { testFormActions, testFormSelectors } from '../models/form.fixture';
import { AbstractFormFacade } from './abstract-form.facade';

@Injectable({ providedIn: 'root' })
class TestFormFacade extends AbstractFormFacade<TestResource, string[]> {
  constructor(store: Store) {
    super(store, testFormActions, testFormSelectors);
  }
}

describe('TestFormFacade', () => {
  let facade: TestFormFacade;
  let store: MockStore;
  let resource: TestResource;
  let loadingState: RequestState;
  let requestState: RequestState;
  let errors: string[];
  let isReady: boolean;

  beforeEach(() => {
    resource = createTestResource();
    loadingState = commonFixture.getEnumValue(RequestState);
    requestState = commonFixture.getEnumValue(RequestState);
    errors = [commonFixture.getSentence()];
    isReady = commonFixture.getBoolean();

    TestBed.configureTestingModule({
      providers: [
        provideMockStore({
          selectors: [
            { selector: testFormSelectors.getResource, value: resource },
            { selector: testFormSelectors.getLoadingState, value: loadingState },
            { selector: testFormSelectors.getRequestState, value: requestState },
            { selector: testFormSelectors.getErrors, value: errors },
            { selector: testFormSelectors.isReady, value: isReady }
          ]
        })
      ]
    });

    facade = TestBed.inject(TestFormFacade);
    store = TestBed.inject(MockStore);
    jest.spyOn(store, 'dispatch');
  });

  it('get resource', () => {
    const expected = hot('a', { a: resource });

    expect(facade.resource$).toBeObservable(expected);
  });

  it('triggers save action', () => {
    const resource = createTestResource();

    facade.save({ resource });

    expect(store.dispatch).toHaveBeenCalledWith(testFormActions.save({ resource }));
  });

  it('triggers load action', () => {
    const id = commonFixture.getAlphaNumeric();

    facade.load({ id });

    expect(store.dispatch).toHaveBeenCalledWith(testFormActions.load({ id }));
  });

  it('triggers load action', () => {
    const resource = createTestResource();

    facade.create({ resource });

    expect(store.dispatch).toHaveBeenCalledWith(testFormActions.create({ resource }));
  });

  it('triggers delete action', () => {
    const id = commonFixture.getAlphaNumeric();

    facade.delete({ id });

    expect(store.dispatch).toHaveBeenCalledWith(testFormActions.delete({ id }));
  });

  it('triggers reset action', () => {
    facade.reset();

    expect(store.dispatch).toHaveBeenCalledWith(testFormActions.reset());
  });
});
