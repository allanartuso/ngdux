import { Component } from '@angular/core';
import { PropertyDto } from '@demo/demo/data-model/properties';
import { AbstractTableComponent, NgilTableColumn } from '@ngil/list';

@Component({
  selector: 'demo-properties-table',
  templateUrl: './properties-table.component.html',
  styleUrls: ['./properties-table.component.scss'],
  standalone: false,
})
export class PropertiesTableComponent extends AbstractTableComponent<PropertyDto> {
  columns: NgilTableColumn[] = [
    { key: 'price', name: 'Price' },
    { key: 'size', name: 'Size' },
    { key: 'availableFrom', name: 'Available from' },
  ];
}
