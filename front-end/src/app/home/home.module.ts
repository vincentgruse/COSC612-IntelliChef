import { NgModule } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { HomeComponent } from './home.component';
import {RouterModule} from "@angular/router";
import {MenuComponent} from "../menu/menu.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SignUpComponent} from "../sign-up/sign-up.component";
import {SignInComponent} from "../sign-in/sign-in.component";

@NgModule({
  declarations: [
    HomeComponent,
    MenuComponent,
    SignUpComponent,
    SignInComponent
  ],
  exports: [
    HomeComponent,
    MenuComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgOptimizedImage,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class HomeModule { }
