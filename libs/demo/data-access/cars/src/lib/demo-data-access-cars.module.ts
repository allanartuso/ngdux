import { ModuleWithProviders, NgModule } from '@angular/core';
import { LIST_FEATURE_KEY, NgduxListStateModule } from '@ngdux/list';
import { CARS_DEFAULT_FEATURE_KEY, DataAccessCarsModuleConfig } from './models/cars.model';
import { CarsService } from './services/cars.service';

@NgModule({
  imports: [NgduxListStateModule.config({ service: CarsService })]
})
export class DemoDataAccessCarsModule {
  static config(config: DataAccessCarsModuleConfig): ModuleWithProviders<DemoDataAccessCarsModule> {
    return {
      ngModule: DemoDataAccessCarsModule,
      providers: [{ provide: LIST_FEATURE_KEY, useValue: config.listFeatureKey || CARS_DEFAULT_FEATURE_KEY }]
    };
  }
}
