import { TestBed, ComponentFixture, async, fakeAsync, tick } from '@angular/core/testing';
import { SignInComponent } from './sign-in.component';
import { AuthenticationService } from '../services/authentication.service';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

describe('SignInComponent', () => {
  let component: SignInComponent;
  let fixture: ComponentFixture<SignInComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthenticationService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let toastrServiceSpy: jasmine.SpyObj<ToastrService>;

  beforeEach(async(() => {
    authServiceSpy = jasmine.createSpyObj('AuthenticationService', ['login', 'successful_login']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    toastrServiceSpy = jasmine.createSpyObj('ToastrService', ['success']);

    TestBed.configureTestingModule({
      declarations: [SignInComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: AuthenticationService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ToastrService, useValue: toastrServiceSpy }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to home when login is successful', fakeAsync(() => {
    const mockResponse = { access_token: 'mock_token' };
    authServiceSpy.login.and.returnValue(of(mockResponse));

    component.signInForm.patchValue({
      username: 'testuser',
      password: 'testpassword'
    });
    component.submitForm();
    tick();

    expect(authServiceSpy.login).toHaveBeenCalledWith('testuser', 'testpassword');
    expect(sessionStorage.getItem('auth_token')).toEqual('mock_token');
    expect(authServiceSpy.successful_login).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/protected/home']);
    expect(toastrServiceSpy.success).toHaveBeenCalledWith('Logged In', 'Success');
  }));

  it('should handle missing token in login response', fakeAsync(() => {
    const mockResponse = {}; // Empty response
    authServiceSpy.login.and.returnValue(of(mockResponse));

    component.signInForm.patchValue({
      username: 'testuser',
      password: 'testpassword'
    });
    component.submitForm();
    tick();

    expect(authServiceSpy.login).toHaveBeenCalledWith('testuser', 'testpassword');
    expect(component.errorMessage).toEqual('Login successful, but token missing. Please contact support.');
    expect(console.warn).toHaveBeenCalledWith('Login response: Token missing.');
    expect(routerSpy.navigate).not.toHaveBeenCalled();
    expect(sessionStorage.getItem('auth_token')).toBeNull();
    expect(authServiceSpy.successful_login).not.toHaveBeenCalled();
    expect(toastrServiceSpy.success).not.toHaveBeenCalled();
  }));

  it('should handle login error', fakeAsync(() => {
    const errorResponse = { status: 401, message: 'Unauthorized' };
    authServiceSpy.login.and.returnValue(throwError(errorResponse));

    component.signInForm.patchValue({
      username: 'testuser',
      password: 'testpassword'
    });
    component.submitForm();
    tick();

    expect(authServiceSpy.login).toHaveBeenCalledWith('testuser', 'testpassword');
    expect(component.errorMessage).toEqual('Invalid username or password');
    expect(console.error).toHaveBeenCalledWith('Login Error:', errorResponse);
    expect(routerSpy.navigate).not.toHaveBeenCalled();
    expect(sessionStorage.getItem('auth_token')).toBeNull();
    expect(authServiceSpy.successful_login).not.toHaveBeenCalled();
    expect(toastrServiceSpy.success).not.toHaveBeenCalled();
  }));
});
