import { Component, OnInit, ElementRef, HostListener } from '@angular/core';
import { IngredientService } from '../services/ingredient.service';
import { Router } from "@angular/router";
import { Ingredient } from "../models/ingredient";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  ingredients: Ingredient[] = []; // Array to store ingredients
  newIngredient: string = ''; // Input for new ingredient
  showDropdown = false; // State variable for managing dropdown visibility

  constructor(
    private ingredientService: IngredientService,
    private router: Router,
    private elementRef: ElementRef
  ) { }

  ngOnInit() {
    localStorage.removeItem("ingredients"); // Clear ingredients from local storage on component initialization
  }

  // Add new ingredient to the list
  addIngredient() {
    if (this.newIngredient.trim() !== '') {
      const newIngredient: Ingredient = { name: this.newIngredient.trim() };
      this.ingredientService.addIngredient(newIngredient);
      this.newIngredient = '';
      this.ingredients = this.ingredientService.getIngredients(); // Update ingredients list
    }
  }

  // Delete ingredient from the list
  deleteIngredient(index: number) {
    this.ingredientService.deleteIngredient(index);
    this.ingredients = this.ingredientService.getIngredients(); // Update ingredients list
  }

  // Navigate to recipes page with selected ingredients
  goToRecipes() {
    const ingredients = this.ingredients.map(ingredient => ingredient.name); // Extract names from Ingredient objects
    this.router.navigate(['/recipes'], { queryParams: { ingredients: ingredients.join(',') } });
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
