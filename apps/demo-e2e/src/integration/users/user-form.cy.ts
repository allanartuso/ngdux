import { UserDto } from '@demo/demo/data-model/users';
import { formSelectors } from '../../support/form/form';
import { stubGetUser, stubUpdateUser, userFormSelectors } from '../../support/users/user-form';

describe('User form', () => {
  let updatedUser: UserDto;

  beforeEach(() => {
    stubGetUser();
    updatedUser = stubUpdateUser();
    cy.visit('/users/1');
  });

  it('updates the form', () => {
    cy.get(userFormSelectors.emailInput).updateInputValue(updatedUser.email);
    cy.get(userFormSelectors.firstNameInput).updateInputValue(updatedUser.firstName);
    cy.get(userFormSelectors.lastNameInput).updateInputValue(updatedUser.lastName);
    cy.get(userFormSelectors.birthTimeInput).updateInputValue(updatedUser.birthTime);
    cy.get(formSelectors.submitButton).click();
  });
});
