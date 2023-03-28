import { PropertyDto } from '@demo/demo/data-model/properties';
import { createPersistentProperties } from '@demo/demo/data-model/properties/test';
import { DEFAULT_PAGE_SIZE, QueryOptionsDto, SortingField } from '@ngdux/data-model-common';

export const propertiesListSelectors = {
  nextPageButton: '[aria-label="Next page"]',
  previousPageButton: '[aria-label="Previous page"]',
  firstPageButton: '[aria-label="First page"]',
  checkbox: '[role="checkbox"]',
  columnHeader: '[role="columnheader"]'
};

export const propertiesListRoutes = {
  getProperties: 'getProperties',
  deleteProperties: 'deleteProperties'
};

const propertiesListApiUrls = {
  query: '/api/properties/query',
  deleteProperties: '/api/properties/bulk'
};

export function stubProperties(): PropertyDto[] {
  const properties = createPersistentProperties(35);

  cy.intercept({ method: 'POST', url: propertiesListApiUrls.query }, req => {
    const queryOptions = req.body;
    const pageIndex = queryOptions.page - 1;
    const pageSize = queryOptions.pageSize;
    const res = properties.slice(pageIndex * pageSize, pageSize * (pageIndex + 1));
    req.reply(res);
  }).as(propertiesListRoutes.getProperties);

  return properties;
}

export function assertCorrectQueryRequested(page: number, sort?: SortingField[]): void {
  let queryOptions: QueryOptionsDto = {
    page,
    pageSize: DEFAULT_PAGE_SIZE
  };

  if (sort) {
    queryOptions = { ...queryOptions, sort };
  }

  cy.wait(`@${propertiesListRoutes.getProperties}`).its('request.body').should('deep.equal', queryOptions);
}

export function stubDeleteProperties(deletedProperties: PropertyDto[], indexes: number[]) {
  cy.intercept({ method: 'DELETE', url: propertiesListApiUrls.deleteProperties }, req => {
    req.reply(deletedProperties);
  }).as(propertiesListRoutes.deleteProperties);

  indexes.forEach(index => {
    cy.get(propertiesListSelectors.checkbox).eq(index).click();
  });
}
