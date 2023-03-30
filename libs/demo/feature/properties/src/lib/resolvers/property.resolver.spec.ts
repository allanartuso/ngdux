import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot } from '@angular/router';
import { PropertyFacade } from '@demo/demo/data-access/properties';
import { RequestState } from '@ngdux/data-model-common';
import { commonFixture } from '@ngdux/data-model-common/test';
import { of } from 'rxjs';
import { PropertyResolver } from './property.resolver';

describe('PropertyResolver', () => {
  let resolver: PropertyResolver;
  let facade: Partial<commonFixture.RemoveReadonly<PropertyFacade>>;

  const id = 'testId';
  const mockRouteSnapshot = { params: { id } } as unknown as ActivatedRouteSnapshot;

  beforeEach(() => {
    facade = {
      requestState$: of(RequestState.IDLE),
      isReady$: of(true),
      load: jest.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        PropertyResolver,
        {
          provide: ActivatedRouteSnapshot,
          useValue: mockRouteSnapshot
        },
        {
          provide: PropertyFacade,
          useValue: facade
        }
      ]
    });

    resolver = TestBed.inject(PropertyResolver);
  });

  it('should dispatch initial actions', () => {
    resolver.resolve(mockRouteSnapshot).subscribe();

    expect(facade.load).toHaveBeenCalledWith({ id });
  });

  it('should emit true if the users are already loaded', done => {
    resolver.resolve(mockRouteSnapshot).subscribe(canActivate => {
      expect(canActivate).toBe(true);
      done();
    });
  });

  it('should wait until the loading state is loaded', () => {
    facade.isReady$ = of(false);
    let emitted = false;

    resolver.resolve(mockRouteSnapshot).subscribe(() => {
      emitted = true;
    });

    expect(emitted).toBe(false);
  });
});
