import { TestBed } from '@angular/core/testing';
import { AgentsListFacade } from '@demo/demo/data-access/agents';
import { RequestState } from '@ngdux/data-model-common';
import { commonFixture } from '@ngdux/data-model-common/test';
import { of } from 'rxjs';
import { AgentsResolver } from './agents.resolver';

describe('AgentsResolver', () => {
  let resolver: AgentsResolver;
  let facade: Partial<commonFixture.RemoveReadonly<AgentsListFacade>>;

  beforeEach(() => {
    facade = {
      requestState$: of(RequestState.IDLE),
      isReady$: of(true),
      initialize: jest.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        AgentsResolver,
        {
          provide: AgentsListFacade,
          useValue: facade
        }
      ]
    });

    resolver = TestBed.inject(AgentsResolver);
  });

  it('should dispatch initial actions', () => {
    resolver.resolve().subscribe();

    expect(facade.initialize).toHaveBeenCalledWith();
  });

  it('should emit true if the agents are already loaded', done => {
    facade.isReady$ = of(true);

    resolver.resolve().subscribe(canActivate => {
      expect(canActivate).toBe(true);
      done();
    });
  });

  it('should wait until the loading state is loaded', () => {
    facade.isReady$ = of(false);
    let emitted = false;

    resolver.resolve().subscribe(() => {
      emitted = true;
    });

    expect(emitted).toBe(false);
  });
});
