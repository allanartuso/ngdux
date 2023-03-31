import { Component } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FieldError, FieldErrorCode } from '@arviem/shared/acm/data-access/common';
import { RequestState } from '@arviem/shared/data-access';
import { cold } from '@nrwl/angular/testing';
import { BehaviorSubject } from 'rxjs';
import { AbstractFormArrayComponent } from './abstract-form-array-component';
import { ArviemFormControl } from './form.model';

interface TestFormModel {
  name: string;
}

@Component({
  template: `
    <form [formGroup]="form">
      <div formArrayName="formArray">
        <div formGroupName="0">
          <input formControlName="name" label="Name" />
        </div>
      </div>
    </form>
  `
})
class MockFormArrayComponent extends AbstractFormArrayComponent<TestFormModel> {
  requestState$ = new BehaviorSubject<RequestState>(RequestState.IDLE);

  constructor(private readonly fb: FormBuilder) {
    super();
  }

  protected createFormArray(models: TestFormModel[]): FormArray {
    return this.fb.array((models || []).map(model => this.createInternalFormGroup(model)));
  }

  protected createInternalFormGroup(model?: TestFormModel): FormGroup {
    return this.fb.group({
      name: [model.name]
    });
  }
}

describe('AbstractFormArrayComponent', () => {
  let component: MockFormArrayComponent;
  let fixture: ComponentFixture<MockFormArrayComponent>;
  let testFormValues: TestFormModel[];
  const onChangeMock = jest.fn();
  const onTouchedMock = jest.fn();

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [ReactiveFormsModule],
        declarations: [MockFormArrayComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(MockFormArrayComponent);
    component = fixture.componentInstance;

    testFormValues = [{ name: 'testName1' }, { name: 'testName2' }];
    component.formArrayViewModel = { formArray: testFormValues };
    component.registerOnChange(onChangeMock);
    component.registerOnTouched(onTouchedMock);
    component.ngAfterViewInit();

    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    it('creates the form', () => {
      expect(component.form).toBeDefined();
      expect(component.formArray.value).toStrictEqual(testFormValues);
    });
  });

  describe('write value', () => {
    it('adds form controls to the form array when writing value', () => {
      const newFormValues = [...testFormValues, { name: 'testName3' }];
      component.writeValue(newFormValues);

      expect(component.formArray.value).toStrictEqual(newFormValues);
    });

    it('removes form controls from the form array when if necessary', () => {
      const newFormValues = [testFormValues[0]];
      component.writeValue(testFormValues);

      component.writeValue(newFormValues);

      expect(component.formArray.value).toStrictEqual(newFormValues);
    });
  });

  describe('submit', () => {
    it('emit form submitted event when submitting a valid form.', () => {
      jest.spyOn(component.submitted, 'emit');
      const formValues = [{ name: 'newTestName' }];
      component.writeValue(formValues);
      (component.formArray.at(0) as FormGroup).markAsDirty();

      component.submit();

      expect(component.submitted.emit).toHaveBeenCalledWith(formValues);
    });
  });

  describe('cancel', () => {
    it('path the received form model values to the form when cancel the current changes', () => {
      component.writeValue(testFormValues);
      component.formArray.at(0).get('name').setValue('newTestValue');
      expect(component.formArray.value[0].name).not.toBe(testFormValues[0].name);

      component.cancel();

      expect(component.formArray.value).toStrictEqual(testFormValues);
      expect(component.formArray.pristine).toBe(true);
      expect(component.formArray.untouched).toBe(true);
      expect(component.form.pristine).toBe(true);
      expect(component.form.untouched).toBe(true);
    });
  });

  describe('setFormRequestState', () => {
    it('updates form values when receiving success', () => {
      const newFormValues = [{ name: 'newTestName' }];
      component.formArrayViewModel = { formArray: newFormValues };

      component.setFormRequestState = RequestState.SUCCESS;

      expect(component.formArray.value).toStrictEqual(newFormValues);
    });

    it('emits new value to the request state observable', () => {
      const requestState = RequestState.SUCCESS;
      component.setFormRequestState = requestState;
      const expected = cold('a', { a: requestState });

      expect(component.requestState$).toBeObservable(expected);
    });
  });

  describe('server errors', () => {
    const fieldIndex = 0;
    const fieldName = 'name';
    const invalidValue = 'ws0s9661';
    const errorCode = FieldErrorCode.PROPERTY_VALUE_NOT_UNIQUE;
    const fieldError = getFieldError(fieldIndex, fieldName, invalidValue, errorCode);
    const expected = fieldError.fieldErrors[fieldName];

    function getFieldError(index: number, name: string, value: string, code: FieldErrorCode): FieldError {
      return {
        fieldIndex: index,
        errors: {},
        fieldErrors: {
          [name]: [
            {
              fieldName: name,
              errors: {
                [code]: true
              }
            }
          ]
        }
      };
    }

    beforeEach(() => {
      testFormValues[fieldIndex].name = invalidValue;
      component.writeValue(testFormValues);

      component.formArray.controls.forEach((formGroup: FormGroup) => {
        Object.values(formGroup.controls).forEach((formControl: ArviemFormControl) => {
          formControl.applyServerErrors = jest.fn();
        });
      });

      component.serverFieldArrayErrors = [fieldError];
    });

    it('applies the server errors', () => {
      const control = component.formArray.at(fieldIndex).get(fieldName) as ArviemFormControl;

      expect(control.applyServerErrors).toHaveBeenCalledWith(expected);
    });
  });
});
