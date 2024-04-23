import { Injectable } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { SignInComponent } from "../sign-in/sign-in.component";
import { HttpClient } from '@angular/common/http';
import { FormGroup } from "@angular/forms";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class PopupService {
  private apiURL = 'http://localhost:8000';
  constructor(
    private dialog: MatDialog,
    private http: HttpClient,
    private router: Router
  ) { }

  openSignInPopup() {
    this.dialog.open(SignInComponent);
  }

  submitFormData(form: FormGroup, user: any) {
    if (form.valid) {
      // Update user object
      user.username = form.value.username;
      user.email = form.value.email;
      user.password = form.value.password;

      // Send data to backend
      this.http.post<any>(this.apiURL + "/users", user)
        .subscribe(
          response => {
            // Handle successful response from backend
            console.log('Backend response:', response);
          },
          error => {
            // Handle error response from backend
            console.error('Error:', error);
          }
        );
      // Handle form submission
      console.log(user);
      this.router.navigate(['/sign-in']);
    }
  }
}
