import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { NgilTextareaComponent } from './textarea.component';

describe('NgilTextareaComponent', () => {
  let component: NgilTextareaComponent;
  let fixture: ComponentFixture<NgilTextareaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NgilTextareaComponent],
      imports: [ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(NgilTextareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
