/**
 * This class implements ControlValueAccessor logic for a FormGroup.
 * NG_VALUE_ACCESSOR and NG_VALIDATORS must be provided in the component.
 *
 * The FormGroup changes will be automatically change the parent FormControl value.
 *
 * Example:

 */

import { AfterViewInit, ChangeDetectorRef, Directive, OnDestroy, inject } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormGroup, ValidationErrors, Validator } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { FlatFormControlsOf, FormValueOf } from './form.model';

@Directive()
export abstract class AbstractFormGroupComponent<
  T extends object,
  F extends { [K in keyof T]: AbstractControl } = FlatFormControlsOf<T>,
>
  implements ControlValueAccessor, Validator, OnDestroy, AfterViewInit
{
  abstract formGroup: FormGroup<F>;

  private readonly cdr = inject(ChangeDetectorRef);

  protected readonly destroy$ = new Subject<void>();
  protected onChange?: (value: FormValueOf<FormGroup<F>>) => void;
  protected onTouched?: () => void;

  ngAfterViewInit(): void {
    this.listenValueChanges();
  }

  protected listenValueChanges(): void {
    this.formGroup.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      if (this.onChange) {
        this.onChange(this.formGroup.getRawValue());
      }
    });
  }

  registerOnChange(fn: (value: FormValueOf<FormGroup<F>>) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  writeValue(formValue: T | undefined | null): void {
    if (formValue) {
      this.formGroup.patchValue(formValue, { emitEvent: false });
    } else {
      this.formGroup.reset(undefined, { emitEvent: false });
    }
    this.cdr.markForCheck();
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.formGroup.disable({ emitEvent: false });
    } else {
      this.formGroup.enable({ emitEvent: false });
    }
    this.cdr.markForCheck();
  }

  validate(): ValidationErrors | null {
    if (this.formGroup.invalid) {
      return { invalidFormGroup: true };
    }

    return null;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
