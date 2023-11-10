import { ModuleWithProviders, NgModule } from '@angular/core';
import { DemoDataAccessCommonListModule } from '@demo/shared/data-access/list';
import { LIST_FEATURE_KEY } from '@ngdux/list';
import { CARS_DEFAULT_FEATURE_KEY, DataAccessCarsModuleConfig } from './models/cars.model';
import { CarsService } from './services/cars.service';

@NgModule({
  imports: [DemoDataAccessCommonListModule.config(CarsService, { listFeatureKey: CARS_DEFAULT_FEATURE_KEY })]
})
export class DemoDataAccessCarsModule {
  static config(config: DataAccessCarsModuleConfig): ModuleWithProviders<DemoDataAccessCarsModule> {
    return {
      ngModule: DemoDataAccessCarsModule,
      providers: [{ provide: LIST_FEATURE_KEY, useValue: config.listFeatureKey || CARS_DEFAULT_FEATURE_KEY }]
    };
  }
}
