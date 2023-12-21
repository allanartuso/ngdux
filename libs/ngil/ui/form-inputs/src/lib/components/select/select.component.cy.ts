import { TestBed } from '@angular/core/testing';
import { NgilSelectComponent } from './select.component';

describe(NgilSelectComponent.name, () => {
  beforeEach(() => {
    TestBed.overrideComponent(NgilSelectComponent, {
      add: {
        imports: [],
        providers: []
      }
    });
  });

  it('renders', () => {
    cy.mount(NgilSelectComponent, {
      componentProperties: {
        multiple: false,
        items: []
      }
    });
  });
});
