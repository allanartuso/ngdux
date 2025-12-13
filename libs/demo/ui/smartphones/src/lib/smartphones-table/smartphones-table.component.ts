import { Component } from '@angular/core';
import { SmartphoneDto } from '@demo/demo/data-model/smartphones';
import { TableColumn } from '@demo/shared/ui-list';
import { AbstractTableComponent } from '@ngil/list';

@Component({
    selector: 'demo-smartphones-table',
    templateUrl: './smartphones-table.component.html',
    styleUrls: ['./smartphones-table.component.scss'],
    standalone: false
})
export class SmartphonesTableComponent extends AbstractTableComponent<SmartphoneDto> {
  columns: TableColumn[] = [
    { key: 'brand', name: 'Brand' },
    { key: 'model', name: 'Model' },
    { key: 'color', name: 'Color' },
    { key: 'price', name: 'Price' }
  ];
}
