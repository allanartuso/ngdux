import { ElementRef } from '@angular/core';
import { NgilInputComponent } from '../input/input.component';
import { TimePickerDirective } from './time-picker.directive';

describe('TimePickerDirective', () => {
  let directive: TimePickerDirective;
  const elementRef = {
    nativeElement: { value: '' }
  };
  const inputComponent = { value: '' };

  beforeEach(() => {
    directive = new TimePickerDirective(
      elementRef as ElementRef<HTMLInputElement>,
      inputComponent as NgilInputComponent
    );
  });

  it('creates', () => {
    expect(directive).toBeTruthy();
  });
});
