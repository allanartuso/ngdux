import { AsyncPipe } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { AbstractInputComponent } from '@ngil/form-cva';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'ngil-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  imports: [AsyncPipe, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgilInputComponent),
      multi: true,
    },
  ],
})
export class NgilInputComponent extends AbstractInputComponent<string | number> implements AfterViewInit {
  @Input() type = 'text';
  @Output() changed = new EventEmitter<string | number>();

  control = new FormControl();

  ngAfterViewInit() {
    this.control.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => {
      this.onChangeInput(value);
    });
  }

  override setDisabledState(isDisabled: boolean): void {
    super.setDisabledState(isDisabled);
    if (isDisabled) {
      this.control.disable({ emitEvent: false });
    } else {
      this.control.enable({ emitEvent: false });
    }
  }

  writeValue(value: string | number): void {
    this.control.setValue(value, { emitEvent: false });
    this.cdr.markForCheck();
  }

  onChangeInput(value: string | number): void {
    if (this.type === 'number') {
      value = +value;
    }
    this.changed.emit(value);
    if (this.onChange) {
      this.onChange(value);
    }
  }
}
