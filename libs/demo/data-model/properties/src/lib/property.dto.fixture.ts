import { createPersistentUser } from '@demo/demo/data-model/users/test';
import { commonFixture } from '@ngdux/data-model-common/test';
import { createPersistentAddress } from './address.dto.fixture';
import { PropertyDto, PropertyFeatureDto } from './property.dto';

export function createPersistentProperties(n = 3): PropertyDto[] {
  const result: PropertyDto[] = [];

  for (let i = 0; i < n; i++) {
    result.push(createPersistentProperty());
  }

  return result;
}

export function createPersistentProperty(overwrites: Partial<PropertyDto> = {}): PropertyDto {
  return {
    id: commonFixture.getAlphaNumeric(),
    ...createTransientProperty(),
    ...overwrites
  };
}

export function createTransientProperty(overwrites: Partial<PropertyDto> = {}): PropertyDto {
  return {
    price: commonFixture.getNumberInRange(800, 4000),
    size: commonFixture.getNumberInRange(1, 12),
    address: createPersistentAddress(),
    availableFrom: commonFixture.getFutureIso8601Date(),
    features: commonFixture.getElementsFromEnum(PropertyFeatureDto),
    description: commonFixture.getParagraph(),
    contact: createPersistentUser(),
    ...overwrites
  };
}
