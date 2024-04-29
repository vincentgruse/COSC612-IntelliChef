import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { PopupService } from '../services/popup.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  showDropdown = false; // State variable for managing dropdown visibility
  buttonText: string = ''; // Button text for sign-in or logout

  constructor(
    private elementRef: ElementRef,
    private authService: AuthenticationService,
    private popupService: PopupService
  ) {}

  ngOnInit() {
    // Subscribe to the observable
    this.authService.isAuthenticated$.subscribe(isAuthenticated => {
      console.log('isAuthenticated: ', isAuthenticated)
      this.buttonText = isAuthenticated ? 'Log out' : 'Sign In';
    });
  }

  // Toggle dropdown visibility
  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  logout(){
    this.authService.logout();
  }

  // Close dropdown
  closeDropdown() {
    this.showDropdown = false;
  }

  // Listen for click events to close dropdown when clicked outside
  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const clickedElement = event.target as HTMLElement;
    const dropdownContainer = this.elementRef.nativeElement.querySelector('.user-dropdown');

    if (dropdownContainer && !dropdownContainer.contains(clickedElement)) {
      this.closeDropdown(); // Close dropdown if clicked outside
    }
  }

  // Handle sign-in or logout action based on authentication state
  handleAuthenticationAction() {
    console.log(this.authService.checkAuthentication())
    if (this.authService.checkAuthentication()) {
      // If authenticated, perform logout
      this.authService.logout();
    } else {
      // If not authenticated, open sign-in popup
      this.popupService.openSignInPopup();
    }
  }
}
