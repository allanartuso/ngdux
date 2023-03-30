import { ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgilInputComponent } from '../input/input.component';
import { TimePickerDirective } from './time-picker.directive';

describe('TimePickerDirective', () => {
  let directive: TimePickerDirective;
  const elementRef = {
    nativeElement: { value: '' }
  };

  const inputComponent = { value: '', control: new FormControl() } as unknown as NgilInputComponent;

  beforeEach(() => {
    directive = new TimePickerDirective(elementRef as ElementRef<HTMLInputElement>, inputComponent);
  });

  it('creates', () => {
    expect(directive).toBeTruthy();
  });
});
