import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CarsListFacade } from '@demo/demo/data-access/cars';
import { UserFacade } from '@demo/demo/data-access/users';
import { CreateUserDto, UserDto, isUserDto } from '@demo/demo/data-model/users';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'demo-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserComponent {
  model$ = combineLatest({
    user: this.userFacade.resource$,
    requestState: this.userFacade.requestState$,
    cars: this.carsFacade.resources$
  });

  constructor(private readonly userFacade: UserFacade, private readonly carsFacade: CarsListFacade) {}

  onSaved(user: UserDto | CreateUserDto): void {
    if (isUserDto(user)) {
      this.userFacade.save({ resource: user });
    } else {
      this.userFacade.create({ resource: user });
    }
  }
}
