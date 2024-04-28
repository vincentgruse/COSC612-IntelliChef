import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";
import { BehaviorSubject } from 'rxjs'; // Import BehaviorSubject

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private apiURL = 'http://localhost:8000';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false); // Create BehaviorSubject
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable(); // Expose observable

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  checkAuthentication(): boolean {
    return this.isAuthenticatedSubject.getValue(); // Access value from BehaviorSubject
  }

  login(username: string, password: string) {
    const user = { username, password };

    // Send data to backend and return the observable
    return this.http.post<any>(this.apiURL + "/login", user);
  }

  logout() {
    this.isAuthenticatedSubject.next(false); // Update BehaviorSubject on logout
    sessionStorage.removeItem('auth_token');
  }
}
