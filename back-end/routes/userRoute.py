import base64
from datetime import datetime

from fastapi import APIRouter, HTTPException, Depends, File, UploadFile, Form
from fastapi.security import OAuth2PasswordBearer
from starlette import status

import models.models
from classes.classes import BaseRecipe, BaseIngredient, BaseUser
from sqlalchemy.orm import Session
from typing import Annotated

from utils.database import SessionLocal
from utils.util import signJWT

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# annotation for dependency injection
db_dependency = Annotated[Session, Depends(get_db)]

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


@router.get("/login/")
async def login_user(username: str, password: str, db: db_dependency):
    user = db.query(models.models.User).filter(models.models.User.username == username, models.models.User.password == password).first()

    if user is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid login credentials")
    else:
        return signJWT(user.id)

@router.get("/user/")
async def get_user(token: Annotated[str, Depends(oauth2_scheme)]):
    return {"token": token}


async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    user = fake_decode_token(token)
    return user


@router.post("/user")
async def create_user(new_user: BaseUser, db: db_dependency):
    # check if the username already exists
    user = db.query(models.models.User).filter(models.models.User.id == new_user.username).first()
    if user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="username already exists")
    # creating a new user
    db_user = models.models.User(**new_user.dict())
    # db_user.created_at = datetime.now()
    db.add(db_user)
    db.commit()
    return db_user


@router.get("/users/me")
async def read_users_me(current_user: Annotated[models.models.User, Depends(get_current_user)]):
    return current_user


def fake_decode_token(token):
    return models.User(
        username=token + "fakedecoded", email="john@example.com", name="John Doe"
    )
