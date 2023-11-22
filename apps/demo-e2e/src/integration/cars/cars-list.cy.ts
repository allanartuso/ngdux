import { CarDto } from '@demo/demo/data-model/cars';
import { SortingDirection, SortingField } from '@ngdux/data-model-common';
import { carsListRoutes, stubCars } from '../../support/cars/cars-list';
import { assertCorrectGetRequested, assertPagingCorrectly, listSelectors } from '../../support/list/list.support';

describe('Cars list', () => {
  let cars: CarDto[];

  beforeEach(() => {
    cars = stubCars();

    cy.visit('/cars');
    assertCorrectGetRequested(carsListRoutes.getCars, 1);
  });

  it('paging through the table', () => {
    assertPagingCorrectly(carsListRoutes.getCars);
  });

  it('request sort', () => {
    cy.get(listSelectors.columnHeader).contains('Year').click();
    const sort: SortingField[] = [{ field: 'year', direction: SortingDirection.ASCENDING }];
    assertCorrectGetRequested(carsListRoutes.getCars, 1, sort);
  });

  it('cannot delete cars', () => {
    cy.get('button').contains('delete').should('not.exist');
  });
});
