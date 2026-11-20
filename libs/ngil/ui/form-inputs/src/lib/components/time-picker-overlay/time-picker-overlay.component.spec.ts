import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NgilTimePickerOverlayComponent } from './time-picker-overlay.component';

describe('NgilTimePickerOverlayComponent', () => {
  let component: NgilTimePickerOverlayComponent;
  let fixture: ComponentFixture<NgilTimePickerOverlayComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [NgilTimePickerOverlayComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgilTimePickerOverlayComponent);
    component = fixture.componentInstance;
  });

  it('creates', () => {
    expect(component).toBeTruthy();
  });
});
