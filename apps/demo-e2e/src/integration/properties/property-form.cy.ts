import { PropertyDto } from '@demo/demo/data-model/properties';
import { UserDto } from '@demo/demo/data-model/users';
import { formSelectors } from '../../support/form/form';
import {
  propertyFormRoutes,
  propertyInputSelectors,
  stubGetProperty,
  stubUpdateProperty
} from '../../support/properties/property-form';

describe('Property form', () => {
  let updatedProperty: PropertyDto;
  let property: PropertyDto;
  let users: UserDto[];

  beforeEach(() => {
    ({ property, users } = stubGetProperty());
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

    // features
    cy.get(propertyInputSelectors.features).click();
    cy.get(propertyInputSelectors.selectOptions)
      .should('be.visible')
      .then(() => {
        property.features.forEach(feature => {
          cy.get(propertyInputSelectors.selectOptions).get(`[value="${feature}"]`).click();
        });

        updatedProperty.features.forEach(feature => {
          cy.get(propertyInputSelectors.selectOptions).get(`[value="${feature}"]`).click();
        });
      });
    cy.get('body').click();

    // contact
    cy.get(propertyInputSelectors.contact).click();
    cy.get(propertyInputSelectors.selectOptions)
      .should('be.visible')
      .then(() => {
        cy.get(propertyInputSelectors.selectOptions).get(`[displayValue="${updatedProperty.contact.email}"]`).click();
      });
    cy.get('body').click();

    cy.get(propertyInputSelectors.description).updateInputValue(updatedProperty.description);
    cy.get(formSelectors.submitButton).click();

    cy.wait(`@${propertyFormRoutes.updateProperty}`);
  });
});
