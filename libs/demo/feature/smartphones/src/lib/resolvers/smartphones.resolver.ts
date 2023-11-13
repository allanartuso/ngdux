import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { SmartphonesListFacade } from '@demo/demo/data-access/smartphones';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

@Injectable()
export class SmartphonesResolver implements Resolve<boolean> {
  constructor(private readonly smartphonesFacade: SmartphonesListFacade) {}

  resolve(): Observable<boolean> {
    this.smartphonesFacade.initialize();

    return this.smartphonesFacade.isReady$.pipe(first(isReady => isReady));
  }
}
