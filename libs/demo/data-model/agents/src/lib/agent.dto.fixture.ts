import { createPersistentAddress } from '@demo/demo/data-model/properties/test';
import { commonFixture } from '@ngdux/data-model-common/test';
import { AgentDto, CreateAgentDto } from './agent.dto';

export function createPersistentAgents(n = 3): AgentDto[] {
  const result: AgentDto[] = [];

  for (let i = 0; i < n; i++) {
    result.push(createPersistentAgent(i.toString()));
  }

  return result;
}

export function createPersistentAgent(id: string = commonFixture.getAlphaNumeric()): AgentDto {
  return {
    id,
    ...createTransientAgent()
  };
}

export function createTransientAgent(): CreateAgentDto {
  const firstName = commonFixture.getFirstName();
  const lastName = commonFixture.getLastName();

  return {
    email: commonFixture.getEmail(firstName, lastName),
    firstName,
    lastName,
    phone: commonFixture.getPhoneNumber(),
    agency: commonFixture.getCompanyName(),
    licenseNumber: commonFixture.getAlphaNumeric(10),
    address: createPersistentAddress()
  };
}
