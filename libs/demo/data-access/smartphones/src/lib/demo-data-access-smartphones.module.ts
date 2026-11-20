import { ModuleWithProviders, NgModule } from '@angular/core';
import { provideListState } from '@ngdux/list';
import {
  DataAccessSmartphonesModuleConfig,
  SMARTPHONES_DEFAULT_FEATURE_KEY,
  SMARTPHONES_LIST_FEATURE_KEY,
} from './models/list.model';
import { SmartphonesListFacade } from './services/list-facade';
import { SmartphonesListService } from './services/list.service';

@NgModule({})
export class DemoDataAccessSmartphonesModule {
  static config(config?: DataAccessSmartphonesModuleConfig): ModuleWithProviders<DemoDataAccessSmartphonesModule> {
    const featureKey = config?.listFeatureKey || SMARTPHONES_DEFAULT_FEATURE_KEY;
    return {
      ngModule: DemoDataAccessSmartphonesModule,
      providers: [
        { provide: SMARTPHONES_LIST_FEATURE_KEY, useValue: featureKey },
        ...provideListState(featureKey, SmartphonesListFacade, SmartphonesListService),
      ],
    };
  }
}
