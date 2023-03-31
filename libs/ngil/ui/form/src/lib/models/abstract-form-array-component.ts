import { AfterViewInit, Directive, OnDestroy } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormArray,
  FormGroup,
  ValidationErrors,
  Validator
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { FormValueOf } from './form.model';

/**
 *
 */
@Directive()
export abstract class AbstractFormArrayComponent<F extends AbstractControl<any>>
  implements AfterViewInit, OnDestroy, ControlValueAccessor, Validator
{
  protected abstract createFormArray(): FormArray<F>;
  protected abstract createFormArrayItem(item?: FormValueOf<F>): F;

  protected readonly destroy$ = new Subject<void>();
  protected onChange: (value: FormValueOf<F>[]) => void;
  protected onTouched: () => void;

  formGroup = new FormGroup({
    formArray: this.createFormArray()
  });
  get formArray() {
    return this.formGroup.controls.formArray;
  }

  ngAfterViewInit(): void {
    this.listenValueChanges();
  }

  protected listenValueChanges(): void {
    this.formGroup.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      if (this.onChange) {
        this.onChange(this.formArray.getRawValue());
      }
    });
  }

  registerOnChange(fn: (value: FormValueOf<F>[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  writeValue(items: FormValueOf<F>[] | undefined | null): void {
    this.prepareControls(items);

    if (items) {
      this.formArray.patchValue(items, { emitEvent: false });
    } else {
      this.formArray.reset(undefined, { emitEvent: false });
    }
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.formGroup.disable({ emitEvent: false }) : this.formGroup.enable({ emitEvent: false });
  }

  validate(): ValidationErrors | null {
    if (this.formArray.invalid) {
      return { invalidFormArray: true };
    }

    return null;
  }

  protected prepareControls(items: FormValueOf<F>[] | undefined | null): void {
    items = items || [];

    if (this.formArray.value.length < items.length) {
      this.addExtraControls(items);
    }

    if (this.formArray.value.length > items.length) {
      this.removeExtraControls(items);
    }
  }

  private addExtraControls(items: FormValueOf<F>[]): void {
    items.forEach((item, index) => {
      const control = this.formArray.at(index);
      if (!control) {
        this.formArray.push(this.createFormArrayItem(item));
      }
    });
  }

  private removeExtraControls(items: FormValueOf<F>[]): void {
    let formArrayIndex = 0;
    this.formArray.value.forEach((item, index) => {
      if (!items[index]) {
        this.formArray.removeAt(formArrayIndex);
      } else {
        formArrayIndex++;
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
