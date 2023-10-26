import { TestBed } from '@angular/core/testing';
import { TableComponent } from './table.component';

describe('TableComponent', () => {
  let component: TableComponent<unknown>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TableComponent]
    }).compileComponents();

    component = TestBed.inject(TableComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
