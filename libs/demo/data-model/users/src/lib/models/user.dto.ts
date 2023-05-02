export const USERS_RESOURCE_BASE_PATH = 'users';

export interface UserDto {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  birthTime?: string;
}

export type CreateUserDto = Omit<UserDto, 'id'>;

export function isUserDto(user: UserDto | CreateUserDto): user is UserDto {
  return 'id' in user;
}
