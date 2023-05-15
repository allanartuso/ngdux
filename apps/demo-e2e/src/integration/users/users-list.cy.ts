import { UserDto } from '@demo/demo/data-model/users';
import { SortingDirection, SortingField } from '@ngdux/data-model-common';
import { assertCorrectGetRequested, assertPagingCorrectly, listSelectors } from '../../support/list/list.support';
import { stubDeleteUsers, stubUsers, usersListRoutes } from '../../support/users/users-list';

describe('Users list', () => {
  let users: UserDto[];

  beforeEach(() => {
    users = stubUsers();

    cy.visit('/users');
    assertCorrectGetRequested(usersListRoutes.getUsers, 1);
  });

  it('paging through the table', () => {
    assertPagingCorrectly(usersListRoutes.getUsers);
  });

  it('request sort', () => {
    cy.get(listSelectors.columnHeader).contains('Email').click();
    const sort: SortingField[] = [{ field: 'email', direction: SortingDirection.ASCENDING }];
    assertCorrectGetRequested(usersListRoutes.getUsers, 1, sort);
  });

  it('delete users', () => {
    const indexes = [0, 1];
    const deletedUsers = indexes.map(index => users[index]);

    stubDeleteUsers(deletedUsers, indexes);

    cy.get('button').contains('delete').click({ force: true });
    cy.get('button').contains('Confirm').click();

    cy.wait(`@${usersListRoutes.deleteUsers}`)
      .its('request.body')
      .should(
        'deep.equal',
        deletedUsers.map(user => user.id)
      );
  });
});
