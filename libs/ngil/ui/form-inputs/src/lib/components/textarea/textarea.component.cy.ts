import { TestBed } from '@angular/core/testing';
import { NgilTextareaComponent } from './textarea.component';

describe(NgilTextareaComponent.name, () => {
  beforeEach(() => {
    TestBed.overrideComponent(NgilTextareaComponent, {
      add: {
        imports: [],
        providers: []
      }
    });
  });

  it('renders', () => {
    cy.mount(NgilTextareaComponent);
  });
});
