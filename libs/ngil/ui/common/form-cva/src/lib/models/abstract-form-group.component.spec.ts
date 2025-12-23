import { Component, forwardRef } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {
  FormControl,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { AbstractFormGroupComponent } from './abstract-form-group.component';
import { FlatFormControlsOf } from './form.model';

interface TestFormValue {
  firstName: string;
  lastName: string;
}

@Component({
  template: '',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MockFormGroupComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => MockFormGroupComponent),
      multi: true
    }
  ]
})
export class MockFormGroupComponent extends AbstractFormGroupComponent<TestFormValue> {
  formGroup = new FormGroup<FlatFormControlsOf<TestFormValue>>({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl()
  });
}

describe('AbstractFormGroupComponent', () => {
  let component: MockFormGroupComponent;
  let fixture: ComponentFixture<MockFormGroupComponent>;
  let testFormValue: TestFormValue;
  const onChangeMock = jest.fn();
  const onTouchedMock = jest.fn();

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [MockFormGroupComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MockFormGroupComponent);
    component = fixture.componentInstance;

    testFormValue = { firstName: 'testFirstName1', lastName: 'testLastName1' };
    component.registerOnChange(onChangeMock);
    component.registerOnTouched(onTouchedMock);
    component.writeValue(testFormValue);
    component.ngAfterViewInit();

    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    it('creates the form', () => {
      expect(component.formGroup).toBeDefined();
      expect(component.formGroup.value).toStrictEqual(testFormValue);
    });
  });

  describe('write value', () => {
    it('set all form controls to null when writing null', () => {
      component.writeValue(null);

      expect(component.formGroup.value).toStrictEqual({ firstName: null, lastName: null });
    });
  });

  describe('set disable', () => {
    it('disables the control', () => {
      component.setDisabledState(true);

      expect(component.formGroup.disabled).toBe(true);
    });

    it('enables the control', () => {
      component.setDisabledState(false);

      expect(component.formGroup.enabled).toBe(true);
    });
  });

  describe('validates', () => {
    it('set CVA as invalid if the formGroup is invalid', () => {
      component.formGroup.controls.firstName.setValue('');

      expect(component.formGroup.controls.firstName.errors).toStrictEqual({ required: true });
      expect(component.validate()).toStrictEqual({
        invalidFormGroup: true
      });
    });

    it('set CVA as valid if the formGroup is valid', () => {
      expect(component.validate()).toStrictEqual(null);
    });
  });
});
