import { TestBed } from '@angular/core/testing';
import { AGENTS_RESOURCE_BASE_PATH } from '@demo/demo/data-model/agents';
import { createPersistentAgent, createPersistentAgents } from '@demo/demo/data-model/agents/test';
import { RestService } from '@demo/shared/data-access/rest-service';
import { restServiceFixture } from '@demo/shared/data-access/rest-service/test';
import { FilteringLogic, RequestOptions } from '@ngdux/data-model-common';
import { cold } from 'jest-marbles';
import { AgentsListService } from './list.service';

describe('AgentsListService', () => {
  const agent = createPersistentAgent();
  const agents = createPersistentAgents();
  let service: AgentsListService;
  let mockRestService: Partial<RestService>;

  beforeEach(() => {
    mockRestService = restServiceFixture.getMockRestService(agent, agents);

    TestBed.configureTestingModule({
      providers: [AgentsListService, { provide: RestService, useValue: mockRestService }]
    });

    service = TestBed.inject(AgentsListService);
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
    const expected = cold('(u|)', { u: agents });

    const actual = service.loadResources(options);

    expect(actual).toBeObservable(expected);
    expect(mockRestService.loadResources).toHaveBeenCalledTimes(1);
    expect(mockRestService.loadResources).toHaveBeenCalledWith(AGENTS_RESOURCE_BASE_PATH, options);
  });

  it('deleteResources', () => {
    const expected = cold('(u|)', { u: agents });
    const ids: string[] = agents.map(agent => agent.id);

    const actual = service.deleteResources(ids);

    expect(actual).toBeObservable(expected);
    expect(mockRestService.deleteResources).toHaveBeenCalledTimes(1);
    expect(mockRestService.deleteResources).toHaveBeenCalledWith(AGENTS_RESOURCE_BASE_PATH, ids);
  });

  it('patchResources', () => {
    const expected = cold('(u|)', { u: agents });
    const ids: string[] = agents.map(agent => agent.id);

    const actual = service.patchResources(ids, agent);

    expect(actual).toBeObservable(expected);
    expect(mockRestService.patchResources).toHaveBeenCalledTimes(1);
    expect(mockRestService.patchResources).toHaveBeenCalledWith(
      AGENTS_RESOURCE_BASE_PATH,
      ids.map(id => ({
        id,
        resource: agent
      }))
    );
  });
});
