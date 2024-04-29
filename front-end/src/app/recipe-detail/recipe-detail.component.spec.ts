import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RecipesComponent } from '../recipes/recipes.component';
import { RecipeService } from '../services/recipe.service';
import { IngredientService } from '../services/ingredient.service';
import { DomSanitizer } from '@angular/platform-browser';
import { of } from 'rxjs';
import { Recipe } from '../models/recipe';
import { Ingredient } from '../models/ingredient';
import { Router } from '@angular/router';

describe('RecipesComponent', () => {
  let component: RecipesComponent;
  let fixture: ComponentFixture<RecipesComponent>;
  let recipeServiceSpy: jasmine.SpyObj<RecipeService>;
  let ingredientServiceSpy: jasmine.SpyObj<IngredientService>;
  let domSanitizerSpy: jasmine.SpyObj<DomSanitizer>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockRecipes: Recipe[] = [
    { id: 1, name: 'Recipe 1', image: 'mock_image_1', description: 'mock_description_1',
      ingredients: ['mock_ingredient_1'], instructions: 'mock_instruction_1', favourite: false },
    { id: 2, name: 'Recipe 2', image: 'mock_image_2', description: 'mock_description_2',
      ingredients: ['mock_ingredient_2'], instructions: 'mock_instruction_2', favourite: false }
  ];

  const mockIngredients: Ingredient[] = [
    { name: 'Ingredient 1' },
    { name: 'Ingredient 2' }
  ];

  beforeEach(async(() => {
    recipeServiceSpy = jasmine.createSpyObj('RecipeService', ['getRecipes', 'updateFavourite']);
    ingredientServiceSpy = jasmine.createSpyObj('IngredientService', ['getIngredientsFromDatabase']);
    domSanitizerSpy = jasmine.createSpyObj('DomSanitizer', ['bypassSecurityTrustResourceUrl']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      declarations: [RecipesComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: RecipeService, useValue: recipeServiceSpy },
        { provide: IngredientService, useValue: ingredientServiceSpy },
        { provide: DomSanitizer, useValue: domSanitizerSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipesComponent);
    component = fixture.componentInstance;
    recipeServiceSpy.getRecipes.and.returnValue(of(mockRecipes));
    ingredientServiceSpy.getIngredientsFromDatabase.and.returnValue(of(mockIngredients));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to home when goBack is called', () => {
    component.goBack();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/protected/home']);
  });

  it('should navigate to recipe detail when goToRecipe is called', () => {
    const recipeId = 1;
    component.goToRecipe(recipeId);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/protected/recipe', recipeId]);
  });

  it('should toggle favorite status of a recipe', () => {
    const recipeToUpdate = mockRecipes[0];
    recipeServiceSpy.updateFavourite.and.returnValue(of({ ...recipeToUpdate, favourite: !recipeToUpdate.favourite }));

    component.toggleFavorite(recipeToUpdate);

    expect(recipeServiceSpy.updateFavourite).toHaveBeenCalledWith(recipeToUpdate.id, recipeToUpdate.favourite ? 0 : 1);
    expect(component.recipes[0].favourite).toEqual(!recipeToUpdate.favourite);
  });

  it('should process recipe images', () => {
    component.recipes = mockRecipes;
    component.processRecipeImages();

    expect(domSanitizerSpy.bypassSecurityTrustResourceUrl).toHaveBeenCalledTimes(2);
  });
});
