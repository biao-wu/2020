import socket
from datetime import timedelta

from django.contrib import auth
from django.utils import timezone
from django.contrib.auth.hashers import make_password

from rest_framework.views import APIView
from rest_framework.response import Response

from api import models
from api.utils.jwt_auth import create_token


class RegisterView(APIView):
    """
    注册
    """

    def post(self, request):
        username = request.data.get("name")
        password = request.data.get("pwd")
        # 查询用户名密码是否传入
        if username and password:
            # 查询数据库是否有相同的用户名
            user = models.UserInfo.objects.filter(username=username)
            if user:
                return Response({
                    "state": False,
                    "status": 0,
                    "msg": "用户名已注册"
                })
            # 用户未注册情况
            # 加密密码
            name = request.data.get("name")
            new_pwd = make_password(password)
            models.UserInfo.objects.create(username=name, password=new_pwd)
            return Response({
                "state": True,
                "status": 1,
                "msg": "注册成功"
            })

        return Response({
            "state": False,
            "status": 0,
            "msg": "name||pwd必填"
        })


class LoginView(APIView):
    """
    用户登录
    """
    authentication_classes = []

    def post(self, request):
        name = request.data.get('name')
        pwd = request.data.get('pwd')

        user_info = models.UserInfo.objects.filter(username=name)
        if user_info.exists():
            user = auth.authenticate(username=name, password=pwd)
            if not user:
                return Response({
                    "state": False,
                    "status": 0,
                    "msg": "账号或者密码错误"
                })
            # jwt生成token
            token = create_token({"user_id": user.id, "username": user.username})
            # 登录成功，记录登录日志
            lastLoginQuery = models.Log.objects.filter(username=name)
            if lastLoginQuery:
                lastLoginTimeList = []
                lastLoginIpList = []
                for i in lastLoginQuery:
                    lastLoginTime = i.nowLoginTime
                    lastLoginTimeList.append(lastLoginTime)
                    lastLoginIp = i.nowLoginIp
                    lastLoginIpList.append(lastLoginIp)
                create_time = timezone.now() + timedelta(hours=8)
                now_name = socket.getfqdn(socket.gethostname())
                now_ip = socket.gethostbyname(now_name)
                models.Log.objects.create(username=name,
                                          lastLoginTime=lastLoginTimeList[-1],
                                          lastLoginIp=lastLoginIpList[-1],
                                          nowLoginTime=create_time,
                                          nowLoginIp=now_ip)
            else:
                create_time = timezone.now() + timedelta(hours=8)
                now_name = socket.getfqdn(socket.gethostname())
                now_ip = socket.gethostbyname(now_name)
                models.Log.objects.create(username=name,
                                          lastLoginTime="1970-01-01",
                                          lastLoginIp="127.0.0.1",
                                          nowLoginTime=create_time,
                                          nowLoginIp=now_ip)
            return Response({
                "state": True,
                "status": 1,
                "msg": "登录成功",
                "_id": user.id,
                "token": token
            })
        else:
            return Response({
                "state": False,
                "status": 0,
                "msg": "没有该账户"
            })


class UsersView(APIView):
    """
    查找管理员列表
    """

    def get(self, request):
        name = request.GET.get("name")
        find_result = []
        user_obj = models.UserInfo.objects.filter(username=name)
        dic = {}
        for i in user_obj:
            dic["_id"] = i.id
            dic["name"] = i.username
            dic["phone"] = i.phone
            dic["email"] = i.email
            dic["nickname"] = i.nickname
            dic["des"] = i.des
        find_result.append(dic)
        return Response({
            "state": True,
            "status": 1,
            "findResult": find_result
        })


class UsersUpdateView(APIView):
    """
    更新管理员基本信息,不包括密码
    """

    def post(self, request):
        # 获取_id作为更新条件
        _id = request.data.get("_id")
        query = models.UserInfo.objects.filter(id=_id)
        if query.exists():
            name = request.data.get("name")
            phone = request.data.get("phone")
            email = request.data.get("email")
            nickname = request.data.get("nickname")
            des = request.data.get("des")
            if name: models.UserInfo.objects.filter(id=_id).update(username=name)
            if phone: models.UserInfo.objects.filter(id=_id).update(phone=phone)
            if email: models.UserInfo.objects.filter(id=_id).update(email=email)
            if nickname: models.UserInfo.objects.filter(id=_id).update(nickname=nickname)
            if des: models.UserInfo.objects.filter(id=_id).update(des=des)
            return Response({
                "state": True,
                "status": 1,
                "msg": "基本信息更新成功"
            })
        return Response(
            {
                "state": False,
                "status": "0",
                "msg": "没有该账户"
            }
        )


class UsersUppwd(APIView):
    """
    修改管理员账号密码
    """

    def post(self, request):
        # 查看用户名、密码、新密码是否传入
        id = request.data.get("_id")
        pwd = request.data.get("pwd")
        new_pwd = request.data.get("newpwd")
        if (id and pwd and new_pwd):
            # 获取请求用户
            query = models.UserInfo.objects.filter(id=id)
            for user in query:
                # 检查原始密码是否正确
                if user.check_password(pwd):
                    # 修改密码为新密码
                    user.set_password(new_pwd)
                    user.save()
                    return Response({
                        "state": True,
                        "status": 1,
                        "msg": "密码修改成功"
                    })
                return Response({
                    "state": False,
                    "status": 0,
                    "msg": "密码错误"
                })
            return Response({
                "state": False,
                "status": 0,
                "msg": "数据库查询失败"
            })
        return Response({
            "state": False,
            "status": 0,
            "msg": "新密码和旧密码必填"
        })
