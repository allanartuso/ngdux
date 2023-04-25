import { Injectable } from '@angular/core';
import { PROPERTIES_RESOURCE_BASE_PATH, PropertyDto } from '@demo/demo/data-model/properties';
import { RestService } from '@demo/shared/data-access';
import { ErrorDto, ListService, RequestOptions } from '@ngdux/data-model-common';
import { FormService } from '@ngdux/form';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PropertyService implements FormService<PropertyDto>, ListService<PropertyDto> {
  constructor(private readonly restService: RestService) {}

  loadResource(id: string): Observable<PropertyDto> {
    return this.restService.loadResource<PropertyDto>(`${PROPERTIES_RESOURCE_BASE_PATH}/${id}`);
  }

  saveResource(property: PropertyDto): Observable<PropertyDto> {
    return this.restService.updateResource<PropertyDto>(`${PROPERTIES_RESOURCE_BASE_PATH}/${property.id}`, property);
  }

  deleteResource(id: string): Observable<PropertyDto> {
    return this.restService.deleteResource<PropertyDto>(`${PROPERTIES_RESOURCE_BASE_PATH}/${id}`);
  }

  createResource(property: PropertyDto): Observable<PropertyDto> {
    return this.restService.createResource<PropertyDto>(PROPERTIES_RESOURCE_BASE_PATH, property);
  }

  loadResources(options: RequestOptions): Observable<PropertyDto[]> {
    return this.restService.loadResources(PROPERTIES_RESOURCE_BASE_PATH, options);
  }

  deleteResources(ids: string[]): Observable<Array<ErrorDto>> {
    return this.restService.deleteResources(PROPERTIES_RESOURCE_BASE_PATH, ids);
  }

  patchResources?(ids: string[], resource: Partial<PropertyDto>): Observable<Array<PropertyDto | ErrorDto>> {
    return this.restService.patchResources(
      PROPERTIES_RESOURCE_BASE_PATH,
      ids.map(id => ({ id, resource }))
    );
  }
}
