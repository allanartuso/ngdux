import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { PropertyFacade } from '@demo/demo/data-access/properties';
import { UsersFacade } from '@demo/demo/data-access/users';
import { combineLatest, first, map, Observable } from 'rxjs';

@Injectable()
export class PropertyResolver implements Resolve<boolean> {
  constructor(private readonly propertyFacade: PropertyFacade, private readonly usersFacade: UsersFacade) {}

  resolve(route: ActivatedRouteSnapshot): Observable<boolean> {
    const id = route.params['id'];

    this.propertyFacade.load({ id });
    this.usersFacade.setPageSize({ pageSize: 100 });
    this.usersFacade.initialize();

    return combineLatest([this.propertyFacade.isReady$, this.usersFacade.isReady$]).pipe(
      first(items => items.every(isReady => isReady)),
      map(() => true)
    );
  }
}
