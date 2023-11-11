import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { AgentsFacade } from '@demo/demo/data-access/agents';
import { AgentDto } from '@demo/demo/data-model/agents';
import { ErrorDto } from '@ngdux/data-model-common';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

@Injectable()
export class AgentsResolver implements Resolve<boolean> {
  constructor(private readonly agentsFacade: AgentsFacade<AgentDto, ErrorDto>) {}

  resolve(): Observable<boolean> {
    this.agentsFacade.initialize();

    return this.agentsFacade.isReady$.pipe(first(isReady => isReady));
  }
}
