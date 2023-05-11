# @ngil/form-cva

The @ngil/form-cva provides facilities to create FormControl, FormGroup control value accessors.

## FormControl CVA

```
import { AfterViewInit, ChangeDetectionStrategy, Component, forwardRef, Input } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AbstractInputComponent } from '@ngil/form-cva';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'ngil-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgilInputComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgilInputComponent extends AbstractInputComponent<string | number> implements AfterViewInit {
  @Input() type = 'text';

  control = new FormControl();

  ngAfterViewInit() {
    this.control.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => {
      this.onChangeInput(value);
    });
  }

  writeValue(value: string | number): void {
    this.control.setValue(value);
  }

  onChangeInput(value: string | number): void {
    if (this.type === 'number') {
      value = +value;
    }
    if (this.onChange) {
      this.onChange(value);
    }
  }
}
```

## FormGroup CVA

```
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { AddressDto } from '@demo/demo/data-model/properties';
import { AbstractFormGroupComponent, FlatFormControlsOf, createControlValueAccessorProviders } from '@ngil/form-cva';

@Component({
  selector: 'demo-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: createControlValueAccessorProviders(AddressFormComponent)
})
export class AddressFormComponent extends AbstractFormGroupComponent<AddressDto> {
  formGroup = new FormGroup<FlatFormControlsOf<AddressDto>>({
    id: new FormControl(''),
    country: new FormControl(''),
    city: new FormControl(''),
    zipCode: new FormControl(''),
    street: new FormControl(''),
    streetNumber: new FormControl('')
  });
}
```
