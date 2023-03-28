import { UserDto } from '@demo/demo/data-model/users';
import { AddressDto } from './address.dto';
export const PROPERTIES_RESOURCE_BASE_PATH = 'properties';

export interface PropertyDto {
  id?: string;
  price: number;
  size: number;
  address: AddressDto;
  availableFrom: string;
  features: string[];
  description: string;
  contact: UserDto;
}
