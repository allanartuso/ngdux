import { Component, forwardRef, Input } from '@angular/core';
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
      multi: true
    }
  ]
})
export class NgilRadioComponent implements ControlValueAccessor {
  @Input() formControlName: string = '';
  @Input() label: string = '';
  @Input() items: string[] = [];

  value: string = '';

  private onChangeCallback = (_: any) => {};

  private onTouchedCallback = () => {};

  onBlur(): void {
    this.onTouchedCallback();
  }

  onFocus(): void {
    this.onTouchedCallback();
  }

  writeValue(value: string): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  updateModel() {
    this.onChangeCallback(this.value);
  }
}
