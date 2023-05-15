import { TestBed } from '@angular/core/testing';
import { PropertiesTableComponent } from './properties-table.component';

describe('PropertiesListComponent', () => {
  let component: PropertiesTableComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PropertiesTableComponent]
    });

    component = TestBed.inject(PropertiesTableComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
