import { forwardRef, Type } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

export function createControlValueAccessorProviders(component: Type<unknown>) {
  return [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => component),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => component),
      multi: true
    }
  ];
}
