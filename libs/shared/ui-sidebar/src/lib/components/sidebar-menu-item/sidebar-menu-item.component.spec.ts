import { TestBed } from '@angular/core/testing';
import { MenuItem } from '../../models/sidebar.models';
import { SidebarMenuItemComponent } from './sidebar-menu-item.component';

describe('SidebarMenuItemComponent', () => {
  let component: SidebarMenuItemComponent;

  const testMenuItem: MenuItem = {
    name: 'testName'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SidebarMenuItemComponent]
    });
  });

  beforeEach(() => {
    component = TestBed.inject(SidebarMenuItemComponent);
    component.menuItem = { name: 'testName' };
  });

  it('emit event when hovering on a menu item.', () => {
    jest.spyOn(component.menuItemHoveredOn, 'emit');

    component.onMenuItemHoveredOn(testMenuItem);

    expect(component.menuItemHoveredOn.emit).toHaveBeenCalledWith(testMenuItem);
  });

  it('emit event when hovering off a menu item.', () => {
    jest.spyOn(component.menuItemHoveredOff, 'emit');

    component.onMenuItemHoveredOff(testMenuItem);

    expect(component.menuItemHoveredOff.emit).toHaveBeenCalledWith(testMenuItem);
  });

  it('emit click event when clicking a menu item.', () => {
    jest.spyOn(component.menuItemClicked, 'emit');

    component.onMenuItemClicked(testMenuItem);

    expect(component.menuItemClicked.emit).toHaveBeenCalledWith(testMenuItem);
  });

  it('emit toggle event when toggling a menu group.', () => {
    jest.spyOn(component.menuItemToggled, 'emit');

    component.onMenuItemToggled(testMenuItem);

    expect(component.menuItemToggled.emit).toHaveBeenCalledWith(testMenuItem);
  });
});
