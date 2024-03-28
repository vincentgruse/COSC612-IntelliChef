import { Injectable } from '@angular/core';
import { Ingredient } from '../models/ingredient';

@Injectable({
  providedIn: 'root'
})
export class IngredientService {
  private ingredients: Ingredient[] = []; // Array of Ingredient objects

  constructor() {
    // Initialize ingredients array with sample data
    this.ingredients = [
      { name: 'Ingredient 1' },
      { name: 'Ingredient 2' },
      // Add more sample ingredients as needed
    ];
  }

  // Create operation
  addIngredient(ingredient: Ingredient) {
    this.ingredients.push(ingredient);
  }

  // Read operation
  getIngredients(): Ingredient[] {
    return this.ingredients;
  }

  // Delete operation
  deleteIngredient(index: number) {
    if (index >= 0 && index < this.ingredients.length) {
      this.ingredients.splice(index, 1);
    }
  }
}
