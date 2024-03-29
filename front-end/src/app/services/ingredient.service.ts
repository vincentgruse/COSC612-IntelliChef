import { Injectable } from '@angular/core';
import { Ingredient } from '../models/ingredient';

@Injectable({
  providedIn: 'root'
})
export class IngredientService {
  private ingredients: Ingredient[] = []; // Array of Ingredient objects

  constructor() { }

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
