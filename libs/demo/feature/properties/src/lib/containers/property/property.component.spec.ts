import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UserReducerManager } from '@demo/demo/data-access/users';
import { UserDto } from '@demo/demo/data-model/users';
import { createPersistentUser, createTransientUser } from '@demo/demo/data-model/users/test';
import { RequestState } from '@ngdux/data-model-common';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { UserComponent } from './property.component';

describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;
  let store: MockStore;
  let user: UserDto;
  let mockReducerManager: Partial<UserReducerManager>;

  beforeEach(waitForAsync(() => {
    user = createPersistentUser();
    mockReducerManager = {
      actions: {
        create: jest.fn().mockReturnValue({ type: 'create' }),
        save: jest.fn().mockReturnValue({ type: 'save' })
      },
      selectors: {
        getResource: 'getRequestState',
        getRequestState: 'getRequestState'
      }
    } as any;

    TestBed.configureTestingModule({
      declarations: [UserComponent],
      providers: [
        provideMockStore({
          selectors: [
            { selector: mockReducerManager.selectors.getResource, value: user },
            { selector: mockReducerManager.selectors.getRequestState, value: RequestState.IDLE }
          ]
        }),
        { provide: UserReducerManager, useValue: mockReducerManager }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    jest.spyOn(store, 'dispatch');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('creates a user', () => {
    component.onUserSaved(user);

    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith(mockReducerManager.actions.save({ resource: user }));
  });

  it('saves the user', () => {
    const newUser = createTransientUser();

    component.onUserSaved(newUser);

    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith(mockReducerManager.actions.create({ resource: newUser }));
  });
});
