import time
import jwt
from decouple import config

JWT_SECRET = config('JWT_SECRET')
JWT_ALGORITHM = config('JWT_ALGORITHM')


def signJWT(user_id: str):
    payload = {
        "user_id": user_id,
        "exp": time.time() + 600
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return {"token": token}


def decodeJWT(token: str):
    try:
        decoded = jwt.decode(token, JWT_SECRET, algorithms=JWT_ALGORITHM)
        return decoded if decoded['exp'] >= time.time() else None
    except:
        return {}
