import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactiveFormsModule } from '@angular/forms';
import { NgilSelectComponent } from './select.component';

describe('NgilSelectComponent', () => {
  let component: NgilSelectComponent<string>;
  let fixture: ComponentFixture<NgilSelectComponent<string>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NgilSelectComponent],
      imports: [ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(NgilSelectComponent<string>);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
