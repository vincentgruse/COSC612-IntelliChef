import { NgModule } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { HomeComponent } from './home.component';
import {RouterModule} from "@angular/router";
import {FormsModule} from "@angular/forms";
import { RecipeDetailComponent } from '../recipe-detail/recipe-detail.component';



@NgModule({
  declarations: [
    HomeComponent
  ],
  exports: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NgOptimizedImage
  ]
})
export class HomeModule { }
