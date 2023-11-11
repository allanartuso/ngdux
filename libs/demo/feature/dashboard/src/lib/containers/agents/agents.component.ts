import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AgentsListFacade } from '@demo/demo/data-access/agents';
import { AgentDto, AGENTS_RESOURCE_BASE_PATH } from '@demo/demo/data-model/agents';
import { FilteringOptions, PagingOptions, SortingField, SortingOptions } from '@ngdux/data-model-common';
import { combineLatest, map } from 'rxjs';

@Component({
  selector: 'demo-agents',
  templateUrl: './agents.component.html',
  styleUrls: ['./agents.component.scss']
})
export class AgentsComponent {
  model$ = combineLatest({
    agents: this.agentsFacade.currentPageData$,
    totalCount: this.agentsFacade.totalCount$,
    pagingOptions: this.agentsFacade.pagingOptions$,
    sortingOptions: this.agentsFacade.sortingOptions$.pipe(map(sortingOptions => Object.values(sortingOptions))),
    filteringOptions: this.agentsFacade.filteringOptions$,
    selectedItems: this.agentsFacade.selectedItems$
  });

  isReady$ = this.agentsFacade.isReady$;

  constructor(private readonly router: Router, private readonly agentsFacade: AgentsListFacade) {
    this.agentsFacade.initialize();
  }

  onFilteringChanged(filteringOptions: FilteringOptions): void {
    this.agentsFacade.changeFiltering({ filteringOptions });
  }

  onSortingChanged(sortingOptions: SortingField[]): void {
    this.agentsFacade.changeSorting({
      sortingOptions: sortingOptions.reduce<SortingOptions>((acc, sortingOption) => {
        return { ...acc, [sortingOption.field]: sortingOption };
      }, {})
    });
  }

  onPageOptionsChanged(pagingOptions: PagingOptions): void {
    this.agentsFacade.changePagingOptions({ pagingOptions });
  }

  onRefreshPageSelected(): void {
    this.agentsFacade.loadPage();
  }

  onRowSelected(agents: AgentDto[]): void {
    this.agentsFacade.changeSelectedResources({ selectedResourceIds: agents.map(user => user.id) });
  }

  onRowClicked(user: AgentDto): void {
    this.router.navigate([AGENTS_RESOURCE_BASE_PATH, user.id]);
  }

  onDelete(): void {
    this.agentsFacade.showRemovalsConfirmation();
  }
}
