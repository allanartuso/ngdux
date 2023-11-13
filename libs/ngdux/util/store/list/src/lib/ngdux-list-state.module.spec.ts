const mockEffect = jest.fn();
jest.mock('./+state/effects', () => ({
  ListEffects: jest.fn().mockImplementation(() => {
    return mockEffect;
  })
}));

import { TestBed } from '@angular/core/testing';
import { ListNotificationService, ListService } from '@ngdux/data-model-common';
import { commonFixture } from '@ngdux/data-model-common/test';
import { RegisterEffectsService } from '@ngdux/store-common';
import { TestResource } from '@ngdux/store-common/test';
import { Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { Observable, of } from 'rxjs';
import { ListEffects } from './+state/effects';
import { ListStateService } from './+state/state.service';
import { LIST_FEATURE_KEYS, LIST_NOTIFICATION_SERVICES, LIST_SERVICES } from './models/list.model';
import { NgduxListStateModule } from './ngdux-list-state.module';

describe('NgduxListStateModule', () => {
  let module: NgduxListStateModule<TestResource>;
  let actions: Observable<Action>;
  let store: Store;
  let featureKey: string;
  let listServiceMock: ListService<TestResource>;
  let notificationServiceMock: Partial<ListNotificationService<string[]>>;
  let registerEffectsServiceMock: Partial<RegisterEffectsService>;
  let listStateServiceMock: Partial<ListStateService<TestResource, string[]>>;

  beforeEach(() => {
    featureKey = commonFixture.getAlpha(10);
    listServiceMock = {
      loadResources: jest.fn()
    };
    notificationServiceMock = {
      onListErrors: jest.fn()
    };
    registerEffectsServiceMock = {
      registerEffects: jest.fn()
    };
    listStateServiceMock = {
      getFeatureActions: jest.fn().mockReturnValue({}),
      getFeatureSelectors: jest.fn().mockReturnValue({})
    };
    actions = of({ source: of() } as unknown as Action);

    TestBed.configureTestingModule({
      imports: [NgduxListStateModule],
      providers: [
        provideMockStore(),
        { provide: RegisterEffectsService, useValue: registerEffectsServiceMock },
        { provide: Actions, useValue: actions },
        { provide: ListStateService, useValue: listStateServiceMock },
        { provide: LIST_FEATURE_KEYS, useValue: [featureKey] },
        { provide: LIST_SERVICES, useValue: [listServiceMock] },
        { provide: LIST_NOTIFICATION_SERVICES, useValue: [notificationServiceMock] }
      ]
    });

    module = TestBed.inject(NgduxListStateModule);
    store = TestBed.inject(Store);
  });

  it('should create', () => {
    expect(module).toBeTruthy();
  });

  it('should register effects', () => {
    expect(ListEffects).toHaveBeenCalledWith(
      actions,
      store,
      listStateServiceMock,
      featureKey,
      listServiceMock,
      notificationServiceMock
    );
    expect(registerEffectsServiceMock.registerEffects).toHaveBeenCalledWith([mockEffect]);
  });
});
