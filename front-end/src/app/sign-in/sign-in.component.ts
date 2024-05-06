import { Component } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from "ngx-toastr";

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
    private router: Router,
    private toastr: ToastrService
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

      this.authService.login(username, password)
        .subscribe(response => {
          // Handle successful login (navigate to a different route)

          // Check if response contains a token
          const token = response?.access_token; // Use optional chaining to handle missing token
          if (token) {
            this.toastr.success('Logged In', 'Success')
            sessionStorage.setItem('auth_token', token);
            this.authService.isAuthenticated = true;
            this.authService.successful_login()
            this.router.navigate(['/protected/home']);
          } else {
            this.errorMessage = 'Login successful, but token missing. Please contact support.';
            console.warn('Login response: Token missing.');
          }
        }, error => {
          this.errorMessage = 'Invalid username or password';
          this.toastr.error('Invalid username or password', 'Unsuccessful')
          console.error('Login Error:', error);
        });
    }
  }
}
