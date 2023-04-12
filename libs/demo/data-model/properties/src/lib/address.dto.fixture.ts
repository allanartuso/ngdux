import { commonFixture } from '@ngdux/data-model-common/test';
import { AddressDto } from './address.dto';

export function createPersistentAddresses(n = 3): AddressDto[] {
  const result: AddressDto[] = [];

  for (let i = 0; i < n; i++) {
    result.push(createPersistentAddress());
  }

  return result;
}

export function createPersistentAddress(id: string = commonFixture.getAlphaNumeric()): AddressDto {
  return {
    id,
    ...createTransientAddress()
  };
}

export function createTransientAddress(): AddressDto {
  return {
    country: commonFixture.getCountryCode(),
    city: commonFixture.getCity(),
    street: commonFixture.getStreetName(),
    streetNumber: commonFixture.getNumberInRange(100, 3000) + commonFixture.getAlpha(1, 'upper'),
    zipCode: commonFixture.getAlphaNumeric()
  };
}
