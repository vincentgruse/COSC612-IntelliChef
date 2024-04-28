import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Recipe } from "../models/recipe";
import { RecipeService } from "../services/recipe.service";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: 'app-recipe-individual',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe = {description: "", favourite: false, id: 0, image: "", ingredients: [], instructions: "", name: ""};
  selectedFile: File | null = null;
  fileName = '';
  base64Image: string | null = null;
  isEmptyBase64 = false; // Initialize to false
  uploadSuccess = false;
  uploadError = false;
  uploadErrorMessage = '';

  constructor(
    private recipeService: RecipeService,
    private router: Router,
    private route: ActivatedRoute,
    private domSanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const recipeId = params.get('id');
      if (recipeId) { // Leverage the truthy/falsy nature of the string
        this.loadRecipe(recipeId);
        console.log("Success with recipe id: " + recipeId)
      } else {
        // Handle the case where recipeId is null
        console.error('Recipe ID is null or undefined');
      }
    });
  }

  loadRecipe(recipeId: string) {
    this.recipeService.getRecipeById(recipeId).subscribe(recipe => {
      // Assign values to the recipe object
      this.recipe.id = recipe.id;
      this.recipe.name = recipe.name;
      this.recipe.image = recipe.image;
      this.recipe.description = recipe.description;
      this.recipe.ingredients = recipe.ingredients;
      this.recipe.instructions = recipe.instructions;

      this.processRecipeImage();
    });
  }

  processRecipeImage(): void {
    if (this.recipe) {
      this.isEmptyBase64 = this.recipe.image.length === 0;
      if (!this.isEmptyBase64) {
        this.recipe.image = <string>this.domSanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + this.recipe.image);
      }
    }
  }

  onFileSelected(event: any) {
    const selectedFile: File = event.target.files[0];  // Cast to File

    if (selectedFile) {
      this.fileName = selectedFile.name;
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile); // Read the file as data URL
      reader.onload = (e: any) => {  // Handle load event
        this.selectedFile = selectedFile;  // Update selectedFile
        this.base64Image = `data:image/jpg;base64,${e.target.result?.slice(22)}`;
      };
    }
  }

  uploadImage() {
    if (this.selectedFile && this.recipe.id && this.base64Image) {
      const recipeIdString = this.recipe.id.toString();
      const formData = new FormData();
      formData.append("image", this.base64Image); // Use the base64Image property
      this.recipeService.uploadRecipeImage(recipeIdString, formData).subscribe(
        response => {
          console.log('Image uploaded successfully');
          this.uploadSuccess = true;
          this.uploadError = false;
          this.uploadErrorMessage = '';
          // Refresh the recipe after uploading image (optional)
          this.loadRecipe(recipeIdString);
        },
        error => {
          console.error('Error uploading image:', error);
          this.uploadSuccess = false;
          this.uploadError = true;
          this.uploadErrorMessage = error.message || 'Error uploading image.';
        }
      );
    } else {
      console.error('No image file selected, recipe ID not available, or base64 conversion failed');
    }
  }


  // Method to navigate back to the recipes component
  goBack(): void {
    this.router.navigate(['/recipes']);
  }
}
