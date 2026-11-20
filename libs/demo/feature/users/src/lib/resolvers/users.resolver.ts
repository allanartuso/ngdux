import { Injectable, inject } from '@angular/core';
import { UsersListFacade } from '@demo/demo/data-access/users';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

@Injectable()
export class UsersResolver {
  private readonly usersFacade = inject(UsersListFacade);

  resolve(): Observable<boolean> {
    this.usersFacade.initialize();

    return this.usersFacade.isReady$.pipe(first(isReady => isReady));
  }
}
