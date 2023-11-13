import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedUiListModule } from '@demo/shared/ui-list';
import { SmartphonesTableComponent } from './smartphones-table/smartphones-table.component';

@NgModule({
  declarations: [SmartphonesTableComponent],
  imports: [CommonModule, SharedUiListModule],
  exports: [SmartphonesTableComponent]
})
export class DemoUiSmartphonesModule {}
