import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { AgentsListFacade } from '@demo/demo/data-access/agents';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

@Injectable()
export class AgentsResolver implements Resolve<boolean> {
  constructor(private readonly agentsFacade: AgentsListFacade) {}

  resolve(): Observable<boolean> {
    this.agentsFacade.initialize();

    return this.agentsFacade.isReady$.pipe(first(isReady => isReady));
  }
}
