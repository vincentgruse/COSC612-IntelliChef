from sqlalchemy import Boolean, Column, Integer, String, ForeignKey, Table
from sqlalchemy.orm import relationship

from utils.database import Base

book_authors = Table(
    'recipe_ingredient', Base.metadata,
    Column('recipe_id', ForeignKey('recipes.id'), primary_key=True),
    Column('ingredient_id', ForeignKey('ingredients.id'), primary_key=True)
                     )


class Recipe(Base):
    __tablename__ = 'recipes'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True)
    description = Column(String(500))
    image = Column(String(500))
    ingredients = relationship("Ingredient", secondary="recipe_ingredient", back_populates='recipes')


class Ingredient(Base):
    __tablename__ = 'ingredients'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True)
    description = Column(String(500))
    image = Column(String(500))
    recipes = relationship("Recipe", secondary="recipe_ingredient", back_populates='ingredients')
