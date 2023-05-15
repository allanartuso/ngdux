import { PropertyDto } from '@demo/demo/data-model/properties';
import { SortingDirection, SortingField } from '@ngdux/data-model-common';
import { assertCorrectGetRequested, assertPagingCorrectly, listSelectors } from '../../support/list/list.support';
import { propertiesListRoutes, stubDeleteProperties, stubProperties } from '../../support/properties/properties-list';

describe('Properties list', () => {
  let properties: PropertyDto[];

  beforeEach(() => {
    properties = stubProperties();

    cy.visit('/properties');
    assertCorrectGetRequested(propertiesListRoutes.getProperties, 1);
  });

  it('paging through the table', () => {
    assertPagingCorrectly(propertiesListRoutes.getProperties);
  });

  it('request sort', () => {
    cy.get(listSelectors.columnHeader).contains('Size').click();
    const sort: SortingField[] = [{ field: 'size', direction: SortingDirection.ASCENDING }];
    assertCorrectGetRequested(propertiesListRoutes.getProperties, 1, sort);
  });

  it('delete properties', () => {
    const indexes = [0, 1];
    const deletedProperties = indexes.map(index => properties[index]);

    stubDeleteProperties(deletedProperties, indexes);

    cy.get('button').contains('delete').click({ force: true });
    cy.get('button').contains('Confirm').click();

    cy.wait(`@${propertiesListRoutes.deleteProperties}`)
      .its('request.body')
      .should(
        'deep.equal',
        deletedProperties.map(user => user.id)
      );
  });
});
