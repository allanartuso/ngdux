import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RequestState } from '@ngdux/data-model-common';
import { createTestResource, TestResource } from '@ngdux/store-common/test';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jasmine-marbles';
import { EMPTY, Observable, of, throwError } from 'rxjs';
import { featureKey, formActions, TestFormEffects, TestFormService } from '../models/form.fixture';
import { FormState } from '../models/form.model';

describe('TestEffects', () => {
  let actions: Observable<Action>;
  let effects: TestFormEffects;
  let testService: TestFormService;
  const errors = ['testError'];
  let resource: TestResource;

  beforeEach(() => {
    resource = createTestResource();

    const mockService: Partial<TestFormService> = {
      deleteResource: jest.fn().mockImplementation(() => of(EMPTY)),
      createResource: jest.fn().mockImplementation(() => of(resource)),
      loadResource: jest.fn().mockImplementation(() => of(resource)),
      saveResource: jest.fn().mockImplementation(() => of(resource))
    };

    const initialState: FormState<TestResource, string[]> = {
      resource,
      loadingState: RequestState.IDLE,
      requestState: RequestState.IDLE,
      errors: undefined
    };

    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        TestFormEffects,
        provideMockActions(() => actions),
        provideMockStore({
          initialState: { [featureKey]: initialState },
          selectors: []
        }),
        {
          provide: TestFormService,
          useValue: mockService
        }
      ]
    });

    effects = TestBed.inject(TestFormEffects);
    testService = TestBed.inject(TestFormService);
  });

  describe('load$', () => {
    it('should emit success when service call is successful', () => {
      actions = hot('a', {
        a: formActions.load({
          id: resource.id
        })
      });
      const expected = hot('a', { a: formActions.loadSuccess({ resource }) });

      expect(effects.load$).toBeObservable(expected);
    });

    it('should emit failure when error is thrown', () => {
      testService.loadResource = jest.fn().mockImplementation(() => throwError(errors));
      actions = hot('a', {
        a: formActions.load({ id: resource.id })
      });
      const expected = hot('a', {
        a: formActions.loadFailure({ errors })
      });

      expect(effects.load$).toBeObservable(expected);
    });
  });

  describe('create$', () => {
    it('should create', () => {
      actions = hot('a', { a: formActions.create({ resource }) });
      const expected = hot('a', {
        a: formActions.createSuccess({ resource })
      });

      expect(effects.create$).toBeObservable(expected);
      expect(testService.createResource).toHaveBeenCalledWith(resource);
    });

    it('should emit failure when error is thrown', () => {
      testService.createResource = jest.fn().mockImplementation(() => throwError(errors));
      actions = hot('a', { a: formActions.create({ resource }) });
      const expected = hot('a', {
        a: formActions.createFailure({ errors })
      });

      expect(effects.create$).toBeObservable(expected);
    });
  });

  describe('update$', () => {
    it('should update', () => {
      actions = hot('a', { a: formActions.save({ resource }) });
      const expected = hot('a', {
        a: formActions.saveSuccess({ resource })
      });

      expect(effects.update$).toBeObservable(expected);
      expect(testService.saveResource).toHaveBeenCalledWith(resource);
    });

    it('should emit failure when error is thrown', () => {
      testService.saveResource = jest.fn().mockImplementation(() => throwError(errors));
      actions = hot('a', { a: formActions.save({ resource }) });
      const expected = hot('a', {
        a: formActions.saveFailure({ errors })
      });

      expect(effects.update$).toBeObservable(expected);
    });
  });

  describe('delete$', () => {
    it('should emit success when service call is successful', () => {
      actions = hot('a', {
        a: formActions.delete({ id: resource.id })
      });
      const expected = hot('a', {
        a: formActions.deleteSuccess({ id: resource.id })
      });

      expect(effects.delete$).toBeObservable(expected);
    });

    it('should emit failure when error is thrown', () => {
      testService.deleteResource = jest.fn().mockImplementation(() => throwError(errors));
      actions = hot('a', {
        a: formActions.delete({ id: resource.id })
      });
      const expected = hot('a', {
        a: formActions.deleteFailure({ errors })
      });

      expect(effects.delete$).toBeObservable(expected);
    });
  });
});
