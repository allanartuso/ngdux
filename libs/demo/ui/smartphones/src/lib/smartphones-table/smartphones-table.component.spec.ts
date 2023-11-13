import { TestBed } from '@angular/core/testing';
import { SmartphonesTableComponent } from './smartphones-table.component';

describe('SmartphonesListComponent', () => {
  let component: SmartphonesTableComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SmartphonesTableComponent]
    });

    component = TestBed.inject(SmartphonesTableComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
