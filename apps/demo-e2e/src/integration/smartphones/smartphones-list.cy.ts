import { SmartphoneDto } from '@demo/demo/data-model/smartphones';
import { SortingDirection, SortingField } from '@ngdux/data-model-common';
import { assertCorrectGetRequested, assertPagingCorrectly, listSelectors } from '../../support/list/list.support';
import { smartphonesListRoutes, stubSmartphones } from '../../support/smartphones/smartphones-list';

describe('Smartphones list', () => {
  let smartphones: SmartphoneDto[];

  beforeEach(() => {
    smartphones = stubSmartphones();

    cy.visit('/smartphones');
    assertCorrectGetRequested(smartphonesListRoutes.getSmartphones, 1);
  });

  it('paging through the table', () => {
    assertPagingCorrectly(smartphonesListRoutes.getSmartphones);
  });

  it('request sort', () => {
    cy.get(listSelectors.columnHeader).contains('Model').click();
    const sort: SortingField[] = [{ field: 'model', direction: SortingDirection.ASCENDING }];
    assertCorrectGetRequested(smartphonesListRoutes.getSmartphones, 1, sort);
  });

  it('cannot delete smartphones', () => {
    cy.get('button').contains('delete').should('not.exist');
  });
});
