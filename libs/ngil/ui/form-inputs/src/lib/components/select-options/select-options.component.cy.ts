import { TestBed } from '@angular/core/testing';
import { NgilSelectOptionsComponent } from './select-options.component';

describe(NgilSelectOptionsComponent.name, () => {
  beforeEach(() => {
    TestBed.overrideComponent(NgilSelectOptionsComponent, {
      add: {
        imports: [],
        providers: []
      }
    });
  });

  it('renders', () => {
    cy.mount(NgilSelectOptionsComponent, {
      componentProperties: {
        selectedItems: null,
        items: [],
        multiple: false,
        display: false
      }
    });
  });
});
