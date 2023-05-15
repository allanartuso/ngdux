import { TestBed } from '@angular/core/testing';

import { AddressFormComponent } from './address-form.component';

describe('AddressFormComponent', () => {
  let component: AddressFormComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AddressFormComponent]
    }).compileComponents();

    component = TestBed.inject(AddressFormComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
