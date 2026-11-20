import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NgilRadioComponent } from './radio.component';

describe('NgilRadioComponent', () => {
  let component: NgilRadioComponent;
  let fixture: ComponentFixture<NgilRadioComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [NgilRadioComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgilRadioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
