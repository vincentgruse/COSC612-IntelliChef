import { Component } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router'; // Import Router for navigation

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent {
  signInForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private authService: AuthenticationService,
    private formBuilder: FormBuilder,
    private router: Router // Inject Router service
  ) {
    this.signInForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  submitForm() {
    if (this.signInForm.valid) {
      const username = this.signInForm.value.username;
      const password = this.signInForm.value.password;

      this.authService.login(username, password) // This returns an Observable
        .subscribe(response => {
          // Handle successful login (navigate to a different route)

          // Check if response contains a token
          const token = response?.token; // Use optional chaining to handle missing token
          if (token) {
            sessionStorage.setItem('auth_token', token);
          } else {
            // Handle case where response lacks a token (e.g., error message)
            this.errorMessage = 'Login successful, but token missing. Please contact support.';
            console.warn('Login response: Token missing.');
          }

          this.errorMessage = '';
          this.router.navigate(['/home']);
        }, error => {
          this.errorMessage = 'Invalid username or password';
          console.error('Login Error:', error);
        });
    }
  }
}
