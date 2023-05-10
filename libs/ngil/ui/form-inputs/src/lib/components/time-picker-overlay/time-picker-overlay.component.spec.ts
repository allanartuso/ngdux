import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgilTimePickerOverlayComponent } from './time-picker-overlay.component';

describe('NgilTimePickerOverlayComponent', () => {
  let component: NgilTimePickerOverlayComponent;
  let fixture: ComponentFixture<NgilTimePickerOverlayComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, NoopAnimationsModule],
      declarations: [NgilTimePickerOverlayComponent],
      schemas: [NO_ERRORS_SCHEMA]
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
