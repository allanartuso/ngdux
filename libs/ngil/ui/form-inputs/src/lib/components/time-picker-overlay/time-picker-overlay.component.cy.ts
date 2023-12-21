import { TestBed } from '@angular/core/testing';
import { NgilTimePickerOverlayComponent } from './time-picker-overlay.component';

describe(NgilTimePickerOverlayComponent.name, () => {
  beforeEach(() => {
    TestBed.overrideComponent(NgilTimePickerOverlayComponent, {
      add: {
        imports: [],
        providers: []
      }
    });
  });

  it('renders', () => {
    cy.mount(NgilTimePickerOverlayComponent);
  });
});
