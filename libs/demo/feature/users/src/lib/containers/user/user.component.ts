import { Component } from '@angular/core';
import { UserFacade } from '@demo/demo/data-access/users';
import { CreateUserDto, UserDto, isUserDto } from '@demo/demo/data-model/users';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'demo-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent {
  model$ = combineLatest({
    user: this.userFacade.resource$,
    requestState: this.userFacade.requestState$
  });

  constructor(private readonly userFacade: UserFacade) {}

  onSaved(user: UserDto | CreateUserDto): void {
    if (isUserDto(user)) {
      this.userFacade.save({ resource: user });
    } else {
      this.userFacade.create({ resource: user });
    }
  }
}
