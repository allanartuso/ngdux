import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AddressDto, PropertyDto, PropertyFeatureDto } from '@demo/demo/data-model/properties';
import { UserDto } from '@demo/demo/data-model/users';
import { AbstractFormComponent, FlatFormControlsOf } from '@ngil/form-cva';

interface PropertyForm {
  price: FormControl<number>;
  size: FormControl<number>;
  address: FormControl<AddressDto>;
  availableFrom: FormControl<string>;
  features: FormControl<string[]>;
  description: FormControl<string>;
  contact: FormControl<UserDto>;
}

@Component({
  selector: 'demo-property-form',
  templateUrl: './property-form.component.html',
  styleUrls: ['./property-form.component.scss']
})
export class PropertyFormComponent extends AbstractFormComponent<PropertyDto> {
  @Input() users: UserDto[] = [];

  features = Object.keys(PropertyFeatureDto);

  form = new FormGroup<FlatFormControlsOf<PropertyForm>>({
    price: new FormControl(),
    size: new FormControl(),
    address: new FormControl(),
    availableFrom: new FormControl(),
    features: new FormControl(),
    description: new FormControl(),
    contact: new FormControl()
  });
}
