import { Component } from '@angular/core';
import { commonFixture } from '@ngdux/data-model-common/test';
import { AbstractTableComponent } from './abstract-table.component';

interface Summary {
  id: string;
  name: string;
  count: number;
}

@Component({
    selector: 'demo-list',
    template: ``,
    standalone: false
})
export class TestTableComponent extends AbstractTableComponent<Summary> {}

export const summaries = createSummaries(101);

export function createSummaries(nbOfOrganizationRestrictionSummaries = 3): Summary[] {
  const result: Summary[] = [];

  for (let i = 0; i < nbOfOrganizationRestrictionSummaries; i++) {
    result.push(createSummary());
  }

  return result;
}

function createSummary(
  id: string = commonFixture.getWord(),
  name: string = commonFixture.getWord(),
  count: number = commonFixture.getNumberInRange(1, 10)
): Summary {
  return {
    id,
    name,
    count
  };
}
