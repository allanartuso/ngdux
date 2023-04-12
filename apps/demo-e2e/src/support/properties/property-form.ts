import { PropertyDto } from '@demo/demo/data-model/properties';
import { createPersistentAddress, createPersistentProperty } from '@demo/demo/data-model/properties/test';
import { UserDto } from '@demo/demo/data-model/users';
import { commonFixture } from '@ngdux/data-model-common/test';
import { stubUsers } from '../users/users-list';

export const propertyInputSelectors = {
  price: '[label="Price"] input',
  size: '[label="Size"] input',
  availableFrom: '[label="Available from"] input',
  description: '[formControlName="description"]',
  address: {
    country: '[formControlName="country"]',
    city: '[formControlName="city"]',
    zipCode: '[formControlName="zipCode"]',
    street: '[formControlName="street"]',
    streetNumber: '[formControlName="streetNumber"]'
  },
  contact: '[formControlName="contact"] select',
  features: '[formControlName="features"] select'
};

export const propertyFormRoutes = {
  getProperty: 'getProperty',
  updateProperty: 'updateProperty'
};

export function stubGetProperty() {
  const users = stubUsers();
  const property = createPersistentProperty({ id: '1', contact: commonFixture.getElementFromArray(users) });

  cy.intercept('GET', '/api/properties/1', {
    body: property
  }).as(propertyFormRoutes.getProperty);

  return { property, users };
}

export function stubUpdateProperty(property: PropertyDto, users: UserDto[]): PropertyDto {
  const updatedProperty: PropertyDto = createPersistentProperty({
    id: property.id,
    contact: commonFixture.getElementFromArray(users),
    address: createPersistentAddress({ id: property.address.id })
  });

  cy.intercept('PUT', '/api/properties/1', req => {
    const body: PropertyDto = {
      ...req.body,
      features: req.body.features.sort()
    };
    expect(body).to.deep.equal({ ...updatedProperty, features: updatedProperty.features.sort() });

    req.reply({
      body: updatedProperty
    });
  }).as(propertyFormRoutes.updateProperty);

  return updatedProperty;
}
