import {Component, OnInit} from '@angular/core';
import {Recipe} from "../models/recipe";
import {RecipeService} from "../services/recipe.service";

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css']
})
export class RecipesComponent implements OnInit{
  recipes: Recipe[] = [];

  constructor(private recipeService: RecipeService) {
  }

  ngOnInit() {
    this.recipeService.getRecipes().subscribe(recipes => {
      this.recipes = recipes
    })
  }

}
