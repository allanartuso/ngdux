import { PropertyDto } from '@demo/demo/data-model/properties';
import { formSelectors } from '../../support/form/form';
import {
  propertyFormRoutes,
  propertyInputSelectors,
  stubGetProperty,
  stubUpdateProperty
} from '../../support/properties/property-form';

describe('Property form', () => {
  let updatedProperty: PropertyDto;

  beforeEach(() => {
    stubGetProperty();
    updatedProperty = stubUpdateProperty();
    cy.visit('/properties/1');
  });

  it('updates the form', () => {
    cy.get(propertyInputSelectors.price).updateInputValue(updatedProperty.price);
    cy.get(propertyInputSelectors.size).updateInputValue(updatedProperty.size);
    cy.get(propertyInputSelectors.availableFrom).updateInputValue(updatedProperty.availableFrom);
    // cy.get(propertyInputSelectors.description).updateInputValue(updatedProperty.description);
    cy.get(formSelectors.submitButton).click();

    cy.wait(`@${propertyFormRoutes.updateProperty}`);
  });
});
