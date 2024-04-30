import { Component, OnInit } from '@angular/core';
import { IngredientService } from '../services/ingredient.service';
import { Router } from "@angular/router";
import { Ingredient } from "../models/ingredient";
import { PopupService } from "../services/popup.service";
import { AuthenticationService } from "../services/authentication.service";
import {error} from "@angular/compiler-cli/src/transformers/util";
import {ToastrService} from "ngx-toastr";
import {RecipeService} from "../services/recipe.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  ingredients: Ingredient[] = []; // Array to store ingredients
  main_list_ingredients: Ingredient[] = []; // Array to store ingredients
  newIngredient: string = ''; // Input for new ingredient
  userLoggedIn: boolean = false;

  constructor(
    private ingredientService: IngredientService,
    private router: Router,
    private popupService: PopupService,
    private authService: AuthenticationService,
    private toastrService: ToastrService,
    private recipeService: RecipeService
  ) { }

  ngOnInit() {
    localStorage.removeItem("ingredients"); // Clear ingredients from local storage on component initialization
    this.userLoggedIn = this.isLoggedIn();
  }

  isLoggedIn(): boolean {
    return this.authService.checkAuthentication();
  }

  // Add new ingredient to the list
  addIngredient() {
    if (this.newIngredient.trim() !== '') {
      this.newIngredient = '';
      this.ingredients = this.ingredientService.getIngredients(); // Update ingredients list
    }
  }

  cookIngredients(){
    this.ingredientService.ingredients_id_list = this.main_list_ingredients
    this.recipeService.get_recipe_recommendations(this.ingredientService.ingredients_id_list).subscribe(
      recipes => {
        if (recipes){
          this.recipeService.recommended_recipes = recipes
        }
        if (!recipes.length){
          this.toastrService.warning('No recommendations found','Try again')
        }
      }
    )
    this.goToRecipes()
  }

  searchIngredient() {
    if (this.newIngredient && this.newIngredient.trim() !== '') {
      this.ingredientService.getIngredientsFromNameLike(this.newIngredient.trim()).subscribe(
        response => {
          if (response) {
            this.ingredients = response;
            if (response.length == 0){
              this.toastrService.warning('No ingredients found for '+ this.newIngredient.trim(),'Try again')
            }
          }
        }, error => {
          this.toastrService.error('Error in getting Ingredients')
        })
    }
  }

  // Delete ingredient from the list
  deleteIngredient(index: number) {
    this.ingredients = this.ingredients.filter(item => item.id !== index);// Update ingredients list
  }

  deleteMainIngredient(index: number) {
    this.main_list_ingredients = this.main_list_ingredients.filter(item => item.id !== index);// Update ingredients list

  }

  // Navigate to recipes page with selected ingredients
  goToRecipes() {
    const ingredients = this.recipeService.recommended_recipes.map(ingredient => ingredient.name); // Extract names from Ingredient objects
    this.router.navigate(['/protected/recipes'], { queryParams: { ingredients: ingredients.join(',') } });
  }

  showSignInPopup() {
    // If user is not logged in, show the sign-in popup
    if (!this.userLoggedIn) {
      this.popupService.openSignInPopup();
    }
  }

  addToMainIngredientList(id: number) {
    this.main_list_ingredients.push( this.ingredients.filter(item => item.id == id)[0])
    this.ingredients = this.ingredients.filter(item => item.id !== id);// Update ingredients list

  }

  clearIngredients() {
    this.ingredients = []
  }
}
