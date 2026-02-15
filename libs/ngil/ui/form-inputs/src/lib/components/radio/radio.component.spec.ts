import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SgRadioComponent } from './sg-radio.component';

describe('SgRadioComponent', () => {
  let component: SgRadioComponent;
  let fixture: ComponentFixture<SgRadioComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SgRadioComponent],
        teardown: { destroyAfterEach: false },
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SgRadioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
