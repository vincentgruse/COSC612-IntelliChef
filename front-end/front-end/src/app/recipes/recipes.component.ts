import { Component, OnInit } from '@angular/core';
import { Recipe } from "../models/recipe";
import { RecipeService } from "../services/recipe.service";
import { IngredientService } from "../services/ingredient.service";
import { Ingredient } from "../models/ingredient";
import { Router } from "@angular/router";

import { DomSanitizer } from '@angular/platform-browser';

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
              private ingredientService: IngredientService,
              private domSanitizer: DomSanitizer)
  {
    this.ingredientService.getIngredientsFromDatabase().subscribe(ingredients => {
      console.log('result: ', ingredients)
      this.ingredients = ingredients;
    });
  }

  ngOnInit() {
    this.recipeService.getRecipes().subscribe(recipes => {
      this.recipes = recipes;
      // process image data
      if (this.recipes) {
        this.recipes.forEach(item => {
          item.image = <string>this.domSanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + item.image)
        });
      }
      console.log('recipes: ', this.recipes)
    });
  }

  // Method to navigate back to the home component
  goBack() {
    this.router.navigate(['/']); // Navigate to the root route
  }
}
