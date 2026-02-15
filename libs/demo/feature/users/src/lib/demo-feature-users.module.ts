import { CommonModule } from '@angular/common';
import { InjectionToken, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { provideDemoDataAccessUserModule, provideDemoDataAccessUsersModule } from '@demo/demo/data-access/users';
import { DemoUiUsersModule } from '@demo/demo/ui/users';
import { SharedUtilNotificationModule } from '@demo/shared/common/util-notification';
import { SharedUiFormModule } from '@demo/shared/ui-form';
import { SharedUiListModule } from '@demo/shared/ui-list';

import { provideDemoDataAccessCarsModule } from '@demo/demo/data-access/cars';
import { CarDto } from '@demo/demo/data-model/cars';
import { ErrorDto } from '@ngdux/data-model-common';
import { ListFacade } from '@ngdux/list';
import { UserComponent } from './containers/user/user.component';
import { UsersComponent } from './containers/users/users.component';
import { UserResolver } from './resolvers/user.resolver';
import { UsersResolver } from './resolvers/users.resolver';

export const usersRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        resolve: [UsersResolver],
        component: UsersComponent,
      },
      {
        path: `new`,
        resolve: [UserResolver],
        component: UserComponent,
      },
      {
        path: `:id`,
        resolve: [UserResolver],
        component: UserComponent,
      },
    ],
  },
];

export type UserCarsListFacade = ListFacade<CarDto, ErrorDto>;
export const UserCarsListFacade = new InjectionToken<UserCarsListFacade>('UserCarsListFacade');

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(usersRoutes),
    SharedUiFormModule,
    SharedUiListModule,
    SharedUtilNotificationModule,
    DemoUiUsersModule,
  ],
  declarations: [UsersComponent],
  providers: [
    UserResolver,
    UsersResolver,
    provideDemoDataAccessUserModule(),
    provideDemoDataAccessUsersModule(),
    provideDemoDataAccessCarsModule('user.cars', UserCarsListFacade),
  ],
})
export class DemoFeatureUsersModule {}
