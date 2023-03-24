import { Component } from '@angular/core';
import { UserFacade } from '@demo/demo/data-access/users';
import { UserDto } from '@demo/demo/data-model/users';
import { RequestState } from '@ngdux/data-model-common';
import { Observable } from 'rxjs';

@Component({
  selector: 'demo-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent {
  user$: Observable<UserDto> = this.userFacade.resource$;
  requestState$: Observable<RequestState> = this.userFacade.requestState$;

  constructor(private readonly userFacade: UserFacade) {}

  onUserSaved(user: UserDto): void {
    if (user.id) {
      this.userFacade.save({ resource: user });
    } else {
      this.userFacade.create({ resource: user });
    }
  }
}
