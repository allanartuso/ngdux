import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgilTableComponent } from '@ngil/list';
import { AgentsTableComponent } from './agents-table/agents-table.component';

@NgModule({
  declarations: [AgentsTableComponent],
  imports: [CommonModule, NgilTableComponent],
  exports: [AgentsTableComponent],
})
export class DemoUiAgentsModule {}
