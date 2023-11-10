import { ModuleWithProviders, NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ListEffects } from './+state/effects';
import { ListFacade } from './+state/facade';
import { ListReducerManager } from './+state/state.service';
import {
  LIST_FEATURE_KEY,
  LIST_NOTIFICATION_SERVICE,
  LIST_SERVICE,
  NgduxListStateModuleConfig
} from './models/list.model';
import { NotificationServicePlaceholder } from './services/list-notification-service';

@NgModule({
  imports: [EffectsModule.forFeature([ListEffects])],
  providers: [ListFacade, ListReducerManager]
})
export class NgduxListStateModule {
  static config<T extends { [key: string]: any }, Error = unknown, S = T>(
    config: NgduxListStateModuleConfig<T, Error, S>
  ): ModuleWithProviders<NgduxListStateModule> {
    return {
      ngModule: NgduxListStateModule,
      providers: [
        { provide: LIST_FEATURE_KEY, useValue: config.listFeatureKey },
        { provide: LIST_SERVICE, useClass: config.service },
        { provide: LIST_NOTIFICATION_SERVICE, useClass: config.notificationService || NotificationServicePlaceholder }
      ]
    };
  }
}
