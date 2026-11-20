import { Injectable, inject } from '@angular/core';

import { PropertiesFacade } from '@demo/demo/data-access/properties';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PropertiesResolver {
  private readonly propertiesFacade = inject(PropertiesFacade);

  resolve(): Observable<boolean> {
    this.propertiesFacade.initialize();

    return this.propertiesFacade.isReady$.pipe(first(isReady => isReady));
  }
}
