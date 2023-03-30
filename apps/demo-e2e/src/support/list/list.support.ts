import { DEFAULT_PAGE_SIZE, QueryOptionsDto, SortingField } from '@ngdux/data-model-common';

export const listSelectors = {
  nextPageButton: '[aria-label="Next page"]',
  previousPageButton: '[aria-label="Previous page"]',
  firstPageButton: '[aria-label="First page"]',
  checkbox: '[role="checkbox"]',
  columnHeader: '[role="columnheader"]'
};

export function assertPagingCorrectly(alias: string) {
  cy.get(listSelectors.firstPageButton).should('be.disabled');
  cy.get(listSelectors.previousPageButton).should('be.disabled');

  cy.get(listSelectors.nextPageButton).click();
  assertCorrectQueryRequested(alias, 2);

  cy.get(listSelectors.firstPageButton).should('be.enabled');
  cy.get(listSelectors.previousPageButton).should('be.enabled');

  cy.get(listSelectors.nextPageButton).click();
  assertCorrectQueryRequested(alias, 3);

  cy.get(listSelectors.nextPageButton).click();
  assertCorrectQueryRequested(alias, 4);

  cy.get(listSelectors.nextPageButton).should('be.disabled');

  cy.get(listSelectors.previousPageButton).click();
  assertCorrectQueryRequested(alias, 3);

  cy.get(listSelectors.nextPageButton).should('be.enabled');

  cy.get(listSelectors.firstPageButton).click();
  assertCorrectQueryRequested(alias, 1);

  cy.get(listSelectors.firstPageButton).should('be.disabled');
  cy.get(listSelectors.previousPageButton).should('be.disabled');
}

export function assertCorrectQueryRequested(alias: string, page: number, sort?: SortingField[]): void {
  let queryOptions: QueryOptionsDto = {
    page,
    pageSize: DEFAULT_PAGE_SIZE
  };

  if (sort) {
    queryOptions = { ...queryOptions, sort };
  }

  cy.wait(`@${alias}`).its('request.body').should('deep.equal', queryOptions);
}
