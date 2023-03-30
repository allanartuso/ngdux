import { TestBed } from '@angular/core/testing';
import { PropertiesFacade } from '@demo/demo/data-access/properties';
import { RequestState } from '@ngdux/data-model-common';
import { commonFixture } from '@ngdux/data-model-common/test';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { PropertiesResolver } from './properties.resolver';

describe('PropertiesResolver', () => {
  let resolver: PropertiesResolver;
  let facade: Partial<commonFixture.RemoveReadonly<PropertiesFacade>>;

  beforeEach(() => {
    facade = {
      requestState$: of(RequestState.IDLE),
      isReady$: of(true),
      initializeRequestOptions: jest.fn(),
      initialize: jest.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        PropertiesResolver,
        provideMockStore(),
        {
          provide: PropertiesFacade,
          useValue: facade
        }
      ]
    });

    resolver = TestBed.inject(PropertiesResolver);
  });

  it('should dispatch initial actions', () => {
    resolver.resolve().subscribe();

    expect(facade.initializeRequestOptions).toHaveBeenCalledWith();
    expect(facade.initialize).toHaveBeenCalledWith();
  });

  it('should emit true if the properties are already loaded', done => {
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
