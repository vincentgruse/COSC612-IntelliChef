import { Component, OnInit } from '@angular/core';
import { Recipe } from "../models/recipe";
import { RecipeService } from "../services/recipe.service";
import { IngredientService } from "../services/ingredient.service";
import { Ingredient } from "../models/ingredient";
import { Router } from "@angular/router";

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css']
})
export class RecipesComponent implements OnInit{
  ingredients: Ingredient[] = [];
  recipes: Recipe[] = [];

  constructor(private router: Router,
              private recipeService: RecipeService,
              private ingredientService: IngredientService)
  {
    this.ingredients = this.ingredientService.getIngredients();
  }

  ngOnInit() {
    this.recipeService.getRecipes().subscribe(recipes => {
      this.recipes = recipes;
    });
  }

  // Method to navigate back to the home component
  goBack() {
    this.router.navigate(['/']); // Navigate to the root route
  }
}
