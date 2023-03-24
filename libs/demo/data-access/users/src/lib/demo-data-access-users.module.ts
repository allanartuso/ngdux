import { ModuleWithProviders, NgModule } from '@angular/core';
import { SharedUtilNotificationModule } from '@demo/shared/util-notification';
import { FORM_FEATURE_KEY } from '@ngdux/form';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { UserReducerManager } from './+state/user/user-state.service';
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
  providers: [{ provide: FORM_FEATURE_KEY, useValue: 'user' }, UserReducerManager, UserFacade]
})
export class DemoDataAccessUsersModule {
  static config(featureKey: string): ModuleWithProviders<DemoDataAccessUsersModule> {
    return {
      ngModule: DemoDataAccessUsersModule,
      providers: [{ provide: FORM_FEATURE_KEY, useValue: featureKey }, UserReducerManager]
    };
  }
}
