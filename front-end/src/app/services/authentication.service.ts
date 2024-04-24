import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private apiURL = 'http://localhost:8000';
  private userStatus = false;

  constructor(private http: HttpClient) { }

  // Method to check if the user is logged in
  isLoggedIn(): boolean {
    return this.userStatus;
  }

  // Method to log out the user
  logout(): void {
    this.userStatus = false;
  }
}
