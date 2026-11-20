import { TestBed } from '@angular/core/testing';
import { RestService } from '@demo/shared/data-access/rest-service';
import { provideStore, Store } from '@ngrx/store';
import { firstValueFrom, of } from 'rxjs';
import { DemoDataAccessAgentsModule } from './demo-data-access-agents.module';
import { AGENTS_DEFAULT_FEATURE_KEY, AGENTS_LIST_FEATURE_KEY } from './models/list.model';
import { AgentsListFacade } from './services/list-facade';

describe('DemoDataAccessAgentsModule', () => {
  it.each([undefined, 'custom-agents'])('registers the facade and effects for feature key %s', async listFeatureKey => {
    const resources = [{ id: 'one' }];
    const restService = { loadResources: jest.fn().mockReturnValue(of(resources)) };
    TestBed.configureTestingModule({
      imports: [DemoDataAccessAgentsModule.config({ listFeatureKey })],
      providers: [provideStore(), { provide: RestService, useValue: restService }],
    });
    const facade = TestBed.inject(AgentsListFacade);
    expect(TestBed.inject(AGENTS_LIST_FEATURE_KEY)).toBe(listFeatureKey ?? AGENTS_DEFAULT_FEATURE_KEY);
    expect(facade.resources()).toEqual([]);
    facade.initialize();
    expect(restService.loadResources).toHaveBeenCalledTimes(1);
    expect(facade.resources()).toEqual(resources);
    expect(await firstValueFrom(facade.resources$)).toEqual(resources);
    expect(facade.isReady()).toBe(true);
    const state = await firstValueFrom(TestBed.inject(Store));
    expect(Object.keys(state)).toEqual([listFeatureKey ?? AGENTS_DEFAULT_FEATURE_KEY]);
  });
});
