import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgilTooltipComponent } from './tooltip.component';

describe('TooltipComponent', () => {
  let component: NgilTooltipComponent;
  let fixture: ComponentFixture<NgilTooltipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgilTooltipComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(NgilTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
