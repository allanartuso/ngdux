import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DemoDataAccessAgentsModule } from '@demo/demo/data-access/agents';
import { DemoUiAgentsModule } from '@demo/demo/ui/agents';
import { AgentsComponent } from './agents.component';

@NgModule({
  imports: [
    CommonModule,
    DemoDataAccessAgentsModule.config({ listFeatureKey: 'dashboard.agents' }),
    DemoUiAgentsModule
  ],
  declarations: [AgentsComponent],
  exports: [AgentsComponent]
})
export class AgentsModule {}
