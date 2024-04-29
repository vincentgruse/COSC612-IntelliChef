import base64

from fastapi import APIRouter, HTTPException, Depends, File, UploadFile, Form
from fastapi.params import Query
from starlette import status

import models.models
import ml_model
from classes.classes import BaseRecipe, BaseIngredient, BaseRecipeCreate
from sqlalchemy.orm import Session, joinedload
from typing import Annotated, List

from utils.database import SessionLocal
from ml_model.calculate_similarities import retrieve_best_items, load_initial_data

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# annotation for dependency injection
db_dependency = Annotated[Session, Depends(get_db)]


@router.get("/ingredients")
async def get_ingredients(db: db_dependency):
    return db.query(models.models.Ingredient).all()


@router.get("/recipes")
async def get_receipts(db: db_dependency):
    return db.query(models.models.Recipe).all()


@router.get("/recipe/{recipeId}")
async def get_receipts(db: db_dependency, recipeId):
    db_recipe = get_recipe(recipeId, db)
    if not db_recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return db_recipe


@router.post("/ingredients")
async def create_ingredients_list(db: db_dependency, ingredients: list[BaseIngredient]):
    ingredient_list = []
    if ingredients and len(ingredients) > 0:
        for ingredient in ingredients:
            db_ingredient = models.models.Ingredient(**ingredient.dict())
            db_ingredient.created_by = 1
            ingredient_list.append(db_ingredient)

        db.add_all(ingredient_list)
        db.commit()


@router.post("/ingredient", status_code=status.HTTP_201_CREATED)
async def create_Ingredient(baseIngredient: BaseIngredient, db: db_dependency):
    print(baseIngredient.dict())
    db_ingredient = models.models.Ingredient(**baseIngredient.dict())
    # db_ingredient.recipes = []
    db.add(db_ingredient)
    db.commit()


# only support the image files only.
@router.post("/recipe", summary="Create recipes using ingredients if provided", status_code=status.HTTP_200_OK)
async def create_recipe(
        db: db_dependency,
        ingredients: list[int] = Query(...),
        base_recipe: BaseRecipeCreate = Depends(),
        file: UploadFile = File(...)
):
    print(base_recipe.dict(), file.content_type)
    # validating ingredients and adding it to recipe object
    db_ingredients = []
    if ingredients and len(ingredients) > 0:
        for ingredient in ingredients:
            db_ingredient = db.query(models.models.Ingredient).filter(models.models.Ingredient.id == (ingredient)).first()
            if db_ingredient:
                db_ingredients.append(db_ingredient)

    db_recipe = models.models.Recipe(**base_recipe.dict())
    if db_ingredients and len(db_ingredients) > 0:
        db_recipe.ingredients = db_ingredients

    # processing image data
    data = await file.read()
    rv = base64.b64encode(data)
    print(rv, "image data")
    db_recipe.image = rv
    # db_ingredient.recipes = []
    db.add(db_recipe)
    db.commit()
    return 'recipe saved successfully: ' + base_recipe.name


@router.put("/recipe")
async def update_recipe(
        db: db_dependency,
        base_recipe: BaseRecipe = Depends(),
        file: UploadFile = File(...)
):
    print(base_recipe.dict(), file.content_type)
    # check if the provided ID of recipe is existing
    db_recipe = get_recipe(base_recipe.id, db)
    if not db_recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")

    db_recipe = models.models.Recipe(**base_recipe.dict())
    # encoding the byte array
    data = await file.read()
    rv = base64.b64encode(data)
    print(rv, "image data")
    db_recipe.image = rv
    db.add(db_recipe)
    db.commit()
    db.refresh(db_recipe)
    return db_recipe


@router.patch("/recipe")
async def update_recipe_image(
        db: db_dependency,
        recipe_id: Annotated[int, Form()],
        file: UploadFile = File(...)
):
    db_recipe = get_recipe(recipe_id, db)
    if not db_recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")

    # encoding the byte array
    data = await file.read()
    rv = base64.b64encode(data)
    print(rv, "image data")
    db_recipe.image = rv
    db.add(db_recipe)
    db.commit()
    db.refresh(db_recipe)
    return db_recipe


@router.patch("/add_to_favourites")
async def add_to_favourites(
        db: db_dependency,
        recipe_id: Annotated[int, Form()],
        favourite: Annotated[int, Form()]
):
    db_recipe = get_recipe(recipe_id, db)
    if not db_recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")

    db_recipe.favourite = favourite
    db.add(db_recipe)
    db.commit()
    db.refresh(db_recipe)
    return db_recipe


@router.get('/recommendations/{recipe_id}', response_model=list[int])
async def get_receipts(recipe_id: int, db: db_dependency):
    return get_recommendations(recipe_id, db)


@router.post('/recommendations')
async def initialize_recommendations():
    result = await load_initial_data()
    if result:
        return 1
    else:
        return 0


def get_recipe(recipe_id: int, db: db_dependency):
    result = db.query(models.models.Recipe).options(joinedload(models.models.Recipe.ingredients, innerjoin=True)).where(
        models.models.Recipe.id == recipe_id).first()
    return result


def get_recommendations(recipe_id: int, db: db_dependency):
    if recipe_id and recipe_id > 0:
        result = db.query(models.models.Recipe).filter(models.models.Recipe.id == (recipe_id)).first()
        if result is not None:
            return retrieve_best_items(10, result.row_index)
    else:
        raise HTTPException(status_code=400, detail="Incorrect recipe Id")
