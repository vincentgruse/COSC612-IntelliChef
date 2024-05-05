import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from "./home/home.component";
import { RecipesComponent } from "./recipes/recipes.component";
import { RecipeDetailComponent } from "./recipe-detail/recipe-detail.component";
import { SignUpComponent } from "./sign-up/sign-up.component";
import { SignInComponent } from "./sign-in/sign-in.component";
import { AuthGuard } from "./auth.guard";
import { FavouritesComponent } from "./favourites/favourites.component";
import { AccountSettingsComponent } from "./account-settings/account-settings.component";

const routes: Routes = [

  {
    path: "",
    redirectTo: '/protected/home',
    pathMatch: 'full'
  },
  {
    path: "sign-up",
    component: SignUpComponent
  },
  {
    path: "sign-in",
    component: SignInComponent
  },
  {
    path: 'protected',
    canActivate: [AuthGuard],
    children: [
      {path: '', redirectTo: '/home', pathMatch: 'full'},
      {
        path: "home",
        component: HomeComponent
      },
      {
        path: "recipes",
        component: RecipesComponent,
        canActivate: [AuthGuard]
      },
      {
        path: "recipe/:id",
        component: RecipeDetailComponent,
        canActivate: [AuthGuard]
      },
      {
        path: "sign-up",
        component: SignUpComponent
      },
      {
        path: "sign-in",
        component: SignInComponent
      },
      {
        path: "favourites",
        component: FavouritesComponent,
        canActivate: [AuthGuard]
      },
      {
        path: "account-settings",
        component: AccountSettingsComponent,
        canActivate: [AuthGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
