import { Injectable } from '@angular/core';
import { Ingredient } from '../models/ingredient';

@Injectable({
  providedIn: 'root'
})
export class IngredientService {
  private localStorageKey = 'ingredients';

  constructor() { }

  // Create operation
  addIngredient(ingredient: Ingredient) {
    const ingredients = this.getIngredients();
    ingredients.push(ingredient);
    this.saveIngredients(ingredients);
  }

  // Read operation
  getIngredients(): Ingredient[] {
    const storedIngredients = localStorage.getItem(this.localStorageKey);
    return storedIngredients ? JSON.parse(storedIngredients) : [];
  }

  // Delete operation
  deleteIngredient(index: number) {
    const ingredients = this.getIngredients();
    if (index >= 0 && index < ingredients.length) {
      ingredients.splice(index, 1);
      this.saveIngredients(ingredients);
    }
  }

  private saveIngredients(ingredients: Ingredient[]) {
    localStorage.setItem(this.localStorageKey, JSON.stringify(ingredients));
  }
}
