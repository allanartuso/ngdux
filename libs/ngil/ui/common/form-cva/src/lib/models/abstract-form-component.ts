import { Directive, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';

@Directive()
export abstract class AbstractFormComponent<T> implements OnDestroy, OnInit {
  @Input() formViewModel?: T;

  @Output() submitted: EventEmitter<T> = new EventEmitter();

  abstract form: FormGroup;

  protected readonly destroy$ = new Subject<void>();

  get isSubmitDisabled(): boolean {
    return !this.form.valid || this.form.pristine;
  }

  get isCancelDisabled(): boolean {
    return !this.form.dirty;
  }

  protected getFormDefaultValue(model?: T): T | undefined {
    return model;
  }

  ngOnInit(): void {
    this.form.patchValue(this.getFormDefaultValue(this.formViewModel) || {}, { emitEvent: false });
  }

  submit(): void {
    if (!this.isSubmitDisabled) {
      this.submitted.emit({
        ...this.formViewModel,
        ...this.form.value
      });
    } else {
      Object.values(this.form.controls).forEach(control => control.updateValueAndValidity());
    }
  }

  cancel(): void {
    if (!this.isCancelDisabled) {
      this.form.reset(this.getFormDefaultValue(this.formViewModel), { emitEvent: false });
      this.form.markAsPristine();
      this.form.markAsUntouched();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
