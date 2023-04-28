import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { UsersFacade } from '@demo/demo/data-access/users';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

@Injectable()
export class UsersResolver implements Resolve<boolean> {
  constructor(private readonly usersFacade: UsersFacade) {}

  resolve(): Observable<boolean> {
    this.usersFacade.initialize();

    return this.usersFacade.isReady$.pipe(first(isReady => isReady));
  }
}
