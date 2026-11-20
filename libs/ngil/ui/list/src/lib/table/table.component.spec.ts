import { TestBed } from '@angular/core/testing';
import { NgilTableComponent } from './table.component';

describe('NgilTableComponent', () => {
  let component: NgilTableComponent<unknown>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgilTableComponent],
    }).compileComponents();

    component = TestBed.createComponent(NgilTableComponent).componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
