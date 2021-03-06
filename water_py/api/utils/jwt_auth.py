import jwt
import datetime
from django.conf import settings


def create_token(payload, timeout=1):
    salt = settings.SECRET_KEY
    # 构造header
    headers = {
        "typ": "jwt",
        "alg": "HS256"
    }
    # 构造payload
    payload["exp"] = datetime.datetime.now() + datetime.timedelta(minutes=timeout)  # 超时时间
    token = jwt.encode(payload=payload, key=salt, algorithm="HS256", headers=headers).decode("utf-8")
    return token
