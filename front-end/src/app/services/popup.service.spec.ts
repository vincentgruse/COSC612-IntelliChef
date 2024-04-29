import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { PopupService } from './popup.service';
import { SignInComponent } from '../sign-in/sign-in.component';

describe('PopupService', () => {
  let service: PopupService;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(() => {
    const dialogSpyObj = jasmine.createSpyObj('MatDialog', ['open']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        PopupService,
        { provide: MatDialog, useValue: dialogSpyObj }
      ]
    });

    service = TestBed.inject(PopupService);
    dialogSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open sign-in popup', () => {
    service.openSignInPopup();

    expect(dialogSpy.open).toHaveBeenCalledWith(SignInComponent);
  });

  it('should submit form data', () => {
    const formMock = { valid: true, value: { firstName: 'John', lastName: 'Doe', username: 'johndoe', email: 'john@example.com', password: 'password' } };
    const userMock = { name: '', username: '', email: '', password: '' };

    service.submitFormData(formMock as any, userMock);

    const req = httpMock.expectOne('http://localhost:8000/user');
    expect(req.request.method).toBe('POST');
    req.flush({ message: 'User created successfully' });

    expect(userMock.name).toBe('John Doe');
    expect(userMock.username).toBe('johndoe');
    expect(userMock.email).toBe('john@example.com');
    expect(userMock.password).toBe('password');
  });

  it('should navigate to sign-in after successful submission', (done: DoneFn) => {
    const formMock = { valid: true, value: { firstName: 'John', lastName: 'Doe', username: 'johndoe', email: 'john@example.com', password: 'password' } };
    const userMock = { name: '', username: '', email: '', password: '' };

    const navigateSpy = spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

    service.submitFormData(formMock as any, userMock);

    setTimeout(() => {
      expect(navigateSpy).toHaveBeenCalledWith(['/sign-in']);
      done();
    }, 0);
  });
});
