# @ngil/form-cva

The @ngil/form-cva provides facilities to create FormControl, FormGroup control value accessors.
It was created to be used by presentational components.

## Installation

npm install @ngil/form-cva

## FormControl CVA

input.component.ts

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

form.component.html
https://github.com/allanartuso/ngdux/tree/master/libs/demo/ui/properties/src/lib/address-form

```
<form [formGroup]="formGroup">
  <ngil-input label="Country" formControlName="country"></ngil-input>
  <ngil-input label="City" formControlName="city"></ngil-input>
  <ngil-input label="Zip code" formControlName="zipCode"></ngil-input>
  <ngil-input label="Street" formControlName="street"></ngil-input>
  <ngil-input label="Street number" formControlName="streetNumber"></ngil-input>
</form>

```

## FormGroup CVA

Stackblitz: https://stackblitz.com/edit/angular-fieejt?file=src/form.ts

address-form.component.ts

```
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
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
    country: new FormControl(''),
    city: new FormControl(''),
    zipCode: new FormControl(''),
    street: new FormControl(''),
    streetNumber: new FormControl('')
  });
}
```

address-form.component.html

```
<form [formGroup]="formGroup">
  <input formControlName="country" />
  <input formControlName="city" />
  <input formControlName="zipCode" />
  <input formControlName="street" />
  <input formControlName="streetNumber" />
</form>
```

form.component.ts

```
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { PropertyDto } from '@demo/demo/data-model/properties';
import { AbstractFormComponent, FlatFormControlsOf } from '@ngil/form-cva';

@Component({
  selector: 'demo-property-form',
  templateUrl: './property-form.component.html',
  styleUrls: ['./property-form.component.scss']
})
export class PropertyFormComponent {

  formGroup = new FormGroup<FlatFormControlsOf<PropertyDto>>({
    address: new FormControl(null),
    ...
  });
}
```

form.component.html

```
<form [formGroup]="formGroup">
  <demo-address-form formControlName="address"></demo-address-form>
</form>
```
