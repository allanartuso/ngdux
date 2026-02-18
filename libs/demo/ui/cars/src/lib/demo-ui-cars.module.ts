import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgilTableComponent } from '@ngil/list';
import { CarsTableComponent } from './cars-table/cars-table.component';

@NgModule({
  declarations: [CarsTableComponent],
  imports: [CommonModule, NgilTableComponent],
  exports: [CarsTableComponent],
})
export class DemoUiCarsModule {}
