import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import { RecipesComponent } from "./recipes/recipes.component";
import {RecipeIndividualComponent} from "./recipe-individual/recipe-individual.component";

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: "home", component: HomeComponent},
  {path: "recipes", component: RecipesComponent},
  {path: "recipe-individual", component: RecipeIndividualComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
