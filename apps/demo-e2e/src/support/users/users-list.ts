import { UserDto } from '@demo/demo/data-model/users';
import { createPersistentUsers } from '@demo/demo/data-model/users/test';
import { listSelectors } from '../list/list.support';

export const usersListRoutes = {
  getUsers: 'getUsers',
  deleteUsers: 'deleteUsers'
};

const usersListApiUrls = {
  query: '/api/users/query',
  deleteUsers: '/api/users/bulk'
};

export function stubUsers(): UserDto[] {
  const users = createPersistentUsers(35);

  cy.intercept({ method: 'POST', url: usersListApiUrls.query }, req => {
    const queryOptions = req.body;
    const pageIndex = queryOptions.page - 1;
    const pageSize = queryOptions.pageSize;
    const res = users.slice(pageIndex * pageSize, pageSize * (pageIndex + 1));
    req.reply(res);
  }).as(usersListRoutes.getUsers);

  return users;
}

export function stubDeleteUsers(deletedUsers: UserDto[], indexes: number[]) {
  cy.intercept({ method: 'DELETE', url: usersListApiUrls.deleteUsers }, req => {
    req.reply(deletedUsers);
  }).as(usersListRoutes.deleteUsers);

  indexes.forEach(index => {
    cy.get(listSelectors.checkbox).eq(index).click();
  });
}
