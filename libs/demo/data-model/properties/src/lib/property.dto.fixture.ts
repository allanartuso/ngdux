import { createPersistentUser } from '@demo/demo/data-model/users/test';
import { commonFixture } from '@ngdux/data-model-common/test';
import { createPersistentAddress } from './address.dto.fixture';
import { PropertyDto } from './property.dto';

export function createPersistentProperties(n = 3): PropertyDto[] {
  const result: PropertyDto[] = [];

  for (let i = 0; i < n; i++) {
    result.push(createPersistentProperty());
  }

  return result;
}

export function createPersistentProperty(id: string = commonFixture.getAlphaNumeric()): PropertyDto {
  return {
    id,
    ...createTransientProperty()
  };
}

export function createTransientProperty(): PropertyDto {
  return {
    price: commonFixture.getNumberInRange(800, 4000),
    size: commonFixture.getNumberInRange(1, 12),
    address: createPersistentAddress(),
    availableFrom: commonFixture.getFutureIso8601Date(),
    features: commonFixture.getTags(),
    description: commonFixture.getParagraph(),
    contact: createPersistentUser()
  };
}
