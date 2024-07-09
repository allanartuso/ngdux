import { Directive, Input, OnDestroy, OnInit, Optional } from '@angular/core';
import { AbstractControl, ControlContainer, ControlValueAccessor, FormArray } from '@angular/forms';
import { BehaviorSubject, Subject, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NgilErrorMessagesService } from '../error-messages.service';

@Directive()
export abstract class AbstractInputComponent<T = string> implements OnInit, ControlValueAccessor, OnDestroy {
  @Input() formControlName = '';
  @Input() set errorMessage(errorMessage: string) {
    this.errorMessage$.next(errorMessage);
  }
  @Input() label = '';
  @Input() readonly = false;
  @Input() required = false;
  @Input() disabled = false;

  protected parentControl?: AbstractControl | null;
  protected onChange?: (value: T | null) => void;
  protected onTouched?: () => void;
  protected readonly destroy$ = new Subject<void>();
  protected readonly errorMessage$ = new BehaviorSubject<string>('');

  model$ = combineLatest({
    errorMessage: this.errorMessage$
  });

  constructor(
    private readonly errorMessagesService: NgilErrorMessagesService,
    @Optional() private readonly controlContainer?: ControlContainer
  ) {}

  ngOnInit(): void {
    if (this.controlContainer?.control instanceof FormArray) {
      this.parentControl = this.controlContainer?.control.at(+this.formControlName);
    } else {
      this.parentControl = this.controlContainer?.control?.get(this.formControlName);
    }
    this.setRequiredState();
    this.listenStatusChanges();
    this.listenErrorMessagesChanges();
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

  registerOnChange(fn: (value: T | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  abstract writeValue(value: T): void;

  protected listenStatusChanges(): void {
    this.parentControl?.statusChanges.pipe(takeUntil(this.destroy$)).subscribe(() => this.setErrors());
  }

  protected listenErrorMessagesChanges() {
    this.errorMessagesService.errorMessagesChanged$.pipe(takeUntil(this.destroy$)).subscribe(() => this.setErrors());
  }

  protected setErrors(): void {
    if (this.parentControl?.errors) {
      const errorKey = Object.keys(this.parentControl?.errors)[0];
      const errorObj = this.parentControl?.errors[`${errorKey}`];
      this.errorMessage$.next(
        this.errorMessagesService.getErrorMessage(errorKey, {
          fieldName: this.label,
          ...errorObj
        })
      );
    } else {
      this.errorMessage$.next('');
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
