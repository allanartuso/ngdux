import { AbstractControl, FormControl, FormGroup } from '@angular/forms';

/**
 * Create FormControl or FormGroup types to used in a FormGroup using a interface
 */
export type FormControlsOf<T extends Record<string, any>> = {
  [K in keyof Required<T>]: Required<T>[K] extends Record<string, any>
    ? Required<T>[K] extends any[]
      ? FormControl<T[K] | null>
      : FormGroup<FormControlsOf<Required<T>[K]>>
    : FormControl<T[K] | null>;
};

/**
 * Wrap every property in the Record T in a FormControl type
 */
export type FlatFormControlsOf<T extends Record<string, any>> = {
  [K in keyof T]: FormControl<T[K] | null>;
};

/**
 * Gives the form value type
 */
export type FormValueOf<T extends AbstractControl<any>> = T['value'];
