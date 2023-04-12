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
    const { property, users } = stubGetProperty();
    updatedProperty = stubUpdateProperty(property, users);
    cy.visit('/properties/1');
  });

  it('updates the form', () => {
    cy.get(propertyInputSelectors.price).updateInputValue(updatedProperty.price);
    cy.get(propertyInputSelectors.size).updateInputValue(updatedProperty.size);
    cy.get(propertyInputSelectors.availableFrom).updateInputValue(updatedProperty.availableFrom);
    cy.get(propertyInputSelectors.address.country).updateInputValue(updatedProperty.address.country);
    cy.get(propertyInputSelectors.address.city).updateInputValue(updatedProperty.address.city);
    cy.get(propertyInputSelectors.address.zipCode).updateInputValue(updatedProperty.address.zipCode);
    cy.get(propertyInputSelectors.address.street).updateInputValue(updatedProperty.address.street);
    cy.get(propertyInputSelectors.address.streetNumber).updateInputValue(updatedProperty.address.streetNumber);
    cy.get(propertyInputSelectors.description).updateInputValue(updatedProperty.description);
    cy.get(propertyInputSelectors.contact).select(updatedProperty.contact.email);
    cy.get(propertyInputSelectors.features).select([]).select(updatedProperty.features);
    cy.get(formSelectors.submitButton).click();

    cy.wait(`@${propertyFormRoutes.updateProperty}`);
  });
});
