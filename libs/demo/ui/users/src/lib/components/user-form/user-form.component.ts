import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CreateUserDto, UserDto } from '@demo/demo/data-model/users';
import { AbstractFormComponent, FlatFormControlsOf } from '@ngil/ui-form';

@Component({
  selector: 'demo-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent extends AbstractFormComponent<UserDto> {
  form = new FormGroup<FlatFormControlsOf<CreateUserDto>>({
    email: new FormControl('', [Validators.required, Validators.email]),
    firstName: new FormControl(''),
    lastName: new FormControl('', [Validators.maxLength(40)]),
    birthTime: new FormControl('')
  });
}
