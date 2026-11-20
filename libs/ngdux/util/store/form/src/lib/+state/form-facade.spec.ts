import { InjectionToken, isSignal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RequestState } from '@ngdux/data-model-common';
import { commonFixture } from '@ngdux/data-model-common/test';
import { createTestResource, TestResource } from '@ngdux/store-common/test';
import { firstValueFrom } from 'rxjs';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jest-marbles';
import { testFormActions, testFormSelectors } from '../models/form.fixture';
import { FormFacade } from '../models/form.model';
import { createFormFacade, provideFormFacade } from './form-facade';

const facadeToken = new InjectionToken<FormFacade<TestResource, string[]>>('TestFormFacade');

describe('createFormFacade', () => {
  let facade: FormFacade<TestResource, string[]>;
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
        provideFormFacade(facadeToken, testFormActions, testFormSelectors),
        provideMockStore({
          initialState: { testFeature: { loadingState: RequestState.IDLE, requestState: RequestState.IDLE } },
          selectors: [
            { selector: testFormSelectors.getResource, value: resource },
            { selector: testFormSelectors.getLoadingState, value: loadingState },
            { selector: testFormSelectors.getRequestState, value: requestState },
            { selector: testFormSelectors.getErrors, value: errors },
            { selector: testFormSelectors.isReady, value: isReady },
          ],
        }),
      ],
    });

    facade = TestBed.inject(facadeToken);
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
  it('keeps resource signal and observable in sync', async () => {
    expect(isSignal(facade.resource)).toBe(true);
    expect(facade.resource()).toEqual(await firstValueFrom(facade.resource$));
    store.overrideSelector(testFormSelectors.getResource, { id: 'updated', name: 'Updated' });
    store.refreshState();
    expect(facade.resource()).toEqual({ id: 'updated', name: 'Updated' });
    expect(await firstValueFrom(facade.resource$)).toEqual({ id: 'updated', name: 'Updated' });
  });

  it('keeps loadingState signal and observable in sync', async () => {
    expect(isSignal(facade.loadingState)).toBe(true);
    expect(facade.loadingState()).toEqual(await firstValueFrom(facade.loadingState$));
    store.overrideSelector(testFormSelectors.getLoadingState, RequestState.SUCCESS);
    store.refreshState();
    expect(facade.loadingState()).toEqual(RequestState.SUCCESS);
    expect(await firstValueFrom(facade.loadingState$)).toEqual(RequestState.SUCCESS);
  });

  it('keeps requestState signal and observable in sync', async () => {
    expect(isSignal(facade.requestState)).toBe(true);
    expect(facade.requestState()).toEqual(await firstValueFrom(facade.requestState$));
    store.overrideSelector(testFormSelectors.getRequestState, RequestState.FAILURE);
    store.refreshState();
    expect(facade.requestState()).toEqual(RequestState.FAILURE);
    expect(await firstValueFrom(facade.requestState$)).toEqual(RequestState.FAILURE);
  });

  it('keeps errors signal and observable in sync', async () => {
    expect(isSignal(facade.errors)).toBe(true);
    expect(facade.errors()).toEqual(await firstValueFrom(facade.errors$));
    store.overrideSelector(testFormSelectors.getErrors, ['Updated error']);
    store.refreshState();
    expect(facade.errors()).toEqual(['Updated error']);
    expect(await firstValueFrom(facade.errors$)).toEqual(['Updated error']);
  });

  it('keeps isReady signal and observable in sync', async () => {
    expect(isSignal(facade.isReady)).toBe(true);
    expect(facade.isReady()).toEqual(await firstValueFrom(facade.isReady$));
    store.overrideSelector(testFormSelectors.isReady, true);
    store.refreshState();
    expect(facade.isReady()).toEqual(true);
    expect(await firstValueFrom(facade.isReady$)).toEqual(true);
  });

  it('can create a facade outside an injection context', () => {
    const directFacade = createFormFacade(testFormActions, testFormSelectors, store);
    expect(directFacade.isLoading()).toBe(loadingState === RequestState.IN_PROGRESS);
  });

  it.each(Object.values(RequestState))('derives loading for %s synchronously', async state => {
    store.overrideSelector(testFormSelectors.getLoadingState, RequestState.IDLE);
    store.refreshState();
    expect(facade.isLoading()).toBe(false);
    store.overrideSelector(testFormSelectors.getLoadingState, state);
    store.refreshState();
    expect(facade.isLoading()).toBe(state === RequestState.IN_PROGRESS);
    expect(await firstValueFrom(facade.isLoading$)).toBe(state === RequestState.IN_PROGRESS);
  });
});
