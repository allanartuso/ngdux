import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { AddressDto } from '@demo/demo/data-model/properties';
import { AbstractFormGroupComponent, createControlValueAccessorProviders, FlatFormControlsOf } from '@ngil/ui-form';

@Component({
  selector: 'demo-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: createControlValueAccessorProviders(AddressFormComponent)
})
export class AddressFormComponent extends AbstractFormGroupComponent<AddressDto> {
  @Input() validators: Partial<Record<keyof AddressDto, ValidatorFn[]>> = {
    country: [Validators.required, Validators.maxLength(20)],
    city: [Validators.required, Validators.maxLength(60)],
    zipCode: [Validators.required, Validators.maxLength(20)],
    street: [Validators.maxLength(90)],
    streetNumber: []
  };

  formGroup = new FormGroup<FlatFormControlsOf<AddressDto>>({
    id: new FormControl(''),
    country: new FormControl('', this.validators.country),
    city: new FormControl('', this.validators.city),
    zipCode: new FormControl('', this.validators.zipCode),
    street: new FormControl('', this.validators.street),
    streetNumber: new FormControl('', this.validators.streetNumber)
  });
}
