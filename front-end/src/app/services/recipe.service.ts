import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Recipe } from '../models/recipe';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private apiURL = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  // Fetch a single recipe by ID from the backend server
  getRecipeById(recipeId: string): Observable<Recipe> {
    return this.http.get<Recipe>(this.apiURL + "/recipe/" + recipeId);
  }

  // Fetch recipes from the backend server
  getRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(this.apiURL + "/recipes");
  }

  uploadRecipeImage(recipeId: string, formData: FormData): Observable<any> {
    return this.http.post<any>(this.apiURL + "/recipe/" + recipeId + "/upload-image", formData);
  }

  updateFavourite(recipe_id: number, favourite: number): Observable<Recipe> {
    // using a form to send values
    const body = new FormData();
    body.append('recipe_id', recipe_id.toString());
    body.append('favourite', favourite.toString());
    return this.http.patch<Recipe>(this.apiURL + "/add_to_favourites", body);
  }
}
