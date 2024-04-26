import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private apiURL = 'http://localhost:8000';
  isAuthenticated = false;

  constructor(
    private http: HttpClient
  ) { }

  checkAuthentication(): boolean {
    return this.isAuthenticated;
  }

  login(username: string, password: string) {
    const user = { username, password };

    // Send data to backend and return the observable
    return this.http.post<any>(this.apiURL + "/login", user);
  }

  logout() {
    this.isAuthenticated = false;
    sessionStorage.removeItem('auth_token');
  }
}
