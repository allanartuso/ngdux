import { Injectable } from '@angular/core';
import { UserDto, USERS_RESOURCE_BASE_PATH } from '@demo/demo/data-model/users';
import { RestService } from '@demo/shared/data-access';
import { ErrorDto, ListService, RequestOptions } from '@ngdux/data-model-common';
import { Observable } from 'rxjs';

@Injectable()
export class UsersService implements ListService<UserDto> {
  constructor(private readonly restService: RestService) {}

  loadResources(options: RequestOptions): Observable<UserDto[]> {
    return this.restService.loadResources(USERS_RESOURCE_BASE_PATH, options);
  }

  deleteResources(ids: string[]): Observable<Array<ErrorDto>> {
    return this.restService.deleteResources(USERS_RESOURCE_BASE_PATH, ids);
  }

  patchResources(ids: string[], resource: Partial<UserDto>): Observable<Array<UserDto | ErrorDto>> {
    return this.restService.patchResources(
      USERS_RESOURCE_BASE_PATH,
      ids.map(id => ({ id, resource }))
    );
  }
}
