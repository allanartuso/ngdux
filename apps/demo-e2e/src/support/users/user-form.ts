import { Gender, UserDto } from '@demo/demo/data-model/users';

export const userFormSelectors = {
  emailInput: '[label="Email"] input',
  firstNameInput: '[label="First name"] input',
  lastNameInput: '[label="Last name"] input',
  birthTimeInput: '[label="Birth time"] input',
  genderInput: (gender: Gender) => `[data-test=ngil-radio-gender-${gender}]`,
};

export const userFormRoutes = {
  getUser: 'getUser',
  updateUser: 'updateUser',
};

export function stubGetUser(): void {
  cy.intercept('GET', '/api/users/1', {
    fixture: 'user',
  }).as(userFormRoutes.getUser);

  cy.intercept('GET', '/api/cars?*', {
    fixture: 'cars',
  }).as(userFormRoutes.getUser);
}

export function stubUpdateUser(): UserDto {
  const updatedUser: UserDto = {
    id: '1',
    email: 'artuso@gmail.com',
    firstName: 'Allan',
    lastName: 'Artuso',
    birthTime: '13:14:15',
    cars: [],
    gender: Gender.Male,
  };

  cy.intercept('PUT', '/api/users/1', req => {
    expect(req.body).to.deep.equal(updatedUser);

    req.reply({
      body: updatedUser,
    });
  }).as(userFormRoutes.updateUser);

  return updatedUser;
}
