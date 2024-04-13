import { NgModule } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { HomeComponent } from './home.component';
import {RouterModule} from "@angular/router";
import {FormsModule} from "@angular/forms";
import { RecipeIndividualComponent } from '../recipe-individual/recipe-individual.component';



@NgModule({
  declarations: [
    HomeComponent,
    RecipeIndividualComponent
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
