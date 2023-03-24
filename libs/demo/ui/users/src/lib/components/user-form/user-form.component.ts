import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserDto } from '@demo/demo/data-model/users';
import { AbstractFormComponent } from '@ngil/ui-form';

interface UserForm {
  email: FormControl<string>;
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  birthTime: FormControl<string>;
}

@Component({
  selector: 'demo-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent extends AbstractFormComponent<UserDto> {
  form: FormGroup<UserForm> = new FormGroup<UserForm>({
    email: new FormControl(null, [Validators.required, Validators.email]),
    firstName: new FormControl(null),
    lastName: new FormControl(null, [Validators.maxLength(40)]),
    birthTime: new FormControl(null)
  });
}
