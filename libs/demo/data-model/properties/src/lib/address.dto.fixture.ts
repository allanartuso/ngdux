import { commonFixture } from '@ngdux/data-model-common/test';
import { AddressDto } from './address.dto';

export function createPersistentAddresses(n = 3): AddressDto[] {
  const result: AddressDto[] = [];

  for (let i = 0; i < n; i++) {
    result.push(createPersistentAddress());
  }

  return result;
}

export function createPersistentAddress(overwrites: Partial<AddressDto> = {}): AddressDto {
  return {
    id: commonFixture.getAlphaNumeric(),
    ...createTransientAddress(),
    ...overwrites
  };
}

export function createTransientAddress(overwrites: Partial<AddressDto> = {}): AddressDto {
  return {
    country: commonFixture.getCountryCode(),
    city: commonFixture.getCity(),
    street: commonFixture.getStreetName(),
    streetNumber: commonFixture.getNumberInRange(100, 3000) + commonFixture.getAlpha(1, 'upper'),
    zipCode: commonFixture.getAlphaNumeric(),
    ...overwrites
  };
}
