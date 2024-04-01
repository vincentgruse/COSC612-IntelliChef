from pydantic import BaseModel


class BaseRecipe(BaseModel):
    name: str
    id: int
    description: str
    instructions: str
    image: str


class BaseIngredient(BaseModel):
    id: int
    name: str
    description: str
    image: str

