import { PropertyDto } from '@demo/demo/data-model/properties';
import { createPersistentProperty } from '@demo/demo/data-model/properties/test';

export const propertyInputSelectors = {
  price: '[label="Price"] input',
  size: '[label="Size"] input',
  availableFrom: '[label="Available from"] input',
  description: '[formControlName="description"]'
};

export const propertyFormRoutes = {
  getProperty: 'getProperty',
  updateProperty: 'updateProperty'
};

export function stubGetProperty(): void {
  const property = createPersistentProperty('1');

  cy.intercept('GET', '/api/properties/1', {
    body: property
  }).as(propertyFormRoutes.getProperty);
}

export function stubUpdateProperty(): PropertyDto {
  const updatedProperty: PropertyDto = createPersistentProperty('1');

  cy.intercept('PUT', '/api/properties/1', req => {
    // expect(req.body).to.deep.equal(updatedProperty);

    req.reply({
      body: updatedProperty
    });
  }).as(propertyFormRoutes.updateProperty);

  return updatedProperty;
}
