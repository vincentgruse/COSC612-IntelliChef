import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { User } from "../models/user";
import { PopupService } from "../services/popup.service";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  signupForm!: FormGroup;
  user: User = { id: 0, name: '', username:'', password: '', email: '', type: 0, created_on: ''};
// {
//   "id": 0,
//   "name": "string",
//   "username": "string",
//   "password": "string",
//   "email": "string",
//   "type": 0,
//   "created_on": "2024-05-01T10:22:49.973309"
// }

  constructor(
    private fb: FormBuilder,
    private popupService: PopupService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(16)]],
      lastName: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(16)]],
      username: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(16)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(32)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  onSubmit() {
    // Concatenate first name and last name
    const firstName = this.signupForm.get('firstName')?.value;
    const lastName = this.signupForm.get('lastName')?.value;
    this.user.name = `${firstName} ${lastName}`;
    this.user.created_on = <string>this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss.SSSSSS')?.toString();

    // Pass the form data to the service
    this.popupService.submitFormData(this.signupForm, this.user);
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const passwordControl = formGroup.get('password');
    const confirmPasswordControl = formGroup.get('confirmPassword');

    if (passwordControl && confirmPasswordControl) {
      const password = passwordControl.value;
      const confirmPassword = confirmPasswordControl.value;

      if (password !== confirmPassword) {
        confirmPasswordControl.setErrors({ passwordMismatch: true });
      } else {
        confirmPasswordControl.setErrors(null);
      }
    }
  }
}
