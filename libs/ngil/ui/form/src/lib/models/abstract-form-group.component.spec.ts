import { Component, forwardRef } from '@angular/core';
import { FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AbstractFormGroupComponent } from './abstract-form-group.component';
import { FlatFormControlsOf } from './form.model';

interface TestFormValue {
  firstName: string;
  lastName: string;
}

@Component({
  selector: 'ngil-form-group',
  template: '',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TestFormGroupComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => TestFormGroupComponent),
      multi: true
    }
  ]
})
export class TestFormGroupComponent extends AbstractFormGroupComponent<TestFormValue> {
  formGroup = new FormGroup<FlatFormControlsOf<TestFormValue>>({
    firstName: new FormControl(),
    lastName: new FormControl()
  });
}
