import { commonFixture } from '@ngdux/data-model-common/test';
import { CreateSmartphoneDto, SmartphoneDto } from './smartphone.dto';

export function createPersistentSmartphones(n = 3): SmartphoneDto[] {
  const result: SmartphoneDto[] = [];

  for (let i = 0; i < n; i++) {
    result.push(createPersistentSmartphone(i.toString()));
  }

  return result;
}

export function createPersistentSmartphone(id: string = commonFixture.getAlphaNumeric()): SmartphoneDto {
  return {
    id,
    ...createTransientSmartphone()
  };
}

export function createTransientSmartphone(): CreateSmartphoneDto {
  return {
    brand: commonFixture.getCompanyName(),
    model: commonFixture.getAlphaNumeric(8),
    color: commonFixture.getColor(),
    price: commonFixture.getNumberInRange(1, 100) * 10
  };
}
