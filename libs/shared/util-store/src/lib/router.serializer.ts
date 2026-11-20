import { Injectable, inject } from '@angular/core';
import { Router, RouterStateSnapshot } from '@angular/router';
import { MinimalRouterStateSerializer } from '@ngrx/router-store';
import { CustomRouterStateSnapshot } from './models/store.model';

@Injectable()
export class CustomRouterStateSerializer extends MinimalRouterStateSerializer {
  private readonly router = inject(Router);

  override serialize(routerState: RouterStateSnapshot): CustomRouterStateSnapshot {
    let extrasState = {};
    const navigationState = this.router.currentNavigation();
    if (navigationState) {
      extrasState = navigationState.extras.state || {};
    }

    return {
      ...super.serialize(routerState),
      extrasState,
    };
  }
}
