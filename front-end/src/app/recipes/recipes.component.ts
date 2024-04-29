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
export class RecipesComponent implements OnInit {
  ingredients: Ingredient[] = [];
  recipes: Recipe[] = [];
  isFavorite: boolean = false;

  constructor(
    private router: Router,
    private recipeService: RecipeService,
    private ingredientService: IngredientService,
    private domSanitizer: DomSanitizer
  ) {
    this.ingredientService.getIngredientsFromDatabase().subscribe(
      ingredients => {
        this.ingredients = ingredients;
      },
      error => {
        console.error('Error fetching ingredients:', error);
      }
    );
  }

  ngOnInit() {
    this.recipeService.getRecipes().subscribe(recipes => {
      this.recipes = recipes;
      this.processRecipeImages();
    });
  }

  goBack() {
    try {
      this.router.navigate(['/protected/home']);
    } catch (error) {
      console.error('Error navigating back to home:', error);
    }
  }

  goToRecipe(recipeId: any) {
    try {
      this.router.navigate(['/protected/recipe', recipeId]); // Navigate to recipe detail with ID
    } catch (error) {
      console.error('Error navigating to recipe detail:', error);
    }
  }

  processRecipeImages() {
    if (this.recipes) {
      this.recipes.forEach(item => {
        item.image = <string>this.domSanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + item.image);
      });
    }
  }

  toggleFavorite(recipe: Recipe): void {
    // update favourite
    this.recipeService.updateFavourite(recipe?.id, !(recipe?.favourite) ? 1 : 0).subscribe(
      response => {
        if(response) {
          // update recipes array
          let itemIndex = this.recipes.findIndex(item => item.id == response.id);
          response.image = <string>this.domSanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + response.image);
          this.recipes[itemIndex] = response;
        }
        // this.processRecipeImages();
      }, error => {
        console.error('error occurred: ', error)
      }
    )
  }
}
