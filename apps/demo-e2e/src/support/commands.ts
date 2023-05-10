// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject> {
    login(email: string, password: string): void;

    /**
     * Updates value of the given input
     *
     * @param value the input value.
     *
     * @example cy.get('input').updateInputValue('new value')
     */
    updateInputValue(inputValue: string | number): Chainable<JQuery<HTMLElement>>;
  }
}
//
// -- This is a parent command --
Cypress.Commands.add('login', (email, password) => {
  console.log('Custom command example: Login', email, password);
});
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('updateInputValue', { prevSubject: 'element' }, (subject, inputValue) => {
  cy.wrap(subject).scrollIntoView();
  cy.wrap(subject).should('be.visible').clear();
  return cy.wrap(subject).type(inputValue.toString());
});
