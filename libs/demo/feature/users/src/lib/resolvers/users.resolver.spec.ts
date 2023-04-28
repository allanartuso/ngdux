import { TestBed } from '@angular/core/testing';
import { UsersFacade } from '@demo/demo/data-access/users';
import { RequestState } from '@ngdux/data-model-common';
import { commonFixture } from '@ngdux/data-model-common/test';
import { MockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { UsersResolver } from './users.resolver';

describe('UsersResolver', () => {
  let resolver: UsersResolver;
  let store: MockStore;
  let facade: Partial<commonFixture.RemoveReadonly<UsersFacade>>;

  beforeEach(() => {
    facade = {
      requestState$: of(RequestState.IDLE),
      isReady$: of(true),
      initialize: jest.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        UsersResolver,
        {
          provide: UsersFacade,
          useValue: facade
        }
      ]
    });

    resolver = TestBed.inject(UsersResolver);
  });

  it('should dispatch initial actions', () => {
    resolver.resolve().subscribe();

    expect(facade.initialize).toHaveBeenCalledWith();
  });

  it('should emit true if the users are already loaded', done => {
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
