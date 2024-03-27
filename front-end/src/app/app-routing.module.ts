import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {IngredientListComponent} from "./ingredient-list/ingredient-list.component";

const routes: Routes = [
  {path: "", component: HomeComponent},
  {path: "ingredient-list", component: IngredientListComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
