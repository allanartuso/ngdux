import { PropertyDto } from '@demo/demo/data-model/properties';
import { SortingDirection, SortingField } from '@ngdux/data-model-common';
import {
  assertCorrectQueryRequested,
  propertiesListRoutes,
  propertiesListSelectors,
  stubDeleteProperties,
  stubProperties
} from '../../support/properties/properties-list';

describe('Properties list', () => {
  let properties: PropertyDto[];

  beforeEach(() => {
    properties = stubProperties();

    cy.visit('/properties');
    assertCorrectQueryRequested(1);
    assertCorrectQueryRequested(2);
  });

  it('paging through the table', () => {
    cy.get(propertiesListSelectors.firstPageButton).should('be.disabled');
    cy.get(propertiesListSelectors.previousPageButton).should('be.disabled');

    cy.get(propertiesListSelectors.nextPageButton).click();
    assertCorrectQueryRequested(3);

    cy.get(propertiesListSelectors.firstPageButton).should('be.enabled');
    cy.get(propertiesListSelectors.previousPageButton).should('be.enabled');

    cy.get(propertiesListSelectors.nextPageButton).click();
    assertCorrectQueryRequested(4);

    cy.get(propertiesListSelectors.nextPageButton).click();

    cy.get(propertiesListSelectors.nextPageButton).should('be.disabled');

    cy.get(propertiesListSelectors.previousPageButton).click();
    assertCorrectQueryRequested(2);

    cy.get(propertiesListSelectors.nextPageButton).should('be.enabled');

    cy.get(propertiesListSelectors.firstPageButton).click();
    assertCorrectQueryRequested(1);
    assertCorrectQueryRequested(2);

    cy.get(propertiesListSelectors.firstPageButton).should('be.disabled');
    cy.get(propertiesListSelectors.previousPageButton).should('be.disabled');
  });

  it('request sort', () => {
    cy.get(propertiesListSelectors.columnHeader).contains('Size').click();
    const sort: SortingField[] = [{ field: 'size', direction: SortingDirection.ASCENDING }];
    assertCorrectQueryRequested(1, sort);
    assertCorrectQueryRequested(2, sort);
  });

  it('delete properties', () => {
    const indexes = [0, 1];
    const deletedProperties = indexes.map(index => properties[index]);

    stubDeleteProperties(deletedProperties, indexes);

    cy.get('button').contains('delete').click();
    cy.get('button').contains('Confirm').click();

    cy.wait(`@${propertiesListRoutes.deleteProperties}`)
      .its('request.body')
      .should(
        'deep.equal',
        deletedProperties.map(user => user.id)
      );
  });
});
