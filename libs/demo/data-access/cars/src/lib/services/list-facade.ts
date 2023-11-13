import { Inject, Injectable } from '@angular/core';
import { CarDto } from '@demo/demo/data-model/cars';
import { ErrorDto } from '@ngdux/data-model-common';
import { AbstractListFacade, ListStateService } from '@ngdux/list';
import { Store } from '@ngrx/store';
import { CARS_LIST_FEATURE_KEY } from '../models/cars.model';

@Injectable()
export class CarsListFacade extends AbstractListFacade<CarDto, ErrorDto> {
  constructor(
    store: Store,
    listStateService: ListStateService<CarDto, ErrorDto>,
    @Inject(CARS_LIST_FEATURE_KEY) featureKey: string
  ) {
    super(store, listStateService.getFeatureActions(featureKey), listStateService.getFeatureSelectors(featureKey));
  }
}
