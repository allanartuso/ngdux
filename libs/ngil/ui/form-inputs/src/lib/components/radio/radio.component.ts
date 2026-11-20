import { ChangeDetectorRef, Component, forwardRef, Input, inject } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'ngil-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss'],
  imports: [FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgilRadioComponent),
      multi: true,
    },
  ],
})
export class NgilRadioComponent implements ControlValueAccessor {
  @Input() formControlName = '';
  @Input() label = '';
  @Input() items: string[] = [];

  value = '';

  private readonly cdr = inject(ChangeDetectorRef);
  private onChangeCallback?: (value: string) => void;

  private onTouchedCallback?: () => void;
  disabled = false;

  onBlur(): void {
    this.onTouchedCallback?.();
  }

  onFocus(): void {
    this.onTouchedCallback?.();
  }

  writeValue(value: string): void {
    this.value = value;
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedCallback = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
    this.cdr.markForCheck();
  }

  updateModel() {
    this.onChangeCallback?.(this.value);
  }
}
