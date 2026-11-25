import { RequestState } from '@ngdux/data-model-common';
import { createLoadingStateActionHandlers, createRequestStateActionHandlers } from '@ngdux/store-common';
import { createTestResource, TestResource } from '@ngdux/store-common/test';
import { ActionCreator, createAction, on, props, ReducerTypes } from '@ngrx/store';
import { FormState } from '../models/form.model';
import { createFormActions } from './form-actions';
import { createFormReducer } from './form-reducer';

jest.mock('@ngdux/store-common', () => ({
  createLoadingStateActionHandlers: jest.fn().mockReturnValue([]),
  createRequestStateActionHandlers: jest.fn().mockReturnValue([]),
}));

describe('createFormReducer', () => {
  const testFormActions = createFormActions<TestResource, string[]>('testFeature');
  const testReducer = createFormReducer<TestResource, string[]>(testFormActions);
  let testInitialState: FormState<TestResource, string[]>;
  let resource: TestResource;

  beforeEach(() => {
    resource = createTestResource();

    testInitialState = {
      resource: undefined,
      loadingState: RequestState.IDLE,
      requestState: RequestState.IDLE,
      errors: undefined,
    };
  });

  it('adds the request state action handlers to the reducer', () => {
    const action = testFormActions.load({ id: resource.id });

    testReducer(testInitialState, action);

    expect(createRequestStateActionHandlers).toHaveBeenCalledTimes(3);
    expect(createRequestStateActionHandlers).toHaveBeenCalledWith(
      testFormActions.load,
      testFormActions.save,
      testFormActions.saveSuccess,
      testFormActions.saveFailure,
    );
    expect(createRequestStateActionHandlers).toHaveBeenCalledWith(
      undefined,
      testFormActions.delete,
      testFormActions.deleteSuccess,
      testFormActions.deleteFailure,
    );
    expect(createRequestStateActionHandlers).toHaveBeenCalledWith(
      undefined,
      testFormActions.create,
      testFormActions.createSuccess,
      testFormActions.createFailure,
    );
  });

  it('adds the loading state action handlers to the reducer', () => {
    const action = testFormActions.load({ id: resource.id });

    testReducer(testInitialState, action);

    expect(createLoadingStateActionHandlers).toHaveBeenCalledTimes(1);
    expect(createLoadingStateActionHandlers).toHaveBeenCalledWith(
      testFormActions.load,
      testFormActions.loadSuccess,
      testFormActions.loadFailure,
    );
  });

  describe(testFormActions.loadSuccess.type, () => {
    it('sets the loaded resource', () => {
      const action = testFormActions.loadSuccess({ resource });

      const state: FormState<TestResource, string[]> = testReducer(testInitialState, action);

      expect(state).toStrictEqual({ ...testInitialState, resource });
    });
  });

  describe(testFormActions.saveSuccess.type, () => {
    it('sets the saved resource', () => {
      const action = testFormActions.saveSuccess({ resource });

      const state: FormState<TestResource, string[]> = testReducer(testInitialState, action);

      expect(state).toStrictEqual({ ...testInitialState, resource });
    });
  });

  describe(testFormActions.deleteSuccess.type, () => {
    it('sets the resource to undefined', () => {
      const action = testFormActions.deleteSuccess({ id: resource.id });
      const initialState: FormState<TestResource, string[]> = {
        ...testInitialState,
        resource,
      };

      const state: FormState<TestResource, string[]> = testReducer(initialState, action);

      expect(state).toStrictEqual({ ...initialState, resource: undefined });
    });
  });

  describe(testFormActions.reset.type, () => {
    it('resets the state', () => {
      const action = testFormActions.reset();

      const state: FormState<TestResource, string[]> = testReducer(
        {
          ...testInitialState,
          resource,
        },
        action,
      );

      expect(state).toStrictEqual(testInitialState);
    });
  });
});

describe('createFormReducer with an extended state', () => {
  interface ExtendedFormState extends FormState<TestResource, string[]> {
    checked: boolean;
  }

  const actions = createFormActions<TestResource, string[]>('extendedFeature');
  const checked = createAction('[extendedFeature] Checked', props<{ checked: boolean }>());
  const handlers: ReducerTypes<ExtendedFormState, ActionCreator[]>[] = [
    on(checked, (state, { checked }) => ({ ...state, checked })),
  ];
  const createReducer = () => createFormReducer(actions, handlers, { checked: false });

  it('adds the extra initial state and handlers', () => {
    const reducer = createReducer();
    const state = reducer(undefined, checked({ checked: true }));

    expect(state.checked).toBe(true);
    expect(state.requestState).toBe(RequestState.IDLE);
  });

  it('keeps the extra state in the ngdux handlers and resets it', () => {
    const reducer = createReducer();
    const resource = createTestResource();
    const state = reducer(undefined, checked({ checked: true }));

    expect(reducer(state, actions.loadSuccess({ resource })).checked).toBe(true);
    expect(reducer(state, actions.reset()).checked).toBe(false);
  });
});
