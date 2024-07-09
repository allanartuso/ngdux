import { Component } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {
  ControlContainer,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NG_VALUE_ACCESSOR,
  Validators
} from '@angular/forms';
import { hot } from 'jest-marbles';
import { of } from 'rxjs';
import { NgilErrorMessagesService } from '../error-messages.service';
import { AbstractInputComponent } from './abstract-input-component';

@Component({
  selector: 'ngil-test-input',
  template: '',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: TestInputComponent,
      multi: true
    }
  ]
})
export class TestInputComponent extends AbstractInputComponent<string> {
  value = '';

  writeValue(value: string): void {
    this.value = value;
  }
}

describe('AbstractInputComponent', () => {
  let component: TestInputComponent;
  let fixture: ComponentFixture<TestInputComponent>;
  const onChangeMock = jest.fn();
  const onTouchedMock = jest.fn();
  let form: FormGroup<{ testControl: FormControl }>;
  const formDirective = new FormGroupDirective([], []);
  const mockErrorMessage = 'mockErrorMessage';

  beforeEach(waitForAsync(() => {
    const control = new FormControl('', { validators: [Validators.required] });
    form = new FormGroup({
      testControl: control
    });
    formDirective.form = form;

    TestBed.configureTestingModule({
      imports: [],
      declarations: [TestInputComponent],
      providers: [
        {
          provide: ControlContainer,
          useValue: formDirective
        },
        {
          provide: NgilErrorMessagesService,
          useValue: {
            getErrorMessage: jest.fn().mockReturnValue(mockErrorMessage),
            errorMessagesChanged$: of(undefined)
          }
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestInputComponent);
    component = fixture.componentInstance;
    component.formControlName = 'testControl';
    component.ngOnInit();
    component.registerOnChange(onChangeMock);
    component.registerOnTouched(onTouchedMock);

    fixture.detectChanges();
  });

  afterEach(() => {
    component.ngOnDestroy();
  });

  it('writes value to the control', () => {
    const newFormValues = 'newTestValue';

    component.writeValue(newFormValues);

    expect(component.value).toStrictEqual(newFormValues);
  });

  describe('set disable', () => {
    it('disables the control', () => {
      component.setDisabledState(true);

      expect(component.disabled).toBe(true);
    });

    it('enables the control', () => {
      component.setDisabledState(false);

      expect(component.disabled).toBe(false);
    });
  });

  describe('on blur', () => {
    it('marks the control as touched', () => {
      component.onBlur();

      expect(onTouchedMock).toHaveBeenCalled();
    });

    it('sets the control errors', () => {
      form.controls.testControl.setErrors({ min: true }, { emitEvent: false });

      component.onBlur();

      expect(component.model$).toBeObservable(hot('a', { a: { errorMessage: mockErrorMessage } }));
    });
  });

  it('set error messages', () => {
    const errorMessage = 'errorMessage';

    component.errorMessage = errorMessage;

    expect(component.model$).toBeObservable(hot('a', { a: { errorMessage: errorMessage } }));
  });

  it('listen to parent status changes to set errors', () => {
    form.controls.testControl.setErrors({ min: true });

    expect(component.model$).toBeObservable(hot('a', { a: { errorMessage: mockErrorMessage } }));
  });

  it('listen to parent status changes to unset errors', () => {
    form.controls.testControl.setErrors({ min: true });
    form.controls.testControl.setErrors(null);

    expect(component.model$).toBeObservable(hot('a', { a: { errorMessage: '' } }));
  });

  it('sets required state', () => {
    expect(component.required).toBe(true);
  });
});
