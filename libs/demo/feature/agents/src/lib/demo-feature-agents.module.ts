import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DemoDataAccessAgentsModule } from '@demo/demo/data-access/agents';
import { DemoUiAgentsModule } from '@demo/demo/ui/agents';
import { AgentsComponent } from './containers/agents/agents.component';
import { AgentsResolver } from './resolvers/agents.resolver';

export const agentsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        resolve: [AgentsResolver],
        component: AgentsComponent
      }
    ]
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(agentsRoutes), DemoDataAccessAgentsModule.config(), DemoUiAgentsModule],
  declarations: [AgentsComponent],
  providers: [AgentsResolver]
})
export class DemoFeatureAgentsModule {}
