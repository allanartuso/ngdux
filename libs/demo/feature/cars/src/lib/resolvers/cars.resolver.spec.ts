import { TestBed } from '@angular/core/testing';
import { CarsListFacade } from '@demo/demo/data-access/cars';
import { RequestState } from '@ngdux/data-model-common';
import { commonFixture } from '@ngdux/data-model-common/test';
import { of } from 'rxjs';
import { CarsResolver } from './cars.resolver';

describe('CarsResolver', () => {
  let resolver: CarsResolver;
  let facade: Partial<commonFixture.RemoveReadonly<CarsListFacade>>;

  beforeEach(() => {
    facade = {
      requestState$: of(RequestState.IDLE),
      isReady$: of(true),
      initialize: jest.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        CarsResolver,
        {
          provide: CarsListFacade,
          useValue: facade
        }
      ]
    });

    resolver = TestBed.inject(CarsResolver);
  });

  it('should dispatch initial actions', () => {
    resolver.resolve().subscribe();

    expect(facade.initialize).toHaveBeenCalledWith();
  });

  it('should emit true if the cars are already loaded', done => {
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
