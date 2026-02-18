import { Component } from '@angular/core';
import { AgentDto } from '@demo/demo/data-model/agents';
import { AbstractTableComponent, NgilTableColumn } from '@ngil/list';

@Component({
  selector: 'demo-agents-table',
  templateUrl: './agents-table.component.html',
  styleUrls: ['./agents-table.component.scss'],
  standalone: false,
})
export class AgentsTableComponent extends AbstractTableComponent<AgentDto> {
  columns: NgilTableColumn[] = [
    { key: 'firstName', name: 'Fist name' },
    { key: 'lastName', name: 'Last name' },
    { key: 'email', name: 'Email' },
    { key: 'agency', name: 'Agency' },
    { key: 'licenseNumber', name: 'License number' },
  ];
}
