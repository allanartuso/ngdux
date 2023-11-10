import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { CarsFacade } from '@demo/demo/data-access/cars';
import { CarDto } from '@demo/demo/data-model/cars';
import { ErrorDto } from '@ngdux/data-model-common';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

@Injectable()
export class CarsResolver implements Resolve<boolean> {
  constructor(private readonly carsFacade: CarsFacade<CarDto, ErrorDto>) {}

  resolve(): Observable<boolean> {
    this.carsFacade.initialize();

    return this.carsFacade.isReady$.pipe(first(isReady => isReady));
  }
}
