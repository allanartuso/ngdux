import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgilSidebarModule } from '@ngil/components';
import { SidebarContainerComponent } from './containers/sidebar-container/sidebar-container.component';

@NgModule({
  imports: [CommonModule, NgilSidebarModule],
  declarations: [SidebarContainerComponent],
  exports: [SidebarContainerComponent],
})
export class DemoFeatureSidebarModule {}
