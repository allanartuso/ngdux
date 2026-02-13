import { CommonModule } from '@angular/common';
import { InjectionToken, NgModule } from '@angular/core';
import { provideDemoDataAccessCarsModule } from '@demo/demo/data-access/cars';
import { CarDto } from '@demo/demo/data-model/cars';
import { DemoUiCarsModule } from '@demo/demo/ui/cars';
import { ErrorDto } from '@ngdux/data-model-common';
import { ListFacade } from '@ngdux/list';
import { CarsComponent } from './cars.component';

export type DashboardCarsListFacade = ListFacade<CarDto, ErrorDto>;
export const DashboardCarsListFacade = new InjectionToken<DashboardCarsListFacade>('DashboardCarsListFacade');

@NgModule({
  imports: [CommonModule, DemoUiCarsModule],
  providers: [provideDemoDataAccessCarsModule('dashboard.cars', DashboardCarsListFacade)],
  declarations: [CarsComponent],
  exports: [CarsComponent]
})
export class CarsModule {}
