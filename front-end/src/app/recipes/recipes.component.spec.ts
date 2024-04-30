import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RecipesComponent } from './recipes.component';
import { RecipeService } from '../services/recipe.service';
import { IngredientService } from '../services/ingredient.service';
import { of } from 'rxjs';
import { Recipe } from '../models/recipe';
import { Ingredient } from '../models/ingredient';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from "@angular/router";

describe('RecipesComponent', () => {
  let component: RecipesComponent;
  let fixture: ComponentFixture<RecipesComponent>;
  let recipeService: jasmine.SpyObj<RecipeService>;
  let ingredientService: jasmine.SpyObj<IngredientService>;
  let domSanitizer: jasmine.SpyObj<DomSanitizer>;
  let routerSpy: jasmine.SpyObj<any>;

  beforeEach(async () => {
    const recipeServiceSpy = jasmine.createSpyObj('RecipeService', ['getRecipes', 'updateFavourite']);
    const ingredientServiceSpy = jasmine.createSpyObj('IngredientService', ['getIngredientsFromDatabase']);
    const domSanitizerSpy = jasmine.createSpyObj('DomSanitizer', ['bypassSecurityTrustResourceUrl']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [ RecipesComponent ],
      imports: [RouterTestingModule],
      providers: [
        { provide: RecipeService, useValue: recipeServiceSpy },
        { provide: IngredientService, useValue: ingredientServiceSpy },
        { provide: DomSanitizer, useValue: domSanitizerSpy },
        { provide: Router, useValue: routerSpyObj }
      ]
    })
      .compileComponents();

    recipeService = TestBed.inject(RecipeService) as jasmine.SpyObj<RecipeService>;
    ingredientService = TestBed.inject(IngredientService) as jasmine.SpyObj<IngredientService>;
    domSanitizer = TestBed.inject(DomSanitizer) as jasmine.SpyObj<DomSanitizer>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<any>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch ingredients from the service', () => {
    const ingredients: Ingredient[] = [{ name: 'Ingredient 1' }];
    ingredientService.getIngredientsFromDatabase.and.returnValue(of(ingredients));

    component.ngOnInit();

    expect(component.ingredients).toEqual(ingredients);
  });

  it('should fetch recipes from the service and process images', () => {
    const recipes: Recipe[] = [
      {
        id: 1,
        name: 'Recipe 1',
        image: 'base64_encoded_image_data',
        description: 'Description for Recipe 1',
        ingredients: [{ name: 'Ingredient 1', quantity: 100, unit: 'g' }, { name: 'Ingredient 2', quantity: 2, unit: 'cups' }],
        instructions: 'Instructions for Recipe 1',
        favourite: false
      },
      {
        id: 2,
        name: 'Recipe 2',
        image: 'base64_encoded_image_data',
        description: 'Description for Recipe 2',
        ingredients: [{ name: 'Ingredient 3', quantity: 200, unit: 'g' }, { name: 'Ingredient 4', quantity: 3, unit: 'cups' }],
        instructions: 'Instructions for Recipe 2',
        favourite: true
      }
    ];
    recipeService.getRecipes.and.returnValue(of(recipes));

    component.ngOnInit();

    expect(component.recipes).toEqual(recipes);
    expect(domSanitizer.bypassSecurityTrustResourceUrl).toHaveBeenCalled();
  });

  it('should navigate back to home', () => {
    component.goBack();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/protected/home']);
  });

  it('should navigate to recipe detail', () => {
    const recipeId = 1;

    component.goToRecipe(recipeId);

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/protected/recipe', recipeId]);
  });

  it('should toggle favorite status of a recipe', () => {
    const recipe: Recipe =
      {
        id: 1,
        name: 'Recipe 1',
        image: 'base64_encoded_image_data',
        description: 'Description for Recipe 1',
        ingredients: [{ name: 'Ingredient 1', quantity: 100, unit: 'g' }, { name: 'Ingredient 2', quantity: 2, unit: 'cups' }],
        instructions: 'Instructions for Recipe 1',
        favourite: false
      };
    recipeService.updateFavourite.and.returnValue(of(recipe));

    component.toggleFavorite(recipe);

    expect(recipeService.updateFavourite).toHaveBeenCalledWith(recipe.id, 1);
    expect(component.recipes[0]).toEqual(recipe);
  });
});
