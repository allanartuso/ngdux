import { TestBed } from '@angular/core/testing';
import { AgentsTableComponent } from './agents-table.component';

describe('AgentsListComponent', () => {
  let component: AgentsTableComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AgentsTableComponent]
    });

    component = TestBed.inject(AgentsTableComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
