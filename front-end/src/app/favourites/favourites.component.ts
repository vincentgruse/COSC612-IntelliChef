import { Component, OnInit } from '@angular/core';
import { Recipe } from "../models/recipe";
import { RecipeService } from "../services/recipe.service";
import { Router } from "@angular/router";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  styleUrl: './favourites.component.css'
})
export class FavouritesComponent implements OnInit {
  recipes: Recipe[] = [];
  isFavourite: boolean = false;

  constructor(
    private router: Router,
    private recipeService: RecipeService,
    private domSanitizer: DomSanitizer
  ) {
  }

  ngOnInit() {
    this.recipeService.getFavouriteRecipes().subscribe(recipes => {
      this.recipes = recipes;
      this.processRecipeImages();
    });
  }

  goToRecipe(recipeId: any) {
    try {
      this.router.navigate(['protected/recipe', recipeId]); // Navigate to recipe detail with ID
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

  toggleFavourite(recipe: Recipe): void {
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
