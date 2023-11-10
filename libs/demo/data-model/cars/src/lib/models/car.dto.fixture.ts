import { commonFixture } from '@ngdux/data-model-common/test';
import { CarDto, CreateCarDto } from './car.dto';

export function createPersistentCars(n = 3): CarDto[] {
  const result: CarDto[] = [];

  for (let i = 0; i < n; i++) {
    result.push(createPersistentCar(i.toString()));
  }

  return result;
}

export function createPersistentCar(id: string = commonFixture.getAlphaNumeric()): CarDto {
  return {
    id,
    ...createTransientCar()
  };
}

export function createTransientCar(): CreateCarDto {
  return {
    make: commonFixture.getVehicleManufacturer(),
    model: commonFixture.getVehicleModel(),
    year: commonFixture.getYear(),
    color: commonFixture.getVehicleColor(),
    vin: commonFixture.getVehicleVin()
  };
}
