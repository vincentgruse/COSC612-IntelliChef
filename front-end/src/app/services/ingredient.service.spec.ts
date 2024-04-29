import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IngredientService } from './ingredient.service';
import { Ingredient } from '../models/ingredient';

describe('IngredientService', () => {
  let service: IngredientService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [IngredientService]
    });

    service = TestBed.inject(IngredientService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add ingredient to local storage', () => {
    const ingredient: Ingredient = { name: 'Test Ingredient' };
    service.addIngredient(ingredient);

    const ingredients = service.getIngredients();
    expect(ingredients.length).toBe(1);
    expect(ingredients[0].name).toBe('Test Ingredient');
  });

  it('should delete ingredient from local storage', () => {
    const ingredient: Ingredient = { name: 'Test Ingredient' };
    service.addIngredient(ingredient);
    service.deleteIngredient(0);

    const ingredients = service.getIngredients();
    expect(ingredients.length).toBe(0);
  });

  it('should get ingredients from database', (done: DoneFn) => {
    const dummyIngredients: Ingredient[] = [
      { name: 'Ingredient 1' },
      { name: 'Ingredient 2' }
    ];

    service.getIngredientsFromDatabase().subscribe(ingredients => {
      expect(ingredients.length).toBe(2);
      expect(ingredients).toEqual(dummyIngredients);
      done();
    });

    const request = httpMock.expectOne('http://localhost:8000/ingredients');
    expect(request.request.method).toBe('GET');
    request.flush(dummyIngredients);
  });

  it('should save ingredients to database when adding ingredient', () => {
    const ingredient: Ingredient = { name: 'Test Ingredient' };
    const spy = spyOn<any>(service, 'saveIngredients').and.callThrough();

    service.addIngredient(ingredient);

    expect(spy).toHaveBeenCalledOnceWith([ingredient]);
  });
});
