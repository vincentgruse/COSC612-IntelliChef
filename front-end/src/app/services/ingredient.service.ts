import { Injectable } from '@angular/core';
import { Ingredient } from '../models/ingredient';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";

const BACKEND_URL = 'http://localhost:8000'
@Injectable({
  providedIn: 'root'
})
export class IngredientService {
  private localStorageKey = 'ingredients';

  constructor(private http: HttpClient) { }

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

  getIngredientsFromDatabase(): Observable<Ingredient[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    return this.http.get<Ingredient[]>(BACKEND_URL + '/ingredients', httpOptions);
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
    // save data to database
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    let ingredientList = ingredients.map(item => {
      return {
        id: 0,
        name: item?.name,
        description: "description",
        image: "description"
      }
    })
    this.http.post<any>(BACKEND_URL + '/ingredients', ingredientList, httpOptions).subscribe(
      response => {
        console.log('Data saved');
      }, error => {
        console.error('error occurred: ', error);
      }
    );

  }
}
