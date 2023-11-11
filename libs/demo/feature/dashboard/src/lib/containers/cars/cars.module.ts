import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DemoDataAccessCarsModule } from '@demo/demo/data-access/cars';
import { DemoUiCarsModule } from '@demo/demo/ui/cars';
import { CarsComponent } from './cars.component';

@NgModule({
  imports: [CommonModule, DemoDataAccessCarsModule.config({ listFeatureKey: ' dashboard.cars' }), DemoUiCarsModule],
  declarations: [CarsComponent],
  exports: [CarsComponent]
})
export class CarsModule {}
