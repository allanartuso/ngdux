import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { UserDto } from '@demo/demo/data-model/users';
import { AbstractFormComponent } from '@ngil/ui-form';

@Component({
  selector: 'demo-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent extends AbstractFormComponent<UserDto> {
  constructor(private readonly formBuilder: UntypedFormBuilder) {
    super();
  }

  protected createForm(user: UserDto): UntypedFormGroup {
    return this.formBuilder.group({
      email: [user.email, [Validators.required, Validators.email]],
      firstName: [user.firstName],
      lastName: [user.lastName, [Validators.maxLength(40)]]
    });
  }

  protected override getFormDefaultValue(user?: UserDto): UserDto {
    return {
      ...super.getFormDefaultValue(user),
      email: user?.email,
      firstName: user?.firstName,
      lastName: user?.lastName
    };
  }
}
