import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { NgilInputComponent } from '../input/input.component';
import { NgilTimePickerDirective } from './time-picker.directive';

describe('TimePickerDirective', () => {
  let directive: NgilTimePickerDirective;
  const elementRef = {
    nativeElement: { value: '' },
  };

  const inputComponent = { value: '', control: new FormControl() } as unknown as NgilInputComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ElementRef, useValue: elementRef },
        { provide: NgilInputComponent, useValue: inputComponent },
      ],
    });
    directive = TestBed.runInInjectionContext(() => new NgilTimePickerDirective());
  });

  it('creates', () => {
    expect(directive).toBeTruthy();
  });
});
