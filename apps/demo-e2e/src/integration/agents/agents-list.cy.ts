import { AgentDto } from '@demo/demo/data-model/agents';
import { SortingDirection, SortingField } from '@ngdux/data-model-common';
import { agentsListRoutes, stubAgents } from '../../support/agents/agents-list';
import { assertCorrectGetRequested, assertPagingCorrectly, listSelectors } from '../../support/list/list.support';

describe('Agents list', () => {
  let agents: AgentDto[];

  beforeEach(() => {
    agents = stubAgents();

    cy.visit('/agents');
    assertCorrectGetRequested(agentsListRoutes.getAgents, 1);
  });

  it('paging through the table', () => {
    assertPagingCorrectly(agentsListRoutes.getAgents);
  });

  it('request sort', () => {
    cy.get(listSelectors.columnHeader).contains('Email').click();
    const sort: SortingField[] = [{ field: 'email', direction: SortingDirection.ASCENDING }];
    assertCorrectGetRequested(agentsListRoutes.getAgents, 1, sort);
  });

  it('cannot delete agents', () => {
    cy.get('button').contains('delete').should('not.exist');
  });
});
