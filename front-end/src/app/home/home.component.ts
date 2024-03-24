import {Component, OnInit} from '@angular/core';
import {IngredientModel} from "../models/ingredient.model";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  // Property to hold the name of a new ingredient
  newIngredient: string = "";

  // Array to store the list of ingredients
  ingredients: IngredientModel[] = [];

  // Lifecycle hook called after Angular has initialized all data-bound properties
  ngOnInit() {
    // Retrieve ingredients from localStorage if available
    let savedIngredients = localStorage.getItem("ingredients");
    this.ingredients = savedIngredients ? JSON.parse(savedIngredients) : [];
  }

  // Method to add a new ingredient
  addIngredient() {
    // Check if the new ingredient is not empty or whitespace
    if (this.newIngredient.trim().length) {
      // Create a new ingredient object
      let newIngredient: IngredientModel = {
        name: this.newIngredient
      };

      // Add the new ingredient to the list
      this.ingredients.push(newIngredient);

      // Clear the input field for new ingredients
      this.newIngredient = "";

      // Store the updated list of ingredients in localStorage
      localStorage.setItem("ingredients", JSON.stringify(this.ingredients));
    }
  }

  // Method to delete an ingredient
  deleteIngredient(index: number): void {
    // Remove the ingredient at the specified index from the list
    this.ingredients.splice(index, 1);

    // Update the list of ingredients in localStorage
    localStorage.setItem("ingredients", JSON.stringify(this.ingredients));
  }
}
