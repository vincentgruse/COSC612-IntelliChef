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
  showSignIn: boolean = false;

  constructor(
    private ingredientService: IngredientService,
    private router: Router
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

  showSignInPopup() {
    // Implement your logic to check if the user is logged in
    // For demonstration, let's assume userLoggedIn is a boolean indicating user's login status
    const userLoggedIn = false; // Replace this with your actual logic to check login status

    // If user is not logged in, show the sign-in popup
    if (!userLoggedIn) {
      this.showSignIn = true;
    }
  }
}
