import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeIndividualComponent } from './recipe-individual.component';

describe('RecipeIndividualComponent', () => {
  let component: RecipeIndividualComponent;
  let fixture: ComponentFixture<RecipeIndividualComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecipeIndividualComponent]
    });
    fixture = TestBed.createComponent(RecipeIndividualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
