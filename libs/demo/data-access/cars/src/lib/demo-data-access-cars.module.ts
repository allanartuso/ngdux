import { ModuleWithProviders, NgModule } from '@angular/core';
import { LIST_FEATURE_KEYS, NgduxListStateModule } from '@ngdux/list';
import { CARS_DEFAULT_FEATURE_KEY, CARS_LIST_FEATURE_KEY, DataAccessCarsModuleConfig } from './models/cars.model';
import { CarsService } from './services/cars.service';
import { CarsListFacade } from './services/list-facade';

@NgModule({
  imports: [NgduxListStateModule.config({ service: CarsService })],
  providers: [CarsListFacade]
})
export class DemoDataAccessCarsModule {
  static config(config?: DataAccessCarsModuleConfig): ModuleWithProviders<DemoDataAccessCarsModule> {
    const featureKey = config?.listFeatureKey || CARS_DEFAULT_FEATURE_KEY;

    return {
      ngModule: DemoDataAccessCarsModule,
      providers: [
        { provide: CARS_LIST_FEATURE_KEY, useValue: featureKey },
        { provide: LIST_FEATURE_KEYS, multi: true, useValue: featureKey }
      ]
    };
  }
}
