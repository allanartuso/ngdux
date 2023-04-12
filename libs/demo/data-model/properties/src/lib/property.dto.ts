import { UserDto } from '@demo/demo/data-model/users';
import { AddressDto } from './address.dto';
export const PROPERTIES_RESOURCE_BASE_PATH = 'properties';

export interface PropertyDto {
  id?: string;
  price: number;
  size: number;
  address: AddressDto;
  availableFrom: string;
  features: PropertyFeatureDto[];
  description: string;
  contact: UserDto;
}

export enum PropertyFeatureDto {
  BALCONY_TERRACE = 'BALCONY_TERRACE',
  ELEVATOR = 'ELEVATOR',
  GARAGE = 'GARAGE',
  PARKING_SPACE = 'PARKING_SPACE',
  VIEW = 'VIEW',
  WASHING_MACHINE = 'WASHING_MACHINE',
  WHEELCHAIR_ACCESS = 'WHEELCHAIR_ACCESS'
}
