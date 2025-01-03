import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UiChartComponent } from 'ui-chart';
import { AgentsModule } from './containers/agents/agents.module';
import { CarsModule } from './containers/cars/cars.module';
import { DashboardComponent } from './containers/dashboard/dashboard.component';

export const dashboardRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: DashboardComponent
      }
    ]
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(dashboardRoutes), CarsModule, AgentsModule, UiChartComponent],
  declarations: [DashboardComponent]
})
export class DemoFeatureDashboardModule {}
