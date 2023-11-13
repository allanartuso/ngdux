import { ModuleWithProviders, NgModule } from '@angular/core';
import { LIST_FEATURE_KEYS, NgduxListStateModule } from '@ngdux/list';
import {
  DataAccessSmartphonesModuleConfig,
  SMARTPHONES_DEFAULT_FEATURE_KEY,
  SMARTPHONES_LIST_FEATURE_KEY
} from './models/list.model';
import { SmartphonesListFacade } from './services/list-facade';
import { SmartphonesListService } from './services/list.service';

@NgModule({
  imports: [NgduxListStateModule.config({ service: SmartphonesListService })],
  providers: [SmartphonesListFacade]
})
export class DemoDataAccessSmartphonesModule {
  static config(config?: DataAccessSmartphonesModuleConfig): ModuleWithProviders<DemoDataAccessSmartphonesModule> {
    const featureKey = config?.listFeatureKey || SMARTPHONES_DEFAULT_FEATURE_KEY;
    return {
      ngModule: DemoDataAccessSmartphonesModule,
      providers: [
        { provide: SMARTPHONES_LIST_FEATURE_KEY, useValue: featureKey },
        { provide: LIST_FEATURE_KEYS, multi: true, useValue: featureKey }
      ]
    };
  }
}
