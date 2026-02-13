import { InjectionToken } from '@angular/core';
import { ErrorDto } from '@ngdux/data-model-common';
import { ListFacade, provideListState } from '@ngdux/list';
import { CarDto } from 'libs/demo/data-model/cars/src/lib/models/car.dto';
import { CARS_DEFAULT_FEATURE_KEY } from './models/cars.model';
import { CarsService } from './services/cars.service';

export type CarsListFacade = ListFacade<CarDto, ErrorDto>;
export const CarsListFacade = new InjectionToken<CarsListFacade>('CarsListFacade');

export function provideDemoDataAccessCarsModule(
  featureKey: string = CARS_DEFAULT_FEATURE_KEY,
  facadeToken: InjectionToken<CarsListFacade> = CarsListFacade
) {
  return provideListState(featureKey, facadeToken, CarsService);
}
