import { Directive, Input, OnDestroy, OnInit, Optional } from '@angular/core';
import { AbstractControl, ControlContainer, ControlValueAccessor, FormArray } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { getErrorMessage } from '../error-messages';

@Directive()
export abstract class AbstractInputComponent<T = string> implements OnInit, ControlValueAccessor, OnDestroy {
  @Input() formControlName = '';
  @Input() errorMessage = '';
  @Input() label = '';
  @Input() readonly = false;
  @Input() required = false;

  protected parentControl?: AbstractControl | null;
  protected onChange?: (value: T) => void;
  protected onTouched?: () => void;
  protected readonly destroy$ = new Subject<void>();

  constructor(@Optional() private readonly controlContainer?: ControlContainer) {}

  ngOnInit(): void {
    if (this.controlContainer?.control instanceof FormArray) {
      this.parentControl = this.controlContainer?.control.at(+this.formControlName);
    } else {
      this.parentControl = this.controlContainer?.control?.get(this.formControlName);
    }
    this.setRequiredState();
    this.listenStatusChanges();
  }

  private setRequiredState(): void {
    if (!this.parentControl || !this.parentControl?.validator) {
      return;
    }

    const validators = this.parentControl?.validator({ value: '' } as AbstractControl);
    if (validators && Object.keys(validators).includes('required')) {
      this.required = true;
    }
  }

  onBlur(): void {
    if (this.onTouched) {
      this.onTouched();
    }
    this.setErrors();
  }

  registerOnChange(fn: (value: T) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  abstract writeValue(value: T): void;

  private listenStatusChanges(): void {
    this.parentControl?.statusChanges.pipe(takeUntil(this.destroy$)).subscribe(() => this.setErrors());
  }

  private setErrors(): void {
    if (this.parentControl?.errors) {
      const errorKey = Object.keys(this.parentControl?.errors)[0];
      const errorObj = this.parentControl?.errors[`${errorKey}`];
      this.errorMessage = getErrorMessage(errorKey, {
        fieldName: this.label,
        ...errorObj
      });
    } else {
      this.errorMessage = '';
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
