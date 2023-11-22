import { CarDto } from '@demo/demo/data-model/cars';
import { createPersistentCars } from '@demo/demo/data-model/cars/test';
import { listSelectors } from '../list/list.support';

export const carsListRoutes = {
  getCars: 'getCars',
  deleteCars: 'deleteCars'
};

const carsListApiUrls = {
  get: 'http://localhost:3000/api/cars?*',
  deleteCars: '/api/cars/bulk'
};

export function stubCars(): CarDto[] {
  const cars = createPersistentCars(35);

  cy.intercept({ method: 'GET', url: carsListApiUrls.get }, req => {
    const queryOptions = req.query;
    const pageIndex = +queryOptions['page'] - 1;
    const pageSize = +queryOptions['pageSize'];
    const res = cars.slice(pageIndex * pageSize, pageSize * (pageIndex + 1));
    req.reply(res);
  }).as(carsListRoutes.getCars);

  return cars;
}

export function stubDeleteCars(deletedCars: CarDto[], indexes: number[]) {
  cy.intercept({ method: 'DELETE', url: carsListApiUrls.deleteCars }, req => {
    req.reply(deletedCars);
  }).as(carsListRoutes.deleteCars);

  indexes.forEach(index => {
    cy.get(listSelectors.checkbox).eq(index).click();
  });
}
