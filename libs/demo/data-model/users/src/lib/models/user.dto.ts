import { CarDto } from '@demo/demo/data-model/cars';

export const USERS_RESOURCE_BASE_PATH = 'users';

export interface UserDto {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  birthDate?: string;
  birthTime?: string;
  cars: CarDto[];
  gender?: Gender;
}

export enum Gender {
  Male = 'Male',
  Female = 'Female'
}

export type CreateUserDto = Omit<UserDto, 'id'>;

export function isUserDto(user: UserDto | CreateUserDto): user is UserDto {
  return 'id' in user;
}
