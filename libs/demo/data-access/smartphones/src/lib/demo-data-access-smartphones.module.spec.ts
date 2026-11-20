import { TestBed } from '@angular/core/testing';
import { RestService } from '@demo/shared/data-access/rest-service';
import { provideStore, Store } from '@ngrx/store';
import { firstValueFrom, of } from 'rxjs';
import { DemoDataAccessSmartphonesModule } from './demo-data-access-smartphones.module';
import { SMARTPHONES_DEFAULT_FEATURE_KEY, SMARTPHONES_LIST_FEATURE_KEY } from './models/list.model';
import { SmartphonesListFacade } from './services/list-facade';

describe('DemoDataAccessSmartphonesModule', () => {
  it.each([undefined, 'custom-smartphones'])(
    'registers the facade and effects for feature key %s',
    async listFeatureKey => {
      const resources = [{ id: 'one' }];
      const restService = { loadResources: jest.fn().mockReturnValue(of(resources)) };
      TestBed.configureTestingModule({
        imports: [DemoDataAccessSmartphonesModule.config({ listFeatureKey })],
        providers: [provideStore(), { provide: RestService, useValue: restService }],
      });
      const facade = TestBed.inject(SmartphonesListFacade);
      expect(TestBed.inject(SMARTPHONES_LIST_FEATURE_KEY)).toBe(listFeatureKey ?? SMARTPHONES_DEFAULT_FEATURE_KEY);
      expect(facade.resources()).toEqual([]);
      facade.initialize();
      expect(restService.loadResources).toHaveBeenCalledTimes(1);
      expect(facade.resources()).toEqual(resources);
      expect(await firstValueFrom(facade.resources$)).toEqual(resources);
      expect(facade.isReady()).toBe(true);
      const state = await firstValueFrom(TestBed.inject(Store));
      expect(Object.keys(state)).toEqual([listFeatureKey ?? SMARTPHONES_DEFAULT_FEATURE_KEY]);
    },
  );
});
