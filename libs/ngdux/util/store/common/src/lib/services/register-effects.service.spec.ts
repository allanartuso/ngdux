import { TestBed } from '@angular/core/testing';
import { commonFixture } from '@ngdux/data-model-common/test';
import { EffectSources, EffectsRunner, rootEffectsInit } from '@ngrx/effects';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { RegisterEffectsService } from './register-effects.service';

describe('RegisterEffectsService', () => {
  let service: RegisterEffectsService;
  let store: MockStore;
  let mockEffectsSources: Partial<EffectSources>;
  let mockEffectsRunner: Partial<commonFixture.RemoveReadonly<EffectsRunner>>;

  beforeEach(() => {
    mockEffectsSources = {
      addEffects: jest.fn()
    };
    mockEffectsRunner = {
      start: jest.fn(),
      isStarted: false
    };

    TestBed.configureTestingModule({
      providers: [
        provideMockStore(),
        { provide: EffectSources, useValue: mockEffectsSources },
        { provide: EffectsRunner, useValue: mockEffectsRunner }
      ]
    });

    service = TestBed.inject(RegisterEffectsService);
    store = TestBed.inject(MockStore);

    jest.spyOn(store, 'dispatch');
  });

  it('register effects', () => {
    const effects1 = { ngrxOnIdentifyEffects: () => commonFixture.getWord() };
    const effects2 = { ngrxOnIdentifyEffects: () => commonFixture.getWord() };

    service.registerEffects([effects1, effects2]);

    expect(mockEffectsSources.addEffects).toHaveBeenCalledWith(effects1);
    expect(mockEffectsSources.addEffects).toHaveBeenCalledWith(effects2);
    expect(mockEffectsRunner.start).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith(rootEffectsInit());
  });

  it('register effects without initializing the effects runner if it is already initialized', () => {
    mockEffectsRunner.isStarted = true;
    const effects3 = { ngrxOnIdentifyEffects: () => commonFixture.getWord() };

    service.registerEffects([effects3]);

    expect(mockEffectsSources.addEffects).toHaveBeenCalledWith(effects3);
    expect(mockEffectsRunner.start).not.toHaveBeenCalled();
    expect(store.dispatch).not.toHaveBeenCalled();
  });
});
