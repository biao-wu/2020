from rest_framework_jwt.utils import jwt_decode_handler

from api import models


def get_name(request):
    """
    通过登录用户的token获取当前用户名
    :param request:
    :return: 用户名
    """
    if request.query_params.get("token"):
        # 通过get请求的方式获取token
        token = request.query_params.get('token')
    else:
        # 获取headers中的token
        token = request.META.get('HTTP_AUTHORIZATION')
    # token解析后的值
    toke_user = jwt_decode_handler(token)
    # 获得user_id
    user_id = toke_user["user_id"]
    # 通过user_id查询用户信息
    name = models.UserInfo.objects.get(id=user_id).username
    return name
