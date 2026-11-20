import { TestBed } from '@angular/core/testing';
import { NgilPickerToggleComponent } from './picker-toggle';

describe(NgilPickerToggleComponent.name, () => {
  beforeEach(() => {
    TestBed.overrideComponent(NgilPickerToggleComponent, {
      add: {
        imports: [],
        providers: [],
      },
    });
  });

  it('renders', () => {
    cy.mount(NgilPickerToggleComponent);
  });
});
