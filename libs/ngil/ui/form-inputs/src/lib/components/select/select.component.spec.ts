import { TestBed } from '@angular/core/testing';

import { NgilSelectComponent } from './select.component';

describe('NgilSelectComponent', () => {
  let component: NgilSelectComponent<string>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgilSelectComponent],
    });

    component = TestBed.createComponent(NgilSelectComponent<string>).componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
