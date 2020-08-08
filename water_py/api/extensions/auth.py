import jwt
from jwt import exceptions
from django.conf import settings
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.authentication import BasicAuthentication


class JwtQueryParamsAuthentication(BasicAuthentication):

    def authenticate(self, request):
        # 获取token并判断token的合法性
        if request.query_params.get("token"):
            # 通过get请求的方式获取token
            token = request.query_params.get('token')
        else:
            # 获取headers中的token
            token = request.META.get('HTTP_AUTHORIZATION')
        salt = settings.SECRET_KEY
        # 1.切割
        # 2.解密第二段/判断是否过期
        # 3.验证第三段合法性
        try:
            payload = jwt.decode(token, salt, True)
        except exceptions.ExpiredSignatureError:
            raise AuthenticationFailed({"state": False, "status": 0, "msg": "token已失效"})
        except jwt.DecodeError:
            raise AuthenticationFailed({"state": False, "status": 0, "msg": "校验失败"})
        except jwt.InvalidTokenError:
            raise AuthenticationFailed({"state": False, "status": 0, "msg": "非法的token"})

        return (payload, token)
