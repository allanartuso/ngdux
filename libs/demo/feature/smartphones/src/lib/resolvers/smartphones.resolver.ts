import { Injectable, inject } from '@angular/core';

import { SmartphonesListFacade } from '@demo/demo/data-access/smartphones';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

@Injectable()
export class SmartphonesResolver {
  private readonly smartphonesFacade = inject(SmartphonesListFacade);

  resolve(): Observable<boolean> {
    this.smartphonesFacade.initialize();

    return this.smartphonesFacade.isReady$.pipe(first(isReady => isReady));
  }
}
