import { SmartphoneDto } from '@demo/demo/data-model/smartphones';
import { createPersistentSmartphones } from '@demo/demo/data-model/smartphones/test';
import { listSelectors } from '../list/list.support';

export const smartphonesListRoutes = {
  getSmartphones: 'getSmartphones',
  deleteSmartphones: 'deleteSmartphones'
};

const smartphonesListApiUrls = {
  get: 'http://localhost:3000/api/smartphones?*',
  deleteSmartphones: '/api/smartphones/bulk'
};

export function stubSmartphones(): SmartphoneDto[] {
  const smartphones = createPersistentSmartphones(35);

  cy.intercept({ method: 'GET', url: smartphonesListApiUrls.get }, req => {
    const queryOptions = req.query;
    const pageIndex = +queryOptions['page'] - 1;
    const pageSize = +queryOptions['pageSize'];
    const res = smartphones.slice(pageIndex * pageSize, pageSize * (pageIndex + 1));
    req.reply(res);
  }).as(smartphonesListRoutes.getSmartphones);

  return smartphones;
}

export function stubDeleteSmartphones(deletedSmartphones: SmartphoneDto[], indexes: number[]) {
  cy.intercept({ method: 'DELETE', url: smartphonesListApiUrls.deleteSmartphones }, req => {
    req.reply(deletedSmartphones);
  }).as(smartphonesListRoutes.deleteSmartphones);

  indexes.forEach(index => {
    cy.get(listSelectors.checkbox).eq(index).click();
  });
}
