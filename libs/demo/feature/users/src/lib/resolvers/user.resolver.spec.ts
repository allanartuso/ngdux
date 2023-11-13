import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot } from '@angular/router';
import { CarsListFacade } from '@demo/demo/data-access/cars';
import { UserFacade } from '@demo/demo/data-access/users';
import { commonFixture } from '@ngdux/data-model-common/test';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { UserResolver } from './user.resolver';

describe('UserResolver', () => {
  let resolver: UserResolver;
  let facade: Partial<commonFixture.RemoveReadonly<UserFacade>>;
  let carsFacade: Partial<commonFixture.RemoveReadonly<CarsListFacade>>;

  const id = 'testId';
  const mockRouteSnapshot = { params: { id } } as unknown as ActivatedRouteSnapshot;

  beforeEach(() => {
    facade = {
      isReady$: of(true),
      load: jest.fn()
    };
    carsFacade = {
      isReady$: of(true),
      initialize: jest.fn(),
      setPageSize: jest.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        UserResolver,
        provideMockStore(),
        {
          provide: ActivatedRouteSnapshot,
          useValue: mockRouteSnapshot
        },
        {
          provide: UserFacade,
          useValue: facade
        },
        {
          provide: CarsListFacade,
          useValue: carsFacade
        }
      ]
    });

    resolver = TestBed.inject(UserResolver);
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
