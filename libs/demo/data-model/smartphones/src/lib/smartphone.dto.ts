export const SMARTPHONES_RESOURCE_BASE_PATH = 'smartphones';

export interface SmartphoneDto {
  id: string;
  brand: string;
  model: string;
  color: string;
  price: number;
}

export type CreateSmartphoneDto = Omit<SmartphoneDto, 'id'>;

export function isSmartphoneDto(agent: SmartphoneDto | CreateSmartphoneDto): agent is SmartphoneDto {
  return 'id' in agent;
}
