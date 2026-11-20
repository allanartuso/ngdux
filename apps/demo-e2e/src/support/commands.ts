Cypress.Commands.add('updateInputValue', { prevSubject: 'element' }, (subject, inputValue) => {
  cy.wrap(subject).scrollIntoView();
  cy.wrap(subject).should('be.visible').clear();
  return cy.wrap(subject).type(inputValue.toString());
});
