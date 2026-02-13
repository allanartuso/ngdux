import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { PropertyFacade } from '@demo/demo/data-access/properties';
import { Observable, combineLatest, first, map } from 'rxjs';
import { PropertyUsersListFacade } from '../demo-feature-properties.module';

@Injectable()
export class PropertyResolver {
  constructor(
    private readonly propertyFacade: PropertyFacade,
    private readonly usersFacade: PropertyUsersListFacade
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<boolean> {
    const id = route.params['id'];
    this.usersFacade.setPageSize({ pageSize: 100 });
    this.usersFacade.initialize();

    if (id) {
      this.propertyFacade.load({ id });

      return combineLatest([this.propertyFacade.isReady$, this.usersFacade.isReady$]).pipe(
        first(items => items.every(isReady => isReady)),
        map(() => true)
      );
    } else {
      this.propertyFacade.reset();
      return this.usersFacade.isReady$.pipe(first(isReady => isReady));
    }
  }
}
