import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AddressDto, PropertyDto } from '@demo/demo/data-model/properties';
import { UserDto } from '@demo/demo/data-model/users';
import { AbstractFormComponent } from '@ngil/ui-form';

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
  form: FormGroup<PropertyForm> = new FormGroup<PropertyForm>({
    price: new FormControl(null),
    size: new FormControl(null),
    address: new FormControl(null),
    availableFrom: new FormControl(null),
    features: new FormControl(null),
    description: new FormControl(null),
    contact: new FormControl(null)
  });
}