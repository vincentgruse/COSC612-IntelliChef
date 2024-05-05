import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs'; // Import BehaviorSubject
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private apiURL = 'http://localhost:8000';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false); // Create BehaviorSubject
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable(); // Expose observable
  private _isAuthenticated = false;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.refreshAuthDetails();
  }

  private refreshAuthDetails() {
    if (sessionStorage.getItem('auth_token')) {
      this.isAuthenticated = true
      this.isAuthenticatedSubject.next(true);
    }
  }

  checkAuthentication(): boolean {
    this.refreshAuthDetails();
    return this.isAuthenticatedSubject.getValue(); // Access value from BehaviorSubject
  }

  login(username: string, password: string) {
    const user = { username, password };

    // Send data to backend and return the observable
    let body = new FormData();
    body.append('username', username);
    body.append('password', password);
    return this.http.post<any>(this.apiURL + "/login", body);
  }

  logout() {
    this.isAuthenticatedSubject.next(false); // Update BehaviorSubject on logout
    sessionStorage.removeItem('auth_token');
    this.router.navigate(['/sign-in']);
  }

  successful_login() {
    this.isAuthenticatedSubject.next(true); // Update BehaviorSubject on logout
  }

  getUserInfo(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + sessionStorage.getItem('auth_token')
    });
    return this.http.get<any>(this.apiURL + "/users/me", { headers });
  }

  get isAuthenticated(): boolean {
    return <boolean>(sessionStorage.getItem('auth_token') && this._isAuthenticated);
  }

  set isAuthenticated(value: boolean) {
    this._isAuthenticated = value;
  }
}
