import {Component, HostListener, ElementRef} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-recipe-individual',
  templateUrl: './recipe-individual.component.html',
  styleUrls: ['./recipe-individual.component.css']
})
export class RecipeIndividualComponent {
  showDropdown = false; // State variable for managing dropdown visibility

  constructor(
    private router: Router,
    private elementRef: ElementRef
  ) { }

  // Method to navigate back to the home component
  goBack() {
    try {
      this.router.navigate(['/recipes']);
    } catch (error) {
      console.error('Error navigating back to home:', error);
      // Handle error, e.g., display an error message to the user
    }
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
