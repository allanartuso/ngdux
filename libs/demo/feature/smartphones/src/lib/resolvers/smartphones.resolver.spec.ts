import { TestBed } from '@angular/core/testing';
import { SmartphonesListFacade } from '@demo/demo/data-access/smartphones';
import { RequestState } from '@ngdux/data-model-common';
import { commonFixture } from '@ngdux/data-model-common/test';
import { of } from 'rxjs';
import { SmartphonesResolver } from './smartphones.resolver';

describe('SmartphonesResolver', () => {
  let resolver: SmartphonesResolver;
  let facade: Partial<commonFixture.RemoveReadonly<SmartphonesListFacade>>;

  beforeEach(() => {
    facade = {
      requestState$: of(RequestState.IDLE),
      isReady$: of(true),
      initialize: jest.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        SmartphonesResolver,
        {
          provide: SmartphonesListFacade,
          useValue: facade
        }
      ]
    });

    resolver = TestBed.inject(SmartphonesResolver);
  });

  it('should dispatch initial actions', () => {
    resolver.resolve().subscribe();

    expect(facade.initialize).toHaveBeenCalledWith();
  });

  it('should emit true if the smartphones are already loaded', done => {
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
