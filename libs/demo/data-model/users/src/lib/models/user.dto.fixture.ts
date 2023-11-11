import { createPersistentCars } from '@demo/demo/data-model/cars/test';
import { commonFixture } from '@ngdux/data-model-common/test';
import { CreateUserDto, UserDto } from './user.dto';

export function createPersistentUsers(n = 3): UserDto[] {
  const result: UserDto[] = [];

  for (let i = 0; i < n; i++) {
    result.push(createPersistentUser(i.toString()));
  }

  return result;
}

export function createPersistentUser(id: string = commonFixture.getAlphaNumeric()): UserDto {
  return {
    id,
    ...createTransientUser()
  };
}

export function createTransientUser(): CreateUserDto {
  const firstName = commonFixture.getFirstName();
  const lastName = commonFixture.getLastName();
  const birthTime = commonFixture.getTime();

  return {
    email: commonFixture.getEmail(firstName, lastName),
    firstName,
    lastName,
    birthTime,
    cars: createPersistentCars()
  };
}
