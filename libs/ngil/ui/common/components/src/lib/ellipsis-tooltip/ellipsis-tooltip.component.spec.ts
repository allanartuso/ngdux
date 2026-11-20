import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgilEllipsisTooltipComponent } from './ellipsis-tooltip.component';

describe('NgilEllipsisTooltipComponent', () => {
  let component: NgilEllipsisTooltipComponent;
  let fixture: ComponentFixture<NgilEllipsisTooltipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgilEllipsisTooltipComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NgilEllipsisTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
