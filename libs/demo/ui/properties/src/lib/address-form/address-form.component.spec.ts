import { TestBed } from '@angular/core/testing';

import { DemoUiPropertiesModule } from '../demo-ui-properties.module';
import { AddressFormComponent } from './address-form.component';

describe('AddressFormComponent', () => {
  let component: AddressFormComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DemoUiPropertiesModule],
    }).compileComponents();

    component = TestBed.createComponent(AddressFormComponent).componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
