import { AddressDto } from '@demo/demo/data-model/properties';

export const AGENTS_RESOURCE_BASE_PATH = 'agents';

export interface AgentDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  agency: string;
  licenseNumber: string;
  address: AddressDto;
}

export type CreateAgentDto = Omit<AgentDto, 'id'>;

export function isAgentDto(agent: AgentDto | CreateAgentDto): agent is AgentDto {
  return 'id' in agent;
}
