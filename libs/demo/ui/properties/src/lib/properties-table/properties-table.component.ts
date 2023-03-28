import { Component, EventEmitter, Output } from '@angular/core';
import { PropertyDto } from '@demo/demo/data-model/properties';
import { TableColumn } from '@demo/shared/ui-list';
import { AbstractTableComponent } from '@ngil/ui-list';

@Component({
  selector: 'demo-properties-table',
  templateUrl: './properties-table.component.html',
  styleUrls: ['./properties-table.component.scss']
})
export class PropertiesTableComponent extends AbstractTableComponent<PropertyDto> {
  @Output() cellSelected = new EventEmitter<string>();

  columns: TableColumn[] = [
    { key: 'price', name: 'Price' },
    { key: 'size', name: 'Size' },
    { key: 'availableFrom', name: 'Available from' }
  ];

  onCellSelected(user: PropertyDto): void {
    this.cellSelected.emit(user.id);
  }
}
