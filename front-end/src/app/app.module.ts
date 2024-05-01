import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeModule} from "./home/home.module";
import { HttpClientModule} from "@angular/common/http";
import { RecipesComponent } from './recipes/recipes.component';
import { FavouritesComponent } from "./favourites/favourites.component";
import { RecipeDetailComponent } from "./recipe-detail/recipe-detail.component";
import { ReactiveFormsModule } from "@angular/forms";
import { ToastrModule } from "ngx-toastr";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import {DatePipe} from "@angular/common";

@NgModule({
  declarations: [
    AppComponent,
    RecipesComponent,
    RecipeDetailComponent,
    FavouritesComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HomeModule,
    HttpClientModule,
    ToastrModule.forRoot(),
  ],
  providers: [
    DatePipe
  ],
  exports: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
