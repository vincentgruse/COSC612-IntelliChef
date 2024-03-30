import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Recipe } from '../models/recipe';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private apiURL = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  // Fetch recipes from the backend server
  getRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(this.apiURL + "/recipes");
  }
}
