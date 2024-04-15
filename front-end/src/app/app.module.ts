import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeModule} from "./home/home.module";
import { HttpClientModule} from "@angular/common/http";
import { RecipesComponent } from './recipes/recipes.component';
import {RecipeDetailComponent} from "./recipe-detail/recipe-detail.component";

@NgModule({
    declarations: [
        AppComponent,
        RecipesComponent,
        RecipeDetailComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HomeModule,
        HttpClientModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
