import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { RecipeService } from './recipe.service';
import { Recipe } from '../models/recipe';

describe('RecipeService', () => {
  let service: RecipeService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RecipeService]
    });

    service = TestBed.inject(RecipeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch a single recipe by ID from the backend server', () => {
    const recipeId = '123';
    const dummyRecipe: Recipe = {
      id: 123,
      name: 'Test Recipe',
      image: 'base64encodedimage',
      description: 'Test Description',
      ingredients: [],
      instructions: 'Test Instructions',
      favourite: false
    };

    service.getRecipeById(recipeId).subscribe(recipe => {
      expect(recipe).toEqual(dummyRecipe);
    });

    const req = httpMock.expectOne('http://localhost:8000/recipe/123');
    expect(req.request.method).toBe('GET');
    req.flush(dummyRecipe);
  });

  it('should fetch recipes from the backend server', () => {
    const dummyRecipes: Recipe[] = [
      {
        id: 1,
        name: 'Recipe 1',
        image: 'base64encodedimage1',
        description: 'Description 1',
        ingredients: [],
        instructions: 'Instructions 1',
        favourite: false
      },
      {
        id: 2,
        name: 'Recipe 2',
        image: 'base64encodedimage2',
        description: 'Description 2',
        ingredients: [],
        instructions: 'Instructions 2',
        favourite: false
      }
    ];

    service.getRecipes().subscribe(recipes => {
      expect(recipes.length).toBe(2);
      expect(recipes).toEqual(dummyRecipes);
    });

    const req = httpMock.expectOne('http://localhost:8000/recipes');
    expect(req.request.method).toBe('GET');
    req.flush(dummyRecipes);
  });

  it('should upload recipe image to the backend server', () => {
    const recipeId = '123';
    const formData = new FormData();
    formData.append('image', new File([''], 'test.jpg'));

    service.uploadRecipeImage(formData).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne('http://localhost:8000/recipe/123/upload-image');
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should update favourite status of a recipe', () => {
    const recipeId = 123;
    const favourite = 1;

    service.updateFavourite(recipeId, favourite).subscribe(recipe => {
      expect(recipe).toBeTruthy();
    });

    const req = httpMock.expectOne('http://localhost:8000/add_to_favourites');
    expect(req.request.method).toBe('PATCH');
    req.flush({});
  });
});
