import { CommonModule } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { createOutputSpy } from 'cypress/angular';
import { NgilInputComponent } from './input.component';

describe(NgilInputComponent.name, () => {
  beforeEach(() => {
    TestBed.overrideComponent(NgilInputComponent, {
      add: {
        imports: [CommonModule, ReactiveFormsModule],
        providers: []
      }
    });

    cy.mount(NgilInputComponent, {
      imports: [CommonModule, ReactiveFormsModule],
      componentProperties: {
        type: 'text',
        changed: createOutputSpy('onInputChanged')
      }
    });
  });

  it('renders', () => {
    const text = 'My text';
    cy.get('input').type(text);

    cy.get('@onInputChanged').should('have.been.calledWith', text);
  });
});
