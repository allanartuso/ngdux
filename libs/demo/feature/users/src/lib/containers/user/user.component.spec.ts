import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UserFacade } from '@demo/demo/data-access/users';
import { UserDto } from '@demo/demo/data-model/users';
import { createPersistentUser, createTransientUser } from '@demo/demo/data-model/users/test';
import { RequestState } from '@ngdux/data-model-common';
import { commonFixture } from '@ngdux/data-model-common/test';
import { of } from 'rxjs';
import { UserComponent } from './user.component';

describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;
  let user: UserDto;
  let facade: Partial<commonFixture.RemoveReadonly<UserFacade>>;

  beforeEach(waitForAsync(() => {
    user = createPersistentUser();
    facade = {
      resource$: of(user),
      requestState$: of(RequestState.IDLE),
      save: jest.fn(),
      create: jest.fn()
    };

    TestBed.configureTestingModule({
      declarations: [UserComponent],
      providers: [{ provide: UserFacade, useValue: facade }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('creates a user', () => {
    component.onSaved(user);

    expect(facade.save).toHaveBeenCalledTimes(1);
    expect(facade.save).toHaveBeenCalledWith({ resource: user });
  });

  it('saves the user', () => {
    const newUser = createTransientUser();

    component.onSaved(newUser);

    expect(facade.create).toHaveBeenCalledTimes(1);
    expect(facade.create).toHaveBeenCalledWith({ resource: newUser });
  });
});
