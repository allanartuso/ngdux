import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { RouterModule, Routes } from '@angular/router';
import { DemoDataAccessUsersModule } from '@demo/demo/data-access/users';
import { DemoUiUsersModule } from '@demo/demo/ui/users';
import { SharedUiFormModule } from '@demo/shared/ui-form';
import { SharedUiListModule } from '@demo/shared/ui-list';
import { SharedUtilNotificationModule } from '@demo/shared/util-notification';

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
        component: UsersComponent
      },
      {
        path: `new`,
        component: UserComponent
      },
      {
        path: `:id`,
        resolve: [UserResolver],
        component: UserComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(usersRoutes),
    SharedUiFormModule,
    SharedUiListModule,
    MatDialogModule,
    SharedUtilNotificationModule,
    DemoDataAccessUsersModule,
    DemoUiUsersModule
  ],
  declarations: [UserComponent, UsersComponent]
})
export class DemoFeatureUsersModule {}
