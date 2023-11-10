import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { CarsFacade } from '@demo/demo/data-access/cars';
import { UserFacade } from '@demo/demo/data-access/users';
import { CarDto } from '@demo/demo/data-model/cars';
import { Observable, combineLatest, first, map, of } from 'rxjs';

@Injectable()
export class UserResolver implements Resolve<boolean> {
  constructor(private readonly userFacade: UserFacade, private readonly carsFacade: CarsFacade<CarDto>) {}

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
