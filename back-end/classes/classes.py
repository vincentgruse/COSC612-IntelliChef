from datetime import datetime

from pydantic import BaseModel


class BaseRecipe(BaseModel):
    name: str
    id: int
    description: str
    instructions: str


class BaseIngredient(BaseModel):
    id: int
    name: str
    description: str
    image: str


class BaseUser(BaseModel):
    id: int
    name: str
    username: str
    password: str
    email: str
    type: int
    created_on: datetime = datetime.now()
