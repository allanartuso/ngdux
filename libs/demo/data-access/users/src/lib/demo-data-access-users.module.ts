import { InjectionToken } from '@angular/core';
import { CreateUserDto, UserDto } from '@demo/demo/data-model/users';
import { NotificationService } from '@demo/shared/common/util-notification';
import { ErrorDto } from '@ngdux/data-model-common';
import { FormFacade, provideFormState } from '@ngdux/form';
import { ListFacade, provideListState } from '@ngdux/list';
import { UserService } from './services/user.service';

export const USER_DEFAULT_FEATURE_KEY = 'user';
export const USERS_DEFAULT_FEATURE_KEY = 'users';

export type UserFormFacade = FormFacade<UserDto, ErrorDto, CreateUserDto>;
export const UserFormFacade = new InjectionToken<UserFormFacade>('UserFormFacade');

export function provideDemoDataAccessUserModule(
  featureKey: string = USER_DEFAULT_FEATURE_KEY,
  facadeToken: InjectionToken<UserFormFacade> = UserFormFacade
) {
  return provideFormState(featureKey, facadeToken, UserService, NotificationService);
}

export type UsersListFacade = ListFacade<UserDto, ErrorDto>;
export const UsersListFacade = new InjectionToken<UsersListFacade>('UsersListFacade');

export function provideDemoDataAccessUsersModule(
  featureKey: string = USERS_DEFAULT_FEATURE_KEY,
  facadeToken: InjectionToken<UsersListFacade> = UsersListFacade
) {
  return provideListState(featureKey, facadeToken, UserService, NotificationService);
}
