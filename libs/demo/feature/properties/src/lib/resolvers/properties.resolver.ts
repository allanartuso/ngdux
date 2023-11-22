import { Injectable } from '@angular/core';

import { PropertiesFacade } from '@demo/demo/data-access/properties';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PropertiesResolver  {
  constructor(private readonly propertiesFacade: PropertiesFacade) {}

  resolve(): Observable<boolean> {
    this.propertiesFacade.initialize();

    return this.propertiesFacade.isReady$.pipe(first(isReady => isReady));
  }
}
