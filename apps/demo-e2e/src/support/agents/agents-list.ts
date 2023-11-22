import { AgentDto } from '@demo/demo/data-model/agents';
import { createPersistentAgents } from '@demo/demo/data-model/agents/test';
import { listSelectors } from '../list/list.support';

export const agentsListRoutes = {
  getAgents: 'getAgents',
  deleteAgents: 'deleteAgents'
};

const agentsListApiUrls = {
  get: 'http://localhost:3000/api/agents?*',
  deleteAgents: '/api/agents/bulk'
};

export function stubAgents(): AgentDto[] {
  const agents = createPersistentAgents(35);

  cy.intercept({ method: 'GET', url: agentsListApiUrls.get }, req => {
    const queryOptions = req.query;
    const pageIndex = +queryOptions['page'] - 1;
    const pageSize = +queryOptions['pageSize'];
    const res = agents.slice(pageIndex * pageSize, pageSize * (pageIndex + 1));
    req.reply(res);
  }).as(agentsListRoutes.getAgents);

  return agents;
}

export function stubDeleteAgents(deletedAgents: AgentDto[], indexes: number[]) {
  cy.intercept({ method: 'DELETE', url: agentsListApiUrls.deleteAgents }, req => {
    req.reply(deletedAgents);
  }).as(agentsListRoutes.deleteAgents);

  indexes.forEach(index => {
    cy.get(listSelectors.checkbox).eq(index).click();
  });
}
