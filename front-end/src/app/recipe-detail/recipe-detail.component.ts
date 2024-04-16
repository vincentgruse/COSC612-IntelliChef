import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import { Recipe } from "../models/recipe";
import { RecipeService } from "../services/recipe.service";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: 'app-recipe-individual',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe  = {description: "", favourite: false, id: 0, image: "", ingredients: [], instructions: "", name: ""};

  constructor(
    private recipeService: RecipeService,
    private router: Router,
    private route: ActivatedRoute,
    private domSanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const recipeId = params.get('id'); // Get the recipe ID from route parameters
      if (recipeId !== null) { // Check if recipeId is not null
        this.loadRecipe(recipeId);
        console.log("Success with recipe id: " + recipeId)
      } else {
        // Handle the case where recipeId is null, e.g., navigate to an error page or display a message
        console.error('Recipe ID is null');
      }
    });
  }

  loadRecipe(recipeId: string) {
    this.recipeService.getRecipeById(recipeId).subscribe(recipe => {
      // Assign values to the recipe object
      this.recipe.id = recipe.id;
      this.recipe.name = recipe.name;
      this.recipe.image = recipe.image;
      this.recipe.description = recipe.description;
      this.recipe.ingredients = recipe.ingredients;
      this.recipe.instructions = recipe.instructions;

      this.processRecipeImage()
    });
  }

  processRecipeImage(): void {
    if (this.recipe) {
      this.recipe.image = <string>this.domSanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + this.recipe.image);
    }
  }

  // Method to navigate back to the recipes component
  goBack(): void {
    this.router.navigate(['/recipes']);
  }
}
