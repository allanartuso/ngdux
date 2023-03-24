import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { UserFacade } from '@demo/demo/data-access/users';
import { first, Observable } from 'rxjs';

@Injectable()
export class UserResolver implements Resolve<boolean> {
  constructor(private readonly userFacade: UserFacade) {}

  resolve(route: ActivatedRouteSnapshot): Observable<boolean> {
    const id = route.params['id'];

    this.userFacade.load({ id });

    return this.userFacade.isReady$.pipe(first(userReady => userReady));
  }
}
