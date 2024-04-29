import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuComponent } from './menu.component';
import { ElementRef } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { PopupService } from '../services/popup.service';
import { of } from 'rxjs';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;
  let authService: jasmine.SpyObj<AuthenticationService>;
  let popupService: jasmine.SpyObj<PopupService>;
  let authServiceIsAuthenticated$: any;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthenticationService', ['logout', 'checkAuthentication']);
    authServiceIsAuthenticated$ = of(false); // Initial value for isAuthenticated$ observable

    await TestBed.configureTestingModule({
      declarations: [MenuComponent],
      providers: [
        { provide: ElementRef, useValue: { nativeElement: {} } },
        { provide: AuthenticationService, useValue: authServiceSpy },
        { provide: PopupService, useValue: jasmine.createSpyObj('PopupService', ['openSignInPopup']) }
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthenticationService) as jasmine.SpyObj<AuthenticationService>;
    popupService = TestBed.inject(PopupService) as jasmine.SpyObj<PopupService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize buttonText correctly based on authentication state', () => {
    authService.isAuthenticated$ = authServiceIsAuthenticated$;
    expect(component.buttonText).toBe('Sign In');
  });

  it('should toggle dropdown', () => {
    component.showDropdown = false;
    component.toggleDropdown();
    expect(component.showDropdown).toBe(true);
  });

  it('should close dropdown', () => {
    component.showDropdown = true;
    component.closeDropdown();
    expect(component.showDropdown).toBe(false);
  });

  it('should handle authentication action correctly when not authenticated', () => {
    authService.checkAuthentication.and.returnValue(false);
    component.handleAuthenticationAction();
    expect(popupService.openSignInPopup).toHaveBeenCalled();
  });

  it('should handle authentication action correctly when authenticated', () => {
    authService.checkAuthentication.and.returnValue(true);
    component.handleAuthenticationAction();
    expect(authService.logout).toHaveBeenCalled();
  });

  it('should close dropdown when clicked outside', () => {
    const fakeEvent = new MouseEvent('click');
    const nativeElement = document.createElement('div');
    spyOn(nativeElement, 'contains').and.returnValue(false);
    component.onClick(fakeEvent);
    expect(component.showDropdown).toBe(false);
  });

  it('should not close dropdown when clicked inside', () => {
    const fakeEvent = new MouseEvent('click');
    const nativeElement = document.createElement('div');
    spyOn(nativeElement, 'contains').and.returnValue(true);
    component.onClick(fakeEvent);
    expect(component.showDropdown).toBe(true);
  });
});
