import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from "./home/home.component";
import { RecipesComponent } from "./recipes/recipes.component";
import { RecipeDetailComponent } from "./recipe-detail/recipe-detail.component";
import {SignupFormComponent} from "./sign-up-form/sign-up-form.component";

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: "home", component: HomeComponent},
  {path: "recipes", component: RecipesComponent},
  {path: "recipe/:id", component: RecipeDetailComponent},
  {path: "sign-up-form", component: SignupFormComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
