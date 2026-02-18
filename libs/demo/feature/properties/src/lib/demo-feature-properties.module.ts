import { CommonModule } from '@angular/common';
import { InjectionToken, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import {
  provideDemoDataAccessPropertiesModule,
  provideDemoDataAccessPropertyModule,
} from '@demo/demo/data-access/properties';
import { provideDemoDataAccessUsersModule } from '@demo/demo/data-access/users';
import { UserDto } from '@demo/demo/data-model/users';
import { DemoUiPropertiesModule } from '@demo/demo/ui/properties';
import { SharedUtilNotificationModule } from '@demo/shared/common/util-notification';
import { SharedUiFormModule } from '@demo/shared/ui-form';
import { ErrorDto } from '@ngdux/data-model-common';
import { ListFacade } from '@ngdux/list';
import { NgilTableComponent } from '@ngil/list';
import { PropertiesComponent } from './containers/properties/properties.component';
import { PropertyComponent } from './containers/property/property.component';
import { PropertiesResolver } from './resolvers/properties.resolver';
import { PropertyResolver } from './resolvers/property.resolver';

export const usersRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        resolve: [PropertiesResolver],
        component: PropertiesComponent,
      },
      {
        path: `new`,
        resolve: [PropertyResolver],
        component: PropertyComponent,
      },
      {
        path: `:id`,
        resolve: [PropertyResolver],
        component: PropertyComponent,
      },
    ],
  },
];

export type PropertyUsersListFacade = ListFacade<UserDto, ErrorDto>;
export const PropertyUsersListFacade = new InjectionToken<PropertyUsersListFacade>('PropertyUsersListFacade');

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(usersRoutes),
    SharedUiFormModule,
    NgilTableComponent,
    SharedUtilNotificationModule,
    DemoUiPropertiesModule,
  ],
  declarations: [PropertyComponent, PropertiesComponent],
  providers: [
    PropertyResolver,
    PropertiesResolver,
    provideDemoDataAccessPropertyModule(),
    provideDemoDataAccessPropertiesModule(),
    provideDemoDataAccessUsersModule('property.users', PropertyUsersListFacade),
  ],
})
export class DemoFeaturePropertiesModule {}
