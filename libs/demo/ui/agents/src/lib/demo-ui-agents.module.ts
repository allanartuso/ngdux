import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedUiListModule } from '@demo/shared/ui-list';
import { AgentsTableComponent } from './agents-table/agents-table.component';

@NgModule({
  declarations: [AgentsTableComponent],
  imports: [CommonModule, SharedUiListModule],
  exports: [AgentsTableComponent]
})
export class DemoUiAgentsModule {}
