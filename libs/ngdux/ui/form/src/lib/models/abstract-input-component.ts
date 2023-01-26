import { Directive, Input, OnInit } from '@angular/core';
import { AbstractControl, ControlContainer, ControlValueAccessor, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';

@Directive()
export abstract class AbstractInputComponent implements OnInit, ControlValueAccessor {
  @Input() formControlName: string;
  @Input() errorMessage: string;
  @Input() label: string;
  @Input() readonly: boolean;
  @Input() required: boolean;

  protected control: FormControl;
  protected onChange: (value: string) => void;
  protected onTouched: () => void;
  protected readonly destroy$ = new Subject<void>();

  constructor(private readonly controlContainer: ControlContainer) {}

  ngOnInit(): void {
    this.control = this.controlContainer.control.get(this.formControlName) as FormControl;
    this.setRequiredState();
  }

  private setRequiredState(): void {
    if (!this.control || !this.control.validator) {
      return;
    }

    const validators = this.control.validator({ value: '' } as AbstractControl);
    if (validators && Object.keys(validators).includes('required')) {
      this.required = true;
    }
  }

  onBlur(): void {
    this.onTouched();
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  abstract writeValue(value: unknown): void;
}
