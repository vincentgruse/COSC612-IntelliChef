import { TestBed, async, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthenticationService } from './authentication.service';

describe('AuthenticationService', () => {
  let authService: AuthenticationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthenticationService]
    });

    authService = TestBed.inject(AuthenticationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  it('should return false initially for isAuthenticated', () => {
    expect(authService.isAuthenticated$).toBeTruthy();
    authService.isAuthenticated$.subscribe(isAuthenticated => {
      expect(isAuthenticated).toBeFalsy();
    });
  });

  it('should set isAuthenticated to true after successful login', async(inject([HttpTestingController],
    (httpClient: HttpTestingController) => {
      const mockUser = { username: 'testUser', password: 'testPassword' };
      authService.login(mockUser.username, mockUser.password).subscribe(() => {
        expect(authService.checkAuthentication()).toBeTruthy();
      });

      const req = httpMock.expectOne('http://localhost:8000/login');
      expect(req.request.method).toBe('POST');
      req.flush({ token: 'mockToken' });

      expect(sessionStorage.getItem('auth_token')).toEqual('mockToken');
    })));

  it('should set isAuthenticated to false after logout', () => {
    authService.logout();
    expect(authService.checkAuthentication()).toBeFalsy();
  });
});
