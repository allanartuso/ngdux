import { PropertyDto } from '@demo/demo/data-model/properties';
import { createPersistentProperties } from '@demo/demo/data-model/properties/test';
import { listSelectors } from '../list/list.support';

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

export function stubDeleteProperties(deletedProperties: PropertyDto[], indexes: number[]) {
  cy.intercept({ method: 'DELETE', url: propertiesListApiUrls.deleteProperties }, req => {
    req.reply(deletedProperties);
  }).as(propertiesListRoutes.deleteProperties);

  indexes.forEach(index => {
    cy.get(listSelectors.checkbox).eq(index).click();
  });
}
