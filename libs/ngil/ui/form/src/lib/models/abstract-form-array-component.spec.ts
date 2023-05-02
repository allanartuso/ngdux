import { Component } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AbstractFormArrayComponent } from './abstract-form-array-component';
import { FlatFormControlsOf } from './form.model';

interface TestFormModel {
  firstName: string;
  lastName: string;
}

@Component({
  template: `
    <form [formGroup]="formGroup">
      <div formArrayName="formArray">
        <div formGroupName="0">
          <input formControlName="firstName" label="First Name" />
          <input formControlName="lastName" label="Last Name" />
        </div>
      </div>
    </form>
  `
})
class MockFormArrayComponent extends AbstractFormArrayComponent<FormGroup<FlatFormControlsOf<TestFormModel>>> {
  protected createFormArray(): FormArray<FormGroup<FlatFormControlsOf<TestFormModel>>> {
    return new FormArray<FormGroup<FlatFormControlsOf<TestFormModel>>>([]);
  }

  protected createFormArrayItem(model?: TestFormModel) {
    return new FormGroup<FlatFormControlsOf<TestFormModel>>({
      firstName: new FormControl(model?.firstName || null, [Validators.required]),
      lastName: new FormControl(model?.firstName || null)
    });
  }
}

describe('AbstractFormArrayComponent', () => {
  let component: MockFormArrayComponent;
  let fixture: ComponentFixture<MockFormArrayComponent>;
  let testFormValues: TestFormModel[];
  const onChangeMock = jest.fn();
  const onTouchedMock = jest.fn();

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [MockFormArrayComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MockFormArrayComponent);
    component = fixture.componentInstance;

    testFormValues = [
      { firstName: 'testFirstName1', lastName: 'testLastName1' },
      { firstName: 'testFirstName2', lastName: 'testLastName2' }
    ];
    component.registerOnChange(onChangeMock);
    component.registerOnTouched(onTouchedMock);
    component.writeValue(testFormValues);
    component.ngAfterViewInit();

    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    it('creates the form', () => {
      expect(component.formGroup).toBeDefined();
      expect(component.formArray.value).toStrictEqual(testFormValues);
    });
  });

  describe('write value', () => {
    it('adds form controls to the form array when writing value', () => {
      const newFormValues = [...testFormValues, { firstName: 'testFirstName3', lastName: 'testLastName3' }];
      component.writeValue(newFormValues);

      expect(component.formArray.value).toStrictEqual(newFormValues);
    });

    it('removes form controls from the form array when if necessary', () => {
      const newFormValues = [testFormValues[0]];

      component.writeValue(newFormValues);

      expect(component.formArray.value).toStrictEqual(newFormValues);
    });

    it('removes all form controls from the form array when writing null', () => {
      component.writeValue(null);

      expect(component.formArray.value).toStrictEqual([]);
    });
  });

  describe('set disable', () => {
    it('disables the control', () => {
      component.setDisabledState(true);

      expect(component.formArray.disabled).toBe(true);
    });

    it('enables the control', () => {
      component.setDisabledState(false);

      expect(component.formArray.enabled).toBe(true);
    });
  });

  describe('validates', () => {
    it('set CVA as invalid if the formArray is invalid', () => {
      component.formArray.at(0).controls.firstName.setValue('');

      expect(component.formArray.at(0).controls.firstName.errors).toStrictEqual({ required: true });
      expect(component.validate()).toStrictEqual({
        invalidFormArray: true
      });
    });

    it('set CVA as valid if the formArray is valid', () => {
      expect(component.validate()).toStrictEqual(null);
    });
  });
});
