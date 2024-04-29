import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AuthenticationService } from './services/authentication.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authServiceSpy: jasmine.SpyObj<AuthenticationService>;
  let router: Router;
  let routeSnapshot: ActivatedRouteSnapshot;
  let stateSnapshot: RouterStateSnapshot;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthenticationService', ['checkAuthentication']);
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        AuthGuard,
        { provide: AuthenticationService, useValue: authServiceSpy }
      ]
    });
    guard = TestBed.inject(AuthGuard);
    router = TestBed.inject(Router);
    routeSnapshot = {} as ActivatedRouteSnapshot;
    stateSnapshot = {} as RouterStateSnapshot;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should return true and allow access if authentication check is successful', () => {
    authServiceSpy.checkAuthentication.and.returnValue(true);

    const result = guard.canActivate(routeSnapshot, stateSnapshot);

    expect(result).toBeTrue();
    expect(authServiceSpy.checkAuthentication).toHaveBeenCalled();
  });

  it('should return false and navigate to login page if authentication check fails', () => {
    authServiceSpy.checkAuthentication.and.returnValue(false);
    const navigateSpy = spyOn(router, 'navigate');

    const result = guard.canActivate(routeSnapshot, stateSnapshot);

    expect(result).toBeFalse();
    expect(authServiceSpy.checkAuthentication).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/sign-in']);
  });
});
