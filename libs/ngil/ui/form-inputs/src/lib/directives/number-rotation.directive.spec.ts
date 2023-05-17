import { ElementRef } from '@angular/core';
import { NgControl } from '@angular/forms';
import { NumberRotationDirective } from './number-rotation.directive';

describe('NumberRotationDirective', () => {
  let directive: NumberRotationDirective;
  const elementRef = {
    nativeElement: { value: '' }
  };
  const ngControl = { control: { setValue: jest.fn() } };

  beforeEach(() => {
    directive = new NumberRotationDirective(
      elementRef as ElementRef<HTMLInputElement>,
      ngControl as unknown as NgControl
    );
  });

  it('creates', () => {
    expect(directive).toBeTruthy();
  });
});
