import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UserDto } from '@demo/demo/data-model/users';
import { createPersistentUser } from '@demo/demo/data-model/users/test';
import { NgilInputComponent, NgilSelectComponent } from '@ngil/form-inputs';
import { UserFormComponent } from './user-form.component';

describe('UserFormComponent', () => {
  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;
  let testUser: UserDto;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [UserFormComponent, NgilInputComponent, NgilSelectComponent],
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

    const expectedFormValue = {
      email: testUser.email,
      firstName: testUser.firstName,
      lastName: testUser.lastName,
      birthTime: testUser.birthTime,
      cars: testUser.cars,
      gender: testUser.gender ?? null,
    };

    expect(component.form).toBeTruthy();
    expect(component.form.value).toStrictEqual(expectedFormValue);
  });

  it('creates an empty form when the form model is undefined', () => {
    fixture.detectChanges();
    const expectedFormValue = { email: '', firstName: '', lastName: '', birthTime: '', cars: [], gender: null };

    expect(component.form).toBeTruthy();
    expect(component.form.value).toStrictEqual(expectedFormValue);
  });
});
