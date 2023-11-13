import { TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';

describe('CarsComponent', () => {
  let component: DashboardComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DashboardComponent]
    });
  });

  beforeEach(() => {
    component = TestBed.inject(DashboardComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
