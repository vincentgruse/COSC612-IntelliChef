import { Component, HostListener, OnInit } from '@angular/core';
import { Recipe } from "../models/recipe";
import { RecipeService } from "../services/recipe.service";
import { IngredientService } from "../services/ingredient.service";
import { Ingredient } from "../models/ingredient";
import { Router } from "@angular/router";
import { ElementRef } from "@angular/core";
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css']
})
export class RecipesComponent implements OnInit {
  ingredients: Ingredient[] = []; // Array to store ingredients
  recipes: Recipe[] = []; // Array to store recipes
  showDropdown = false; // State variable for managing dropdown visibility

  constructor(
    private router: Router,
    private recipeService: RecipeService,
    private ingredientService: IngredientService,
    private elementRef: ElementRef,
    private domSanitizer: DomSanitizer
  ) {
    // Fetch ingredients from the database on component initialization
    this.ingredientService.getIngredientsFromDatabase().subscribe(
      ingredients => {
        console.log('Fetched ingredients:', ingredients);
        this.ingredients = ingredients;
      },
      error => {
        console.error('Error fetching ingredients:', error);
        // Handle error, e.g., display an error message to the user
      }
    );
  }

  ngOnInit() {
    // Fetch recipes on component initialization
    this.recipeService.getRecipes().subscribe(recipes => {
      this.recipes = recipes;
      // Process image data for recipes
      if (this.recipes) {
        this.recipes.forEach(item => {
          item.image = <string>this.domSanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + item.image)
        });
      }
      console.log('Fetched recipes:', this.recipes);
    });
  }

  // Method to navigate back to the home component
  goBack() {
    try {
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Error navigating back to home:', error);
      // Handle error, e.g., display an error message to the user
    }
  }

  goToRecipe() {
    try {
      this.router.navigate(['/recipe-individual']);
    } catch (error) {
      console.error('Error navigating to recipe-individual', error);
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
