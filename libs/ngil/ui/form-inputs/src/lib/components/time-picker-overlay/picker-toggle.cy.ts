import { TestBed } from '@angular/core/testing';
import { PickerToggleComponent } from './picker-toggle';

describe(PickerToggleComponent.name, () => {
  beforeEach(() => {
    TestBed.overrideComponent(PickerToggleComponent, {
      add: {
        imports: [],
        providers: []
      }
    });
  });

  it('renders', () => {
    cy.mount(PickerToggleComponent);
  });
});
