import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot } from '@angular/router';
import { PropertyFacade } from '@demo/demo/data-access/properties';
import { UsersFacade } from '@demo/demo/data-access/users';
import { RequestState } from '@ngdux/data-model-common';
import { commonFixture } from '@ngdux/data-model-common/test';
import { of } from 'rxjs';
import { PropertyResolver } from './property.resolver';

describe('PropertyResolver', () => {
  let resolver: PropertyResolver;
  let propertyFacade: Partial<commonFixture.RemoveReadonly<PropertyFacade>>;
  let usersFacade: Partial<commonFixture.RemoveReadonly<UsersFacade>>;

  const id = 'testId';
  const mockRouteSnapshot = { params: { id } } as unknown as ActivatedRouteSnapshot;

  beforeEach(() => {
    propertyFacade = {
      requestState$: of(RequestState.IDLE),
      isReady$: of(true),
      load: jest.fn()
    };
    usersFacade = {
      setPageSize: jest.fn(),
      initialize: jest.fn(),
      resources$: of([]),
      isReady$: of(true)
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
          useValue: propertyFacade
        },
        {
          provide: UsersFacade,
          useValue: usersFacade
        }
      ]
    });

    resolver = TestBed.inject(PropertyResolver);
  });

  it('should dispatch initial actions', () => {
    resolver.resolve(mockRouteSnapshot).subscribe();

    expect(propertyFacade.load).toHaveBeenCalledWith({ id });
    expect(usersFacade.setPageSize).toHaveBeenCalledWith({ pageSize: 100 });
    expect(usersFacade.initialize).toHaveBeenCalledWith();
  });

  it('should emit true if the users are already loaded', done => {
    resolver.resolve(mockRouteSnapshot).subscribe(canActivate => {
      expect(canActivate).toBe(true);
      done();
    });
  });

  it('should wait until the loading state is loaded', () => {
    propertyFacade.isReady$ = of(false);
    let emitted = false;

    resolver.resolve(mockRouteSnapshot).subscribe(() => {
      emitted = true;
    });

    expect(emitted).toBe(false);
  });
});
