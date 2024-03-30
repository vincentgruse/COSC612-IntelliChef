from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()


class Recipe(BaseModel):
    name: str
    id: int


receipy_array = [
    Recipe(name='Lebanese Chickpea Stew', id=1),
    Recipe(name='Skillet Rolls', id=2),
    Recipe(name='Honey Garlic Chicken', id=3),
    Recipe(name='Turkey Bites with Garlic Butter', id=4)
]


@router.get("/all")
async def get_receipts():
    return receipy_array


@router.get("/recipes")
async def send_receipts():
    return receipy_array


@router.post("/recipe")
async def create_receipts(receipy: Recipe):
    receipy_array.append(receipy)
    return receipy_array


@router.put("/recipe")
async def update_recipe(receipy: Recipe):
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
