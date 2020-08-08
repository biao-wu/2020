from rest_framework.views import APIView
from rest_framework.response import Response

from rest_framework_jwt.utils import jwt_decode_handler

from api import models


class Test(APIView):
    """
    测试接口
    """

    def get(self, request):
        # 获取请求参数token的值
        token = request.GET.get("token")
        token1 = request.META.get('HTTP_AUTHORIZATION')
        # token解析后的值
        toke_user = jwt_decode_handler(token1)
        # 获得user_id
        user_id = toke_user["user_id"]
        # 通过user_id查询用户信息
        name = models.UserInfo.objects.get(id=user_id).username
        print(name, type(name))
        """
        # 更改下密码
        u = models.UserInfo.objects.get(username="wubiao")
        u.set_password("123456")
        u.save()
        """
        return Response({
            "state": True,
            "status": 1
        })
