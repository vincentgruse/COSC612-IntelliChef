from fastapi import FastAPI, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from routes import receipyRoute
from routes import userRoute
from utils.database import engine
from models import models


app = FastAPI()
app.include_router(receipyRoute.router)
app.include_router(userRoute.router)
models.Base.metadata.create_all(bind=engine)



origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/ping")
async def root():
    return "Pong"


