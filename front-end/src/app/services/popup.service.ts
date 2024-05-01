import { Injectable } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { SignInComponent } from "../sign-in/sign-in.component";
import { HttpClient } from '@angular/common/http';
import { FormGroup } from "@angular/forms";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class PopupService {
  private apiURL = 'http://localhost:8000';
  constructor(
    private dialog: MatDialog,
    private http: HttpClient,
    private router: Router,
    private toastrService: ToastrService
  ) { }

  openSignInPopup() {
    this.dialog.open(SignInComponent);
  }

  submitFormData(form: FormGroup, user: any) {
    if (form.valid) {
      // Concatenate first name and last name into one string and assign it to user.name
      user.name = form.value.firstName + ' ' + form.value.lastName;
      user.username = form.value.username;
      user.email = form.value.email;
      user.password = form.value.password;

      // Send data to backend
      this.http.post<any>(this.apiURL + "/user", user)
        .subscribe(
          response => {
            // Handle successful response from backend
            if (response){
              this.toastrService.success('User created', 'success')
              console.log('Backend response:', response);

              // Handle form submission
              console.log(user);
              this.router.navigate(['/sign-in']);
            }
          },
          error => {
            // Handle error response from backend
            console.error('Error:', error);
            this.toastrService.error('Error occurred', 'Please try again')
          }
        );
    }
  }
}
