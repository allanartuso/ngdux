import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedUiListModule } from '@demo/shared/ui-list';
import { CarsTableComponent } from './cars-table/cars-table.component';

@NgModule({
  declarations: [CarsTableComponent],
  imports: [CommonModule, SharedUiListModule],
  exports: [CarsTableComponent]
})
export class DemoUiCarsModule {}
