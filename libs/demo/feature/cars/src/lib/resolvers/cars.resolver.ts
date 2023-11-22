import { Injectable } from '@angular/core';

import { CarsListFacade } from '@demo/demo/data-access/cars';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

@Injectable()
export class CarsResolver  {
  constructor(private readonly carsFacade: CarsListFacade) {}

  resolve(): Observable<boolean> {
    this.carsFacade.initialize();

    return this.carsFacade.isReady$.pipe(first(isReady => isReady));
  }
}
