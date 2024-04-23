import { Component, OnInit, ElementRef, HostListener } from '@angular/core';
import { IngredientService } from '../services/ingredient.service';
import { Router } from "@angular/router";
import { Ingredient } from "../models/ingredient";
import {PopupService} from "../services/popup.service";
import {AuthenticationService} from "../services/authentication.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  ingredients: Ingredient[] = []; // Array to store ingredients
  newIngredient: string = ''; // Input for new ingredient
  userLoggedIn: boolean = false;

  constructor(
    private ingredientService: IngredientService,
    private router: Router,
    private popupService: PopupService,
    private authService: AuthenticationService
  ) { }

  ngOnInit() {
    localStorage.removeItem("ingredients"); // Clear ingredients from local storage on component initialization
    this.userLoggedIn = this.isLoggedIn();
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
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
    // If user is not logged in, show the sign-in popup
    if (!this.userLoggedIn) {
      this.popupService.openSignInPopup();
    }
  }
}
