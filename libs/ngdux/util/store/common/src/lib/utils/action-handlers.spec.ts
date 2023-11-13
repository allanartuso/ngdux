import { RequestState } from '@ngdux/data-model-common';
import { Action, createAction, createReducer, props } from '@ngrx/store';
import {
  ApiRequestState,
  LoadingState,
  createLoadingStateActionHandlers,
  createRequestStateActionHandlers,
  getLastPageNumber
} from './action-handlers';

const loadAction = createAction('[Action Handlers Test] Load Action');
const loadSuccessAction = createAction('[Action Handlers Test] Load Success Action');
const loadFailureAction = createAction('[Action Handlers Test] Load Failure Action');

const saveAction = createAction('[Action Handlers Test] Save Action');
const saveSuccessAction = createAction('[Action Handlers Test] Save Success Action');
const saveFailureAction = createAction('[Action Handlers Test] Save Failure Action', props<{ errors: string[] }>());

// tslint:disable-next-line: no-empty-interface
interface TestState extends ApiRequestState<string[]>, LoadingState {}

const initialTestState: TestState = {
  errors: undefined,
  requestState: RequestState.IDLE,
  loadingState: RequestState.IDLE
};

const reducer = createReducer(
  initialTestState,
  ...createRequestStateActionHandlers<TestState, string[]>(
    loadAction,
    saveAction,
    saveSuccessAction,
    saveFailureAction
  ),
  ...createLoadingStateActionHandlers<TestState>(loadAction, loadSuccessAction, loadFailureAction)
);

function testReducer(state: TestState, action: Action): TestState {
  return reducer(state, action);
}

describe('actionHandlers testReducer', () => {
  describe(loadAction.type, () => {
    it('sets loading state to in progress', () => {
      const action = loadAction();
      const state: TestState = testReducer(initialTestState, action);

      expect(state).toStrictEqual({
        ...initialTestState,
        loadingState: RequestState.IN_PROGRESS,
        requestState: RequestState.IDLE
      });
    });
  });

  describe(loadSuccessAction.type, () => {
    it('sets loading state to success', () => {
      const action = loadSuccessAction();
      const state: TestState = testReducer(initialTestState, action);

      expect(state).toStrictEqual({ ...initialTestState, loadingState: RequestState.SUCCESS });
    });
  });

  describe(loadFailureAction.type, () => {
    it('sets loading state to failure', () => {
      const action = loadFailureAction();
      const state: TestState = testReducer(initialTestState, action);

      expect(state).toStrictEqual({ ...initialTestState, loadingState: RequestState.FAILURE });
    });
  });

  describe(saveAction.type, () => {
    it('sets request state to in progress and clean up the previous errors', () => {
      const action = saveAction();
      const state: TestState = testReducer(initialTestState, action);

      expect(state).toStrictEqual({
        ...initialTestState,
        requestState: RequestState.IN_PROGRESS
      });
    });
  });

  describe(saveSuccessAction.type, () => {
    it('sets request state to success', () => {
      const action = saveSuccessAction();
      const state: TestState = testReducer(initialTestState, action);

      expect(state).toStrictEqual({ ...initialTestState, requestState: RequestState.SUCCESS });
    });
  });

  describe(saveFailureAction.type, () => {
    const errors: string[] = ['test message'];

    it('sets request state to failure', () => {
      const action = saveFailureAction({
        errors
      });
      const state: TestState = testReducer(initialTestState, action);

      expect(state).toStrictEqual({
        ...initialTestState,
        errors,
        requestState: RequestState.FAILURE
      });
    });
  });
});

describe('getLastPageNumber', () => {
  it('returns previous page if the current page is empty', () => {
    const previousPage = 1;

    const lastPage = getLastPageNumber([], { pageSize: 5, page: previousPage + 1 });

    expect(lastPage).toEqual(previousPage);
  });

  it('returns current page if the current page length is smaller than page size', () => {
    const currentPage = 2;

    const lastPage = getLastPageNumber([{ id: 'testId' }], { pageSize: 5, page: currentPage });

    expect(lastPage).toEqual(currentPage);
  });

  it('returns undefined if the current page length is equal than page size', () => {
    const summaries = [{ id: 'testId1' }, { id: 'testId2' }, { id: 'testId3' }, { id: 'testId4' }, { id: 'testId5' }];

    const lastPage = getLastPageNumber(summaries, { pageSize: summaries.length, page: 2 });

    expect(lastPage).toEqual(undefined);
  });
});
