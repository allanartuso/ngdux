import { Injectable } from '@angular/core';
import { AgentDto, AGENTS_RESOURCE_BASE_PATH } from '@demo/demo/data-model/agents';
import { RestService } from '@demo/shared/data-access/rest-service';
import { ErrorDto, ListService, RequestOptions } from '@ngdux/data-model-common';
import { Observable } from 'rxjs';

@Injectable()
export class AgentsListService implements ListService<AgentDto> {
  constructor(private readonly restService: RestService) {}

  loadResources(options: RequestOptions): Observable<AgentDto[]> {
    return this.restService.loadResources(AGENTS_RESOURCE_BASE_PATH, options);
  }

  deleteResources(ids: string[]): Observable<Array<ErrorDto>> {
    return this.restService.deleteResources(AGENTS_RESOURCE_BASE_PATH, ids);
  }

  patchResources(ids: string[], resource: Partial<AgentDto>): Observable<Array<AgentDto | ErrorDto>> {
    return this.restService.patchResources(
      AGENTS_RESOURCE_BASE_PATH,
      ids.map(id => ({ id, resource }))
    );
  }
}
