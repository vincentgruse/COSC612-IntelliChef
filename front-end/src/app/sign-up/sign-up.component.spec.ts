import { TestBed, ComponentFixture } from '@angular/core/testing';
import { SignUpComponent } from './sign-up.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { PopupService } from '../services/popup.service';

describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;
  let popupServiceSpy: jasmine.SpyObj<PopupService>;

  beforeEach(async () => {
    popupServiceSpy = jasmine.createSpyObj('PopupService', ['submitFormData']);

    await TestBed.configureTestingModule({
      declarations: [SignUpComponent],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: PopupService, useValue: popupServiceSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the signupForm with correct validators', () => {
    expect(component.signupForm).toBeDefined();
    expect(component.signupForm.controls['firstName'].errors).toBeTruthy();
    expect(component.signupForm.controls['lastName'].errors).toBeTruthy();
    expect(component.signupForm.controls['username'].errors).toBeTruthy();
    expect(component.signupForm.controls['email'].errors).toBeTruthy();
    expect(component.signupForm.controls['password'].errors).toBeTruthy();
    expect(component.signupForm.controls['confirmPassword'].errors).toBeTruthy();
  });

  it('should call popupService with form data on onSubmit', () => {
    const mockFormData = {
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe123',
      email: 'johndoe@example.com',
      password: 'password123',
      confirmPassword: 'password123'
    };

    component.signupForm.setValue(mockFormData);
    component.onSubmit();

    expect(popupServiceSpy.submitFormData).toHaveBeenCalledWith(component.signupForm, jasmine.any(Object));
    expect(popupServiceSpy.submitFormData.calls.mostRecent().args[1]).toEqual(jasmine.objectContaining({
      name: 'John Doe',
      username: 'johndoe123',
      email: 'johndoe@example.com',
      password: 'password123',
      type: 0
    }));
  });

  it('should set passwordMismatch error if passwords do not match', () => {
    component.signupForm.patchValue({
      password: 'password123',
      confirmPassword: 'password456'
    });

    component.passwordMatchValidator(component.signupForm);

    expect(component.signupForm.controls['confirmPassword'].errors).toEqual({ passwordMismatch: true });
  });

  it('should not set passwordMismatch error if passwords match', () => {
    component.signupForm.patchValue({
      password: 'password123',
      confirmPassword: 'password123'
    });

    component.passwordMatchValidator(component.signupForm);

    expect(component.signupForm.controls['confirmPassword'].errors).toBeNull();
  });
});
