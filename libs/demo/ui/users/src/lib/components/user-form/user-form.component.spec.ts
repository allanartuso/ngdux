import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CreateUserDto, UserDto } from '@demo/demo/data-model/users';
import { createPersistentUser } from '@demo/demo/data-model/users/test';
import { NgilInputComponent } from '@ngil/form-inputs';
import { UserFormComponent } from './user-form.component';

describe('UserFormComponent', () => {
  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;
  let testUser: UserDto;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, NoopAnimationsModule],
      declarations: [UserFormComponent, NgilInputComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    testUser = createPersistentUser();

    fixture = TestBed.createComponent(UserFormComponent);
    component = fixture.componentInstance;
  });

  it('creates the form', () => {
    component.formViewModel = testUser;
    fixture.detectChanges();
    const expectedFormValue: CreateUserDto = {
      email: testUser.email,
      firstName: testUser.firstName,
      lastName: testUser.lastName,
      birthTime: testUser.birthTime
    };

    expect(component.form).toBeTruthy();
    expect(component.form.value).toStrictEqual(expectedFormValue);
  });

  it('creates an empty form when the form model is undefined', () => {
    fixture.detectChanges();
    const expectedFormValue: CreateUserDto = { email: '', firstName: '', lastName: '', birthTime: '' };

    expect(component.form).toBeTruthy();
    expect(component.form.value).toStrictEqual(expectedFormValue);
  });
});
