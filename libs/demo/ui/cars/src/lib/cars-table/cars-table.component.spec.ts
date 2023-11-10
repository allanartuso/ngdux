import { TestBed } from '@angular/core/testing';
import { CarsTableComponent } from './cars-table.component';

describe('CarsListComponent', () => {
  let component: CarsTableComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CarsTableComponent]
    });

    component = TestBed.inject(CarsTableComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
