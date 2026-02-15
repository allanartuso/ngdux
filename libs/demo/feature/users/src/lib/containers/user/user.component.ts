import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UserFormFacade } from '@demo/demo/data-access/users';
import { CreateUserDto, UserDto, isUserDto } from '@demo/demo/data-model/users';
import { UserFormComponent } from '@demo/demo/ui/users';
import { combineLatest } from 'rxjs';
import { UserCarsListFacade } from '../../demo-feature-users.module';

@Component({
  selector: 'demo-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UserFormComponent, AsyncPipe],
})
export class UserComponent {
  model$ = combineLatest({
    user: this.userFacade.resource$,
    requestState: this.userFacade.requestState$,
    cars: this.carsFacade.resources$,
  });

  constructor(
    private readonly userFacade: UserFormFacade,
    private readonly carsFacade: UserCarsListFacade,
  ) {}

  onSaved(user: UserDto | CreateUserDto): void {
    if (isUserDto(user)) {
      this.userFacade.save({ resource: user });
    } else {
      this.userFacade.create({ resource: user });
    }
  }
}
