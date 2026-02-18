import { Component } from '@angular/core';
import { SmartphoneDto } from '@demo/demo/data-model/smartphones';
import { AbstractTableComponent, NgilTableColumn } from '@ngil/list';

@Component({
  selector: 'demo-smartphones-table',
  templateUrl: './smartphones-table.component.html',
  styleUrls: ['./smartphones-table.component.scss'],
  standalone: false,
})
export class SmartphonesTableComponent extends AbstractTableComponent<SmartphoneDto> {
  columns: NgilTableColumn[] = [
    { key: 'brand', name: 'Brand' },
    { key: 'model', name: 'Model' },
    { key: 'color', name: 'Color' },
    { key: 'price', name: 'Price' },
  ];
}
