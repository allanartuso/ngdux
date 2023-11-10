import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DemoDataAccessCarsModule } from '@demo/demo/data-access/cars';
import { CarsComponent } from './containers/cars/cars.component';
import { CarsResolver } from './resolvers/cars.resolver';

export const carsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        resolve: [CarsResolver],
        component: CarsComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(carsRoutes),
    // SharedUiListModule,
    // SharedUtilNotificationModule,
    DemoDataAccessCarsModule.config({ listFeatureKey: 'my-exclusive-cars' })
    // DemoUiCarsModule
  ],
  declarations: [CarsComponent],
  providers: [CarsResolver]
})
export class DemoFeatureCarsModule {}
