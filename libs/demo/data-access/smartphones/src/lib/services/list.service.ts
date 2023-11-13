import { Injectable } from '@angular/core';
import { SmartphoneDto, SMARTPHONES_RESOURCE_BASE_PATH } from '@demo/demo/data-model/smartphones';
import { RestService } from '@demo/shared/data-access/rest-service';
import { ErrorDto, ListService, RequestOptions } from '@ngdux/data-model-common';
import { Observable } from 'rxjs';

@Injectable()
export class SmartphonesListService implements ListService<SmartphoneDto> {
  constructor(private readonly restService: RestService) {}

  loadResources(options: RequestOptions): Observable<SmartphoneDto[]> {
    return this.restService.loadResources(SMARTPHONES_RESOURCE_BASE_PATH, options);
  }

  deleteResources(ids: string[]): Observable<Array<ErrorDto>> {
    return this.restService.deleteResources(SMARTPHONES_RESOURCE_BASE_PATH, ids);
  }

  patchResources(ids: string[], resource: Partial<SmartphoneDto>): Observable<Array<SmartphoneDto | ErrorDto>> {
    return this.restService.patchResources(
      SMARTPHONES_RESOURCE_BASE_PATH,
      ids.map(id => ({ id, resource }))
    );
  }
}
