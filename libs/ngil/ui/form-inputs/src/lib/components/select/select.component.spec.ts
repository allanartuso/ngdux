import { TestBed } from '@angular/core/testing';

import { ReactiveFormsModule } from '@angular/forms';
import { NgilSelectComponent } from './select.component';

describe('NgilSelectComponent', () => {
  let component: NgilSelectComponent<string>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NgilSelectComponent],
      imports: [ReactiveFormsModule]
    });

    component = TestBed.inject(NgilSelectComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
