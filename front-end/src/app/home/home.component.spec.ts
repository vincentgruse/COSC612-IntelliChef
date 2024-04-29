import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HomeComponent } from './home.component';
import { IngredientService } from '../services/ingredient.service';
import { Router } from '@angular/router';
import { PopupService } from '../services/popup.service';
import { AuthenticationService } from '../services/authentication.service';
import { Ingredient } from '../models/ingredient';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let ingredientService: jasmine.SpyObj<IngredientService>;
  let router: Router;
  let popupService: jasmine.SpyObj<PopupService>;
  let authService: jasmine.SpyObj<AuthenticationService>;

  beforeEach(async () => {
    const ingredientServiceSpy = jasmine.createSpyObj('IngredientService', ['addIngredient', 'deleteIngredient', 'getIngredients']);
    const popupServiceSpy = jasmine.createSpyObj('PopupService', ['openSignInPopup']);
    const authServiceSpy = jasmine.createSpyObj('AuthenticationService', ['checkAuthentication']);

    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: IngredientService, useValue: ingredientServiceSpy },
        { provide: PopupService, useValue: popupServiceSpy },
        { provide: AuthenticationService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    ingredientService = TestBed.inject(IngredientService) as jasmine.SpyObj<IngredientService>;
    router = TestBed.inject(Router);
    popupService = TestBed.inject(PopupService) as jasmine.SpyObj<PopupService>;
    authService = TestBed.inject(AuthenticationService) as jasmine.SpyObj<AuthenticationService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add ingredient', () => {
    component.newIngredient = 'Test Ingredient';
    const mockIngredient: Ingredient = { name: 'Test Ingredient' };
    ingredientService.addIngredient.and.stub();
    component.addIngredient();
    expect(ingredientService.addIngredient).toHaveBeenCalledWith(mockIngredient);
  });

  it('should delete ingredient', () => {
    ingredientService.deleteIngredient.and.stub();
    component.deleteIngredient(0);
    expect(ingredientService.deleteIngredient).toHaveBeenCalledWith(0);
  });

  it('should navigate to recipes', () => {
    component.ingredients = [{ name: 'Ingredient 1' }, { name: 'Ingredient 2' }];
    spyOn(router, 'navigate').and.stub();
    component.goToRecipes();
    expect(router.navigate).toHaveBeenCalledWith(['/protected/recipes'], { queryParams: { ingredients: 'Ingredient 1,Ingredient 2' } });
  });

  it('should show sign-in popup if user is not logged in', () => {
    authService.checkAuthentication.and.returnValue(false);
    component.showSignInPopup();
    expect(popupService.openSignInPopup).toHaveBeenCalled();
  });

  it('should not show sign-in popup if user is logged in', () => {
    authService.checkAuthentication.and.returnValue(true);
    component.showSignInPopup();
    expect(popupService.openSignInPopup).not.toHaveBeenCalled();
  });
});
