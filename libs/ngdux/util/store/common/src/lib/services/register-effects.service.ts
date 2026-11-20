import { Injectable, inject } from '@angular/core';
import { EffectSources, EffectsRunner, OnIdentifyEffects, rootEffectsInit } from '@ngrx/effects';
import { Store } from '@ngrx/store';

@Injectable({ providedIn: 'root' })
export class RegisterEffectsService {
  private readonly store = inject(Store);
  private readonly effectSources = inject(EffectSources);
  private readonly effectsRunner = inject(EffectsRunner);

  registerEffects(effectSourceInstances: OnIdentifyEffects[]) {
    const shouldInitEffects = !this.effectsRunner.isStarted;
    if (shouldInitEffects) {
      this.effectsRunner.start();
    }

    effectSourceInstances.forEach(effect => {
      this.effectSources.addEffects(effect);
    });

    if (shouldInitEffects) {
      this.store.dispatch(rootEffectsInit());
    }
  }
}
