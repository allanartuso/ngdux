import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CarDto } from '@demo/demo/data-model/cars';
import { CreateUserDto, UserDto } from '@demo/demo/data-model/users';
import { AbstractFormComponent, FlatFormControlsOf } from '@ngil/form-cva';

@Component({
  selector: 'demo-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserFormComponent extends AbstractFormComponent<UserDto> {
  @Input() cars: CarDto[] = [];

  form = new FormGroup<FlatFormControlsOf<CreateUserDto>>({
    email: new FormControl('', [Validators.required, Validators.email]),
    firstName: new FormControl(''),
    lastName: new FormControl('', [Validators.maxLength(40)]),
    cars: new FormControl([]),
    birthTime: new FormControl('')
  });
}
