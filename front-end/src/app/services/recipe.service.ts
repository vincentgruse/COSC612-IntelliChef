import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Recipe } from '../models/recipe';
import {Ingredient} from "../models/ingredient";

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private apiURL = 'http://localhost:8000';
  private _recommended_recipes: Recipe[] = []

  constructor(private http: HttpClient) {}

  // Fetch a single recipe by ID from the backend server
  getRecipeById(recipeId: string): Observable<Recipe> {
    return this.http.get<Recipe>(this.apiURL + "/recipe/" + recipeId);
  }

  // Fetch recipes from the backend server
  getRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(this.apiURL + "/recipes");
  }

  uploadRecipeImage(formData: FormData): Observable<any> {
    // 'Content-Type: multipart/form-data'
    let headers = new HttpHeaders();
    headers= headers.append('content-type', ' multipart/form-data');
    return this.http.patch<any>(this.apiURL + "/recipe/", formData);
  }

  updateFavourite(recipe_id: number, favourite: number): Observable<Recipe> {
    // using a form to send values
    const body = new FormData();
    body.append('recipe_id', recipe_id.toString());
    body.append('favourite', favourite.toString());
    return this.http.patch<Recipe>(this.apiURL + "/add_to_favourites", body);
  }
  // recommended_recipes_by_ingredients/?ingredients=2&ingredients=3
  get_recipe_recommendations(ingredients: Ingredient[]): Observable<[Recipe]> {
    // ?ingredients=2&ingredients=34
    let requestParaString = '?';
    for (let ingredient of ingredients){
      // create request para string
      requestParaString = requestParaString.concat('ingredients=' + ingredient.id + '&')
    }
    // remove the trailing '&' character
    requestParaString = requestParaString.substring(0, requestParaString.length - 1);
    return this.http.get<[Recipe]>(this.apiURL + "/recommended_recipes_by_ingredients" + requestParaString);

  }


  get recommended_recipes(): Recipe[] {
    return this._recommended_recipes;
  }

  set recommended_recipes(value: Recipe[]) {
    this._recommended_recipes = value;
  }
}
