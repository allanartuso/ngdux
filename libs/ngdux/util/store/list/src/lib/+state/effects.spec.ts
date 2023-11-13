import { ListNotificationService, ListService } from '@ngdux/data-model-common';
import { commonFixture } from '@ngdux/data-model-common/test';
import { TestResource, createTestResources } from '@ngdux/store-common/test';
import { Action, MemoizedSelector, Store } from '@ngrx/store';
import { ActionCreator, TypedAction } from '@ngrx/store/src/models';
import { getMockStore } from '@ngrx/store/testing';
import { Observable, of } from 'rxjs';
import { ListActions, ListSelectors } from '../models/list.model';
import { AbstractListEffects } from '../state-generator/abstract-list-effects';
import { ListEffects } from './effects';
import { ListStateService } from './state.service';

jest.mock('../state-generator/abstract-list-effects', () => ({
  AbstractListEffects: jest.fn()
}));

describe('ListEffects', () => {
  let listEffects: ListEffects<TestResource, string[]>;
  let actions$: Observable<Action>;
  let storeMock: Store;
  let featureKeyMock: string;
  let listStateServiceMock: ListStateService<TestResource, string[]>;
  let listServiceMock: Partial<ListService<TestResource>>;
  let notificationServiceMock: Partial<ListNotificationService<string[]>>;
  let testListActions: Partial<ListActions<TestResource, string[]>>;
  let testListSelectors: Partial<ListSelectors<TestResource, string[]>>;

  beforeEach(() => {
    featureKeyMock = commonFixture.getAlpha(10);
    testListActions = { loadPage: (() => ({ type: '' })) as ActionCreator<string, () => TypedAction<string>> };
    testListSelectors = { getAll: of(createTestResources()) as unknown as MemoizedSelector<object, TestResource[]> };

    actions$ = of({ type: 'actions' });
    storeMock = getMockStore();
    listStateServiceMock = {
      getFeatureActions: jest.fn().mockReturnValue(testListActions),
      getFeatureSelectors: jest.fn().mockReturnValue(testListSelectors)
    } as unknown as ListStateService<TestResource, string[]>;
    listServiceMock = {
      loadResources: jest.fn()
    };
    notificationServiceMock = {
      onListErrors: jest.fn()
    };

    listEffects = new ListEffects<TestResource, string[]>(
      actions$,
      storeMock,
      listStateServiceMock as ListStateService<TestResource, string[]>,
      featureKeyMock,
      listServiceMock as ListService<TestResource>,
      notificationServiceMock as ListNotificationService<string[]>
    );
  });

  it('should extend abstract form effects', () => {
    expect(ListEffects.prototype).toBeInstanceOf(AbstractListEffects);
  });

  it('should call super with correct params', () => {
    expect(listStateServiceMock.getFeatureActions).toHaveBeenCalledWith(featureKeyMock);
    expect(listStateServiceMock.getFeatureSelectors).toHaveBeenCalledWith(featureKeyMock);
    expect(AbstractListEffects).toHaveBeenCalledWith(
      actions$,
      storeMock,
      listServiceMock,
      testListActions,
      testListSelectors,
      notificationServiceMock
    );
  });
});
