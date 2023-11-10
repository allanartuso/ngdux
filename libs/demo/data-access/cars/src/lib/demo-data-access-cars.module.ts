import { ModuleWithProviders, NgModule } from '@angular/core';
import { DemoDataAccessCommonListModule } from '@demo/demo/data-access/common/list';
import { LIST_FEATURE_KEY } from '@ngdux/list';
import { CARS_DEFAULT_FEATURE_KEY, DataAccessCarsModuleConfig } from './models/users.model';
import { CarsService } from './services/cars.service';

@NgModule({
  imports: [
    // SharedUtilNotificationModule,
    DemoDataAccessCommonListModule.config(CarsService, { listFeatureKey: CARS_DEFAULT_FEATURE_KEY })
  ],
  providers: [
    // ListReducerManager,
    // ListFacade
  ]
})
export class DemoDataAccessCarsModule {
  static config(config: DataAccessCarsModuleConfig): ModuleWithProviders<DemoDataAccessCarsModule> {
    return {
      ngModule: DemoDataAccessCarsModule,
      providers: [{ provide: LIST_FEATURE_KEY, useValue: config.listFeatureKey || CARS_DEFAULT_FEATURE_KEY }]
    };
  }
}
