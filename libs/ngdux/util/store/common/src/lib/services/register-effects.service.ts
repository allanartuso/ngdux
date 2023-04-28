import { Injectable } from '@angular/core';
import { EffectSources, EffectsRunner, OnIdentifyEffects, rootEffectsInit } from '@ngrx/effects';
import { Store } from '@ngrx/store';

@Injectable({ providedIn: 'root' })
export class RegisterEffectsService {
  constructor(
    private readonly store: Store,
    private readonly effectSources: EffectSources,
    private readonly effectsRunner: EffectsRunner
  ) {}

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
