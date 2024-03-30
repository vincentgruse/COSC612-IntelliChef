from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import receipyRoute

app = FastAPI()
app.include_router(receipyRoute.router)

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
