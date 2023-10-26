import { TestBed } from '@angular/core/testing';
import { SidebarHeaderComponent } from './sidebar-header.component';

describe('SidebarHeaderComponent', () => {
  let component: SidebarHeaderComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SidebarHeaderComponent]
    });
  });

  beforeEach(() => {
    component = TestBed.inject(SidebarHeaderComponent);
    component.header = {
      logo: '/assets/images/demo_logo.jpg',
      alt: 'Demo Logo',
      name: 'Demo Name',
      shortName: 'Demo'
    };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
