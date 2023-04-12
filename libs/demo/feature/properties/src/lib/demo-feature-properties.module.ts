import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { DemoDataAccessPropertiesModule } from '@demo/demo/data-access/properties';
import { DemoDataAccessUsersModule } from '@demo/demo/data-access/users';
import { DemoUiPropertiesModule } from '@demo/demo/ui/properties';
import { SharedUiFormModule } from '@demo/shared/ui-form';
import { SharedUiListModule } from '@demo/shared/ui-list';
import { SharedUtilNotificationModule } from '@demo/shared/util-notification';
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
        component: PropertiesComponent
      },
      {
        path: `new`,
        component: PropertyComponent
      },
      {
        path: `:id`,
        resolve: [PropertyResolver],
        component: PropertyComponent
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
    SharedUtilNotificationModule,
    DemoDataAccessPropertiesModule,
    DemoDataAccessUsersModule,
    DemoUiPropertiesModule
  ],
  declarations: [PropertyComponent, PropertiesComponent],
  providers: [PropertyResolver, PropertiesResolver]
})
export class DemoFeaturePropertiesModule {}
