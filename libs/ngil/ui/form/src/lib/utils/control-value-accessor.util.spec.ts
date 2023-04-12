import { Component, forwardRef } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { createControlValueAccessorProviders } from './control-value-accessor.util';

@Component({})
class TestComponent {}

describe('createControlValueAccessorProviders', () => {
  it('creates value and validators providers', () => {
    const expected = [
      {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => TestComponent),
        multi: true
      },
      {
        provide: NG_VALIDATORS,
        useExisting: forwardRef(() => TestComponent),
        multi: true
      }
    ];

    const providers = createControlValueAccessorProviders(TestComponent);

    expect(JSON.stringify(providers)).toStrictEqual(JSON.stringify(expected));
  });
});
