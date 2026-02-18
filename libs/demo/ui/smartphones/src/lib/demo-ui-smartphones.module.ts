import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgilTableComponent } from '@ngil/list';
import { SmartphonesTableComponent } from './smartphones-table/smartphones-table.component';

@NgModule({
  declarations: [SmartphonesTableComponent],
  imports: [CommonModule, NgilTableComponent],
  exports: [SmartphonesTableComponent],
})
export class DemoUiSmartphonesModule {}
