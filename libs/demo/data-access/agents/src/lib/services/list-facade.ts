import { InjectionToken } from '@angular/core';
import { AgentDto } from '@demo/demo/data-model/agents';
import { ErrorDto } from '@ngdux/data-model-common';
import { ListFacade } from '@ngdux/list';

export type AgentsListFacade = ListFacade<AgentDto, ErrorDto>;
export const AgentsListFacade = new InjectionToken<AgentsListFacade>('AgentsListFacade');
