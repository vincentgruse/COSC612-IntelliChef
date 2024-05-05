import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from "../services/authentication.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.css']
})
export class AccountSettingsComponent implements OnInit {
  userInfo: any[] = []; // Array to hold user information objects

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getUserInfo();
  }

  getUserInfo(): void {
    this.authService.getUserInfo()
      .subscribe(
        (user: any) => {
          // Assuming the returned user object contains multiple properties like name, email, type, etc.
          // You can populate the userInfo array with each user information object
          this.userInfo.push({
            name: user.name,
            username: user.username,
            email: user.email,
            type: this.getUserType(user.type),
            created_on: this.formatDateTime(user.created_on)
          });
          // You can do further processing here if needed
        },
        (error: any) => {
          console.error('Failed to fetch user info:', error);
          // Handle error as per your requirement
        }
      );
  }

  // Method to convert user type from number to string
  getUserType(type: number): string {
    console.log(type);
    return type === 0 ? 'Administrator' : 'General User';
  }

  // Method to format date/time
  formatDateTime(dateTimeString: string): string {
    const dateTime = new Date(Date.parse(dateTimeString));
    // Define options object with specific types
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    };

    // Use options in toLocaleString
    return dateTime.toLocaleString('en-US', options);
  }

  goHome(): void {
    this.router.navigate(['/protected/home']);
  }
}
