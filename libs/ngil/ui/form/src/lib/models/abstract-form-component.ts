import { AfterViewInit, Directive, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Directive()
export abstract class AbstractFormComponent<T> implements ControlValueAccessor, OnDestroy, AfterViewInit, OnInit {
  @Input() formControlName: string;
  @Input() formViewModel: T;

  @Output() submitted: EventEmitter<T> = new EventEmitter();

  abstract form: FormGroup;

  protected readonly destroy$ = new Subject<void>();
  protected onChange: (value: T) => void;
  protected onTouched: () => void;

  get isSubmitDisabled(): boolean {
    return !this.form?.valid || this.form?.pristine;
  }

  protected getFormDefaultValue(model?: T): T {
    return model;
  }

  ngOnInit(): void {
    this.form.patchValue(this.formViewModel, { emitEvent: false });
  }

  ngAfterViewInit(): void {
    this.listenValueChanges();
  }

  protected listenValueChanges(): void {
    this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      if (this.onChange) {
        this.onChange(this.form.getRawValue());
      }
    });
  }

  submit(): void {
    console.log(' submit', this.form);
    if (this.form.valid && this.form.dirty) {
      this.submitted.emit({
        ...this.formViewModel,
        ...this.form.value
      });
    }
  }

  cancel(): void {
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.writeValue(this.formViewModel);
  }

  registerOnChange(fn: (value: T) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.form.disable({ emitEvent: false }) : this.form.enable({ emitEvent: false });
  }

  writeValue(model: T): void {
    const formValue = this.getFormDefaultValue(model);

    if (model) {
      this.form.patchValue(formValue, { emitEvent: false });
    } else {
      this.form.reset(formValue || undefined, { emitEvent: false });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
