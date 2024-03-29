from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Receipt:
    def __init__(self, name, id):
        self.name = name
        self.id = id


receipt_array = []

receipt_array.append(Receipt('Akash', 2))
receipt_array.append(Receipt('Deependra', 40))
receipt_array.append(Receipt('Reaper', 44))
receipt_array.append(Receipt('veer', 67))


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/ping")
async def root():
    return "Pong"


@app.get("/recipes")
async def send_receipts():
    return receipt_array
