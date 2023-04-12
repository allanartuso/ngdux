import { ModuleWithProviders, NgModule } from '@angular/core';
import { UsersFacade } from '@demo/demo/data-access/users';
import { SharedUtilNotificationModule } from '@demo/shared/util-notification';
import { FORM_FEATURE_KEY } from '@ngdux/form';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { UserReducerManager, USER_DEFAULT_FEATURE_KEY } from './+state/user/user-state.service';
import { UserEffects } from './+state/user/user.effects';
import { UserFacade } from './+state/user/user.facade';
import { UsersEffects } from './+state/users/users.effects';
import { usersReducer, USERS_FEATURE_KEY } from './+state/users/users.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(USERS_FEATURE_KEY, usersReducer),
    EffectsModule.forFeature([UserEffects, UsersEffects]),
    SharedUtilNotificationModule
  ],
  providers: [
    { provide: FORM_FEATURE_KEY, useValue: USER_DEFAULT_FEATURE_KEY },
    UserReducerManager,
    UserFacade,
    UsersFacade
  ]
})
export class DemoDataAccessUsersModule {
  static config(featureKey: string): ModuleWithProviders<DemoDataAccessUsersModule> {
    return {
      ngModule: DemoDataAccessUsersModule,
      providers: [{ provide: FORM_FEATURE_KEY, useValue: featureKey }, UserReducerManager]
    };
  }
}
