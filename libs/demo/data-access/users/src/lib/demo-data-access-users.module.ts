import { ModuleWithProviders, NgModule } from '@angular/core';
import { DemoDataAccessCommonListModule } from '@demo/shared/data-access/list';
import { FORM_FEATURE_KEY } from '@ngdux/form';
import { LIST_FEATURE_KEY } from '@ngdux/list';
import { EffectsModule } from '@ngrx/effects';
import { USER_DEFAULT_FEATURE_KEY, UserReducerManager } from './+state/user/user-state.service';
import { UserEffects } from './+state/user/user.effects';
import { UserFacade } from './+state/user/user.facade';
import { DataAccessUsersModuleConfig, USERS_DEFAULT_FEATURE_KEY } from './models/users.model';
import { UsersService } from './services/users.service';

@NgModule({
  imports: [
    EffectsModule.forFeature([UserEffects]),
    DemoDataAccessCommonListModule.config(UsersService, { listFeatureKey: USERS_DEFAULT_FEATURE_KEY })
  ],
  providers: [{ provide: FORM_FEATURE_KEY, useValue: USER_DEFAULT_FEATURE_KEY }, UserReducerManager, UserFacade]
})
export class DemoDataAccessUsersModule {
  static config(config: DataAccessUsersModuleConfig): ModuleWithProviders<DemoDataAccessUsersModule> {
    return {
      ngModule: DemoDataAccessUsersModule,
      providers: [
        { provide: FORM_FEATURE_KEY, useValue: config.formFeatureKey || USER_DEFAULT_FEATURE_KEY },
        { provide: LIST_FEATURE_KEY, useValue: config.listFeatureKey || USERS_DEFAULT_FEATURE_KEY }
      ]
    };
  }
}
