import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { UserFormFacade } from '@demo/demo/data-access/users';
import { Observable, combineLatest, first, map, of } from 'rxjs';
import { UserCarsListFacade } from '../demo-feature-users.module';

@Injectable()
export class UserResolver {
  constructor(
    private readonly userFacade: UserFormFacade,
    private readonly carsFacade: UserCarsListFacade
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<boolean> {
    const id = route.params['id'];
    this.carsFacade.setPageSize({ pageSize: 100 });
    this.carsFacade.initialize();

    if (id) {
      this.userFacade.load({ id });

      return combineLatest([this.userFacade.isReady$, this.carsFacade.isReady$]).pipe(
        first(items => items.every(isReady => isReady)),
        map(() => true)
      );
    } else {
      this.userFacade.reset();
      return of(true);
    }
  }
}
