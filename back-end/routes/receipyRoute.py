from fastapi import APIRouter, HTTPException, Depends
from starlette import status

import models.models
from classes.classes import BaseRecipe, BaseIngredient
from sqlalchemy.orm import Session
from typing import Annotated

from utils.database import SessionLocal

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# annotation for dependency injection
db_dependency = Annotated[Session, Depends(get_db)]

receipy_array = [
    BaseRecipe(name='Lebanese Chickpea Stew', id=1, description='Lebanese Chickpea', image='https://i.imgur.com'),
    BaseRecipe(name='Skillet Rolls', id=2, description='Lebanese Chickpea', image='https://i.imgur.com'),
    BaseRecipe(name='Honey Garlic Chicken', id=3, description='Lebanese Chickpea', image='https://i.imgur.com'),
    BaseRecipe(name='Turkey Bites & Garlic Butter', id=4, description='Lebanese Chickpea', image='https://i.imgur.com')
]


@router.get("/all")
async def get_ingredients(db: db_dependency):
    return db.query(models.models.Ingredient).all()


@router.get("/recipes")
async def send_receipts():
    return receipy_array


@router.post("/recipe")
async def create_receipts(receipy: BaseRecipe):
    receipy_array.append(receipy)
    return (receipy_array)


@router.post("/ingredient", status_code=status.HTTP_201_CREATED)
async def create_Ingredient(baseIngredient: BaseIngredient, db: db_dependency):
    print(baseIngredient.dict())
    db_ingredient = models.models.Ingredient(**baseIngredient.dict())
    # db_ingredient.recipes = []
    db.add(db_ingredient)
    db.commit()


@router.put("/recipe")
async def update_recipe(receipy: BaseRecipe):
    # find recipy by id
    item_index = 0
    for index, item in enumerate(receipy_array):
        if item.id == receipy.id:
            receipy_array[index] = receipy
            item_index = index
            break
    else:
        index = -1
        raise HTTPException(status_code=400, detail="recipe not found")
    return receipy_array[item_index]
