import { Component } from '@angular/core';
import { CarDto } from '@demo/demo/data-model/cars';
import { AbstractTableComponent, NgilTableColumn } from '@ngil/list';

@Component({
  selector: 'demo-cars-table',
  templateUrl: './cars-table.component.html',
  styleUrls: ['./cars-table.component.scss'],
  standalone: false,
})
export class CarsTableComponent extends AbstractTableComponent<CarDto> {
  columns: NgilTableColumn[] = [
    { key: 'price', name: 'Price' },
    { key: 'year', name: 'Year' },
    { key: 'model', name: 'Model' },
    { key: 'make', name: 'Make' },
  ];
}
