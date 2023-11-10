import { CarDto } from '@demo/demo/data-model/cars';

export const USERS_RESOURCE_BASE_PATH = 'users';

export interface UserDto {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  birthTime?: string;
  cars: CarDto[];
}

export type CreateUserDto = Omit<UserDto, 'id'>;

export function isUserDto(user: UserDto | CreateUserDto): user is UserDto {
  return 'id' in user;
}
