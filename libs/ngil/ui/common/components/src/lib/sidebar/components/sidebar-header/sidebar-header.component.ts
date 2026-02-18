import { Component, Input } from '@angular/core';
import { MenuHeader } from '../../models/sidebar.models';

@Component({
  selector: 'ngil-sidebar-header',
  templateUrl: './sidebar-header.component.html',
  styleUrls: ['./sidebar-header.component.scss'],
  standalone: false,
})
export class SidebarHeaderComponent {
  @Input() expanded = false;
  @Input() header?: MenuHeader;
}
