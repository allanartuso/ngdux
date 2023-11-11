import { Inject, ModuleWithProviders, NgModule, Optional } from '@angular/core';
import { ListNotificationService, ListService } from '@ngdux/data-model-common';
import { RegisterEffectsService } from '@ngdux/store-common';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { ListEffects } from './+state/effects';
import { ListReducerManager } from './+state/state.service';
import {
  LIST_FEATURE_KEYS,
  LIST_NOTIFICATION_SERVICES,
  LIST_SERVICES,
  NgduxListStateModuleConfig
} from './models/list.model';
import { NotificationServicePlaceholder } from './services/list-notification-service';

@NgModule({
  providers: [ListReducerManager]
})
export class NgduxListStateModule<
  T extends { [key: string]: any },
  Error = unknown,
  S extends { [key: string]: any } = T,
  Params = Record<string, string>
> {
  constructor(
    registerEffectsService: RegisterEffectsService,
    actions$: Actions,
    store: Store,
    reducerManager: ListReducerManager<T, Error, S, Params>,
    @Inject(LIST_FEATURE_KEYS) featureKeys: string[],
    @Inject(LIST_SERVICES) services: ListService<T, S, Params>[],
    @Optional() @Inject(LIST_NOTIFICATION_SERVICES) notificationServices: ListNotificationService<Error>[]
  ) {
    featureKeys.forEach((featureKey, index) => {
      const listEffects = new ListEffects(
        actions$,
        store,
        reducerManager,
        featureKey,
        services[index],
        notificationServices[index]
      );
      registerEffectsService.registerEffects([listEffects]);
    });
  }

  static config<
    T extends { [key: string]: any },
    Error = unknown,
    S extends { [key: string]: any } = T,
    Params = Record<string, string>
  >(
    config: NgduxListStateModuleConfig<T, Error, S, Params>
  ): ModuleWithProviders<NgduxListStateModule<T, Error, S, Params>> {
    return {
      ngModule: NgduxListStateModule,
      providers: [
        { provide: LIST_SERVICES, multi: true, useClass: config.service },
        {
          provide: LIST_NOTIFICATION_SERVICES,
          multi: true,
          useClass: config.notificationService || NotificationServicePlaceholder
        }
      ]
    };
  }
}
