declare namespace Cypress {
  interface Chainable<Subject> {
    /** Updates the value of an input element. */
    updateInputValue(inputValue: string | number): Chainable<Subject>;
  }
}
