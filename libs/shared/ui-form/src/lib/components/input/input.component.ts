import { Component, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { AbstractInputComponent } from '@ngil/ui-form';

@Component({
  selector: 'demo-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DemoInputComponent),
      multi: true
    }
  ]
})
export class DemoInputComponent extends AbstractInputComponent {
  @Input() type = 'text';

  value: string;

  writeValue(value: string): void {
    this.value = value;
  }

  onChangeInput(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.value || this.parentControl.value !== input.value) {
      this.value = input.value;
      this.onChange(input.value);
    }
  }
}
