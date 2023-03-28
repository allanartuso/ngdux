import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { PropertyFacade } from '@demo/demo/data-access/properties';
import { first, Observable } from 'rxjs';

@Injectable()
export class PropertyResolver implements Resolve<boolean> {
  constructor(private readonly propertyFacade: PropertyFacade) {}

  resolve(route: ActivatedRouteSnapshot): Observable<boolean> {
    const id = route.params['id'];

    this.propertyFacade.load({ id });

    return this.propertyFacade.isReady$.pipe(first(propertyReady => propertyReady));
  }
}
