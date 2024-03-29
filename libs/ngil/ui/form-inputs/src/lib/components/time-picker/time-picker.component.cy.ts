import { TestBed } from '@angular/core/testing';
import { NgilTimePickerComponent } from './time-picker.component';

describe(NgilTimePickerComponent.name, () => {
  beforeEach(() => {
    TestBed.overrideComponent(NgilTimePickerComponent, {
      add: {
        imports: [],
        providers: []
      }
    });
  });

  it('renders', () => {
    cy.mount(NgilTimePickerComponent);
  });
});
