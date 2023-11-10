import { Injectable } from '@angular/core';
import { CarDto, CARS_RESOURCE_BASE_PATH } from '@demo/demo/data-model/cars';
import { RestService } from '@demo/shared/data-access/rest-service';
import { ErrorDto, ListService, RequestOptions } from '@ngdux/data-model-common';
import { Observable } from 'rxjs';

@Injectable()
export class CarsService implements ListService<CarDto> {
  constructor(private readonly restService: RestService) {}

  loadResources(options: RequestOptions): Observable<CarDto[]> {
    return this.restService.loadResources(CARS_RESOURCE_BASE_PATH, options);
  }

  deleteResources(ids: string[]): Observable<Array<ErrorDto>> {
    return this.restService.deleteResources(CARS_RESOURCE_BASE_PATH, ids);
  }

  patchResources(ids: string[], resource: Partial<CarDto>): Observable<Array<CarDto | ErrorDto>> {
    return this.restService.patchResources(
      CARS_RESOURCE_BASE_PATH,
      ids.map(id => ({ id, resource }))
    );
  }
}
