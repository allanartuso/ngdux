import { ModuleWithProviders, NgModule } from '@angular/core';
import { FORM_FEATURE_KEY } from '@ngdux/form';
import { EffectsModule } from '@ngrx/effects';
import { USER_DEFAULT_FEATURE_KEY, UserReducerManager } from './+state/user/user-state.service';
import { UserEffects } from './+state/user/user.effects';
import { UserFacade } from './+state/user/user.facade';
import { USERS_DEFAULT_FEATURE_KEY, UsersReducerManager } from './+state/users/users-state.service';
import { UsersEffects } from './+state/users/users.effects';
import { UsersFacade } from './+state/users/users.facade';
import { DataAccessUsersModuleConfig, USER_LIST_FEATURE_KEY } from './models/users.model';

@NgModule({
  imports: [EffectsModule.forFeature([UserEffects, UsersEffects])],
  providers: [
    { provide: FORM_FEATURE_KEY, useValue: USER_DEFAULT_FEATURE_KEY },
    { provide: USER_LIST_FEATURE_KEY, useValue: USERS_DEFAULT_FEATURE_KEY },
    UserReducerManager,
    UsersReducerManager,
    UserFacade,
    UsersFacade
  ]
})
export class DemoDataAccessUsersModule {
  static config(config: DataAccessUsersModuleConfig): ModuleWithProviders<DemoDataAccessUsersModule> {
    return {
      ngModule: DemoDataAccessUsersModule,
      providers: [
        { provide: FORM_FEATURE_KEY, useValue: config.formFeatureKey || USER_DEFAULT_FEATURE_KEY },
        { provide: USER_LIST_FEATURE_KEY, useValue: config.listFeatureKey || USERS_DEFAULT_FEATURE_KEY }
      ]
    };
  }
}
