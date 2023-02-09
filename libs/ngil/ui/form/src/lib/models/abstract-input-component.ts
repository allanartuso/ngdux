import { Directive, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, ControlContainer, ControlValueAccessor, FormArray, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { getErrorMessage } from '../error-messages';

@Directive()
export abstract class AbstractInputComponent implements OnInit, ControlValueAccessor, OnDestroy {
  @Input() formControlName: string;
  @Input() errorMessage: string;
  @Input() label: string;
  @Input() readonly: boolean;
  @Input() required: boolean;

  protected parentControl: FormControl;
  protected onChange: (value: string) => void;
  protected onTouched: () => void;
  protected readonly destroy$ = new Subject<void>();

  constructor(private readonly controlContainer: ControlContainer) {}

  ngOnInit(): void {
    if (this.controlContainer.control instanceof FormArray) {
      this.parentControl = this.controlContainer.control.at(+this.formControlName) as FormControl;
    } else {
      this.parentControl = this.controlContainer.control.get(this.formControlName) as FormControl;
    }
    this.setRequiredState();
    this.listenStatusChanges();
  }

  private setRequiredState(): void {
    if (!this.parentControl || !this.parentControl.validator) {
      return;
    }

    const validators = this.parentControl.validator({ value: '' } as AbstractControl);
    if (validators && Object.keys(validators).includes('required')) {
      this.required = true;
    }
  }

  onBlur(): void {
    this.onTouched();
    this.setErrors();
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  abstract writeValue(value: unknown): void;

  private listenStatusChanges(): void {
    this.parentControl.statusChanges.pipe(takeUntil(this.destroy$)).subscribe(() => this.setErrors());
  }

  private setErrors(): void {
    if (this.parentControl.errors) {
      const errorKey = Object.keys(this.parentControl.errors)[0];
      const errorObj = this.parentControl.errors[`${errorKey}`];
      console.log(this.parentControl.errors);
      this.errorMessage = getErrorMessage(errorKey, {
        fieldName: this.label,
        ...errorObj
      });
    } else {
      this.errorMessage = undefined;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
