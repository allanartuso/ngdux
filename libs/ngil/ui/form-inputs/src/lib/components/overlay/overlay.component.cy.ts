import { TestBed } from '@angular/core/testing';
import { NgilOverlayComponent } from './overlay.component';

describe(NgilOverlayComponent.name, () => {
  beforeEach(() => {
    TestBed.overrideComponent(NgilOverlayComponent, {
      add: {
        imports: [],
        providers: []
      }
    });
  });

  it('renders', () => {
    cy.mount(NgilOverlayComponent, {
      componentProperties: {
        overwriteConfig: {}
      }
    });
  });
});
