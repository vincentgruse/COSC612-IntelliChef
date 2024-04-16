import { NgModule } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { HomeComponent } from './home.component';
import {RouterModule} from "@angular/router";
import {MenuComponent} from "../menu/menu.component";
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    HomeComponent,
    MenuComponent
  ],
  exports: [
    HomeComponent,
    MenuComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgOptimizedImage,
    FormsModule
  ]
})
export class HomeModule { }
