import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CarDto } from '@demo/demo/data-model/cars';
import { CreateUserDto, Gender, UserDto } from '@demo/demo/data-model/users';
import { SharedUiFormModule } from '@demo/shared/ui-form';
import { NgilEllipsisTooltipComponent } from '@ngil/components';
import { AbstractFormComponent, FlatFormControlsOf } from '@ngil/form-cva';
import {
  NgilInputComponent,
  NgilPickerToggleComponent,
  NgilRadioComponent,
  NgilSelectComponent,
  NgilTimePickerDirective,
  NgilTimePickerOverlayComponent,
} from '@ngil/form-inputs';

@Component({
  selector: 'demo-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    SharedUiFormModule,
    NgilEllipsisTooltipComponent,
    NgilPickerToggleComponent,
    NgilTimePickerOverlayComponent,
    NgilRadioComponent,
    NgilSelectComponent,
    NgilTimePickerDirective,
    NgilInputComponent,
  ],
})
export class UserFormComponent extends AbstractFormComponent<UserDto> {
  @Input() cars: CarDto[] = [];

  genderItems = Object.values(Gender);

  form = new FormGroup<FlatFormControlsOf<CreateUserDto>>({
    email: new FormControl('', [Validators.required, Validators.email]),
    firstName: new FormControl(''),
    lastName: new FormControl('', [Validators.maxLength(40)]),
    cars: new FormControl([]),
    birthTime: new FormControl(''),
    gender: new FormControl<Gender | undefined>(undefined, [Validators.required]),
  });
}
