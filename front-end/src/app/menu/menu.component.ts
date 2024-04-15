import {Component, ElementRef, HostListener} from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  showDropdown = false; // State variable for managing dropdown visibility

  constructor(
    private elementRef: ElementRef
  ) {
  }

  // Toggle dropdown visibility
  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
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
}
