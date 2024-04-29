import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeModule} from "./home/home.module";
import { HttpClientModule} from "@angular/common/http";
import { RecipesComponent } from './recipes/recipes.component';
import {RecipeDetailComponent} from "./recipe-detail/recipe-detail.component";
import {ReactiveFormsModule} from "@angular/forms";
import { SignupFormComponent } from "./sign-up-form/sign-up-form.component";
import { FavoritesComponent } from './favorites/favorites.component';

@NgModule({
    declarations: [
        AppComponent,
        RecipesComponent,
        RecipeDetailComponent,
        SignupFormComponent,
        FavoritesComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ReactiveFormsModule,
        HomeModule,
        HttpClientModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
