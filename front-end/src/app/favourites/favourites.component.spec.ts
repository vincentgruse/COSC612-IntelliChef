import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FavouritesComponent } from './favourites.component';
import { RecipeService } from '../services/recipe.service';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { of } from 'rxjs';
import { Recipe } from '../models/recipe';

describe('FavouritesComponent', () => {
  let component: FavouritesComponent;
  let fixture: ComponentFixture<FavouritesComponent>;
  let recipeService: jasmine.SpyObj<RecipeService>;
  let router: jasmine.SpyObj<Router>;
  let domSanitizer: jasmine.SpyObj<DomSanitizer>;

  beforeEach(async () => {
    const recipeServiceSpy = jasmine.createSpyObj('RecipeService', ['getRecipes', 'updateFavourite']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const domSanitizerSpy = jasmine.createSpyObj('DomSanitizer', ['bypassSecurityTrustResourceUrl']);

    await TestBed.configureTestingModule({
      declarations: [ FavouritesComponent ],
      providers: [
        { provide: RecipeService, useValue: recipeServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: DomSanitizer, useValue: domSanitizerSpy }
      ]
    })
      .compileComponents();

    recipeService = TestBed.inject(RecipeService) as jasmine.SpyObj<RecipeService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    domSanitizer = TestBed.inject(DomSanitizer) as jasmine.SpyObj<DomSanitizer>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FavouritesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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
        favourite: true
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

  it('should navigate to recipe detail', () => {
    const recipeId = 1;

    component.goToRecipe(recipeId);

    expect(router.navigate).toHaveBeenCalledWith(['/recipe', recipeId]);
  });

  it('should toggle favourite status of a recipe', () => {
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

    component.toggleFavourite(recipe);

    expect(recipeService.updateFavourite).toHaveBeenCalledWith(recipe.id, 1);
    expect(component.recipes[0]).toEqual(recipe);
  });
});
