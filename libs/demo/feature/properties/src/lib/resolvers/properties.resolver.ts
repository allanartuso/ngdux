import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { PropertiesFacade } from '@demo/demo/data-access/properties';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PropertiesResolver implements Resolve<boolean> {
  constructor(private readonly propertiesFacade: PropertiesFacade) {}

  resolve(): Observable<boolean> {
    this.propertiesFacade.initialize();

    return this.propertiesFacade.isReady$.pipe(first(isReady => isReady));
  }
}
