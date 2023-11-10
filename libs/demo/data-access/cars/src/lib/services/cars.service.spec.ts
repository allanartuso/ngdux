import { TestBed } from '@angular/core/testing';
import { CARS_RESOURCE_BASE_PATH } from '@demo/demo/data-model/cars';
import { createPersistentCar, createPersistentCars } from '@demo/demo/data-model/cars/test';
import { RestService } from '@demo/shared/data-access/rest-service';
import { restServiceFixture } from '@demo/shared/data-access/rest-service/test';
import { FilteringLogic, RequestOptions } from '@ngdux/data-model-common';
import { cold } from 'jest-marbles';
import { CarsService } from './cars.service';

describe('CarsService', () => {
  const car = createPersistentCar();
  const cars = createPersistentCars();
  let service: CarsService;
  let mockRestService: Partial<RestService>;

  beforeEach(() => {
    mockRestService = restServiceFixture.getMockRestService(car, cars);

    TestBed.configureTestingModule({
      providers: [CarsService, { provide: RestService, useValue: mockRestService }]
    });

    service = TestBed.inject(CarsService);
    mockRestService = TestBed.inject(RestService);
  });

  it('loadResources', () => {
    const options: RequestOptions = {
      pagingOptions: {
        page: 1,
        pageSize: 10
      },
      sortingOptions: {},
      filteringOptions: {
        filters: [],
        logic: FilteringLogic.AND
      }
    };
    const expected = cold('(u|)', { u: cars });

    const actual = service.loadResources(options);

    expect(actual).toBeObservable(expected);
    expect(mockRestService.loadResources).toHaveBeenCalledTimes(1);
    expect(mockRestService.loadResources).toHaveBeenCalledWith(CARS_RESOURCE_BASE_PATH, options);
  });

  it('deleteResources', () => {
    const expected = cold('(u|)', { u: cars });
    const ids: string[] = cars.map(car => car.id);

    const actual = service.deleteResources(ids);

    expect(actual).toBeObservable(expected);
    expect(mockRestService.deleteResources).toHaveBeenCalledTimes(1);
    expect(mockRestService.deleteResources).toHaveBeenCalledWith(CARS_RESOURCE_BASE_PATH, ids);
  });

  it('patchResources', () => {
    const expected = cold('(u|)', { u: cars });
    const ids: string[] = cars.map(car => car.id);

    const actual = service.patchResources(ids, car);

    expect(actual).toBeObservable(expected);
    expect(mockRestService.patchResources).toHaveBeenCalledTimes(1);
    expect(mockRestService.patchResources).toHaveBeenCalledWith(
      CARS_RESOURCE_BASE_PATH,
      ids.map(id => ({
        id,
        resource: car
      }))
    );
  });
});
