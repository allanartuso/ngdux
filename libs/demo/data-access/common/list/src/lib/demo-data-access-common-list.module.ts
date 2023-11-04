import { ModuleWithProviders, NgModule, Type } from '@angular/core';
import { SharedUtilNotificationModule } from '@demo/shared/util-notification';
import { LIST_FEATURE_KEY, ListService } from '@ngdux/list';
import { EffectsModule } from '@ngrx/effects';
import { ListEffects } from './+state/effects';
import { ListFacade } from './+state/facade';
import { ListReducerManager } from './+state/state.service';
import { DataAccessCommonListModuleConfig, LIST_SERVICE } from './models/model';

@NgModule({
  imports: [SharedUtilNotificationModule, EffectsModule.forFeature([ListEffects])],
  providers: [ListReducerManager, ListFacade]
})
export class DemoDataAccessCommonListModule {
  static config<T, S = T>(
    service: Type<ListService<T, S>>,
    config: DataAccessCommonListModuleConfig
  ): ModuleWithProviders<DemoDataAccessCommonListModule> {
    return {
      ngModule: DemoDataAccessCommonListModule,
      providers: [
        { provide: LIST_FEATURE_KEY, useValue: config.listFeatureKey },
        { provide: LIST_SERVICE, useClass: service }
      ]
    };
  }
}
