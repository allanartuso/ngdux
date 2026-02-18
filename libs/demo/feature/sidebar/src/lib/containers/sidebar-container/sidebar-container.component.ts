import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MenuHeader, MenuItem } from '@ngil/components';
import { BODY_ITEMS } from '../../models/sidebar-body.model';
import { FOOTER_ITEMS } from '../../models/sidebar-footer.model';
import { HEADER_DATA } from '../../models/sidebar-header.model';

@Component({
  selector: 'demo-sidebar-container',
  templateUrl: './sidebar-container.component.html',
  styleUrls: ['./sidebar-container.component.scss'],
  standalone: false,
})
export class SidebarContainerComponent {
  private readonly router = inject(Router);

  bodyItems: MenuItem[] = BODY_ITEMS;
  footerItems: MenuItem[] = FOOTER_ITEMS;
  header: MenuHeader = HEADER_DATA;

  onMenuItemClicked(item: MenuItem): void {
    this.router.navigate([item.link]);
  }
}
