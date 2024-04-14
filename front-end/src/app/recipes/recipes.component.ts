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
  ingredients: Ingredient[] = [];
  recipes: Recipe[] = [];
  showDropdown = false;
  isFavorite: boolean = false;

  constructor(
    private router: Router,
    private recipeService: RecipeService,
    private ingredientService: IngredientService,
    private elementRef: ElementRef,
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
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Error navigating back to home:', error);
    }
  }

  goToRecipe(recipeId: string) {
    try {
      this.router.navigate(['/recipe', recipeId]); // Navigate to recipe detail with ID
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

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  closeDropdown() {
    this.showDropdown = false;
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const clickedElement = event.target as HTMLElement;
    const dropdownContainer = this.elementRef.nativeElement.querySelector('.user-dropdown');

    if (dropdownContainer && !dropdownContainer.contains(clickedElement)) {
      this.closeDropdown();
    }
  }

  toggleFavorite(): void {
    this.isFavorite =!this.isFavorite;
  }
}
