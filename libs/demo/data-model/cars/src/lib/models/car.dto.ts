export const CARS_RESOURCE_BASE_PATH = 'cars';

export interface CarDto {
  id: string;
  make: string;
  model: string;
  year: number;
  color: string;
  vin: string;
}

export type CreateCarDto = Omit<CarDto, 'id'>;

export function isCarDto(car: CarDto | CreateCarDto): car is CarDto {
  return 'id' in car;
}
