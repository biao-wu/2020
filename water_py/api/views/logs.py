from django.core.paginator import Paginator
from rest_framework.pagination import PageNumberPagination
from rest_framework.views import APIView
from rest_framework.response import Response
from api.utils.pager import PagerSerializer

from api import models


class MyPageNumberPagination(PageNumberPagination):
    # 默认每页显示多少个
    page_size = 5
    # 每页显示多少个，参数为count
    page_size_query_param = 'count'
    # 每页最多显示10个
    max_page_size = 10


class GetLogs(APIView):
    """
    获取单个管理员登录日志
    """

    def get(self, request, *args, **kwargs):
        name = request.GET.get("name")
        # 从数据库获取数据
        log_query = models.Log.objects.filter(username=name)
        try:
            log_query = log_query.order_by('-pk')
        except Exception:
            pass

        # 判断该用户之前是否有日志记录
        if log_query:
            data = []
            for i in log_query:
                last_login_ip = i.lastLoginIp
                last_login_time = i.lastLoginTime.strftime("%Y/%m/%d %H:%M:%S")
                now_login_time = i.nowLoginTime.strftime("%Y/%m/%d %H:%M:%S")
                now_login_ip = i.nowLoginIp
                # 通过UserInfo表查询id构建对应的数据结构
                user = models.UserInfo.objects.filter(username=name)
                for j in user:
                    id = j.id
                    ret = {}
                    last_login = {}
                    now_login = {}
                    last_login["loginTime"] = last_login_time
                    last_login["ip"] = last_login_ip
                    now_login["loginTime"] = now_login_time
                    now_login["ip"] = now_login_ip
                    ret["_id"] = id
                    ret["username"] = name
                    ret["lastLogin"] = last_login
                    ret["nowLogin"] = now_login
                    data.append(ret)
            return Response({
                "status": 200,
                "state": True,
                "msg": "success",
                "data": data,
                "__v": 0
            })

        return Response({
            "status": 0,
            "state": False,
            "msg": "false",
        })


class GetLogsAll(APIView):
    """
    获取所有登录日志
    """

    def get(self, request):
        page = request.GET.get("page", 1)
        logs = models.Log.objects.all()
        news = Paginator(logs, 10)

        queryset = news.page(page)
        try:
            queryset = queryset.order_by('-pk')[page.start_num:page.end_num]
        except Exception:
            pass
        data = []
        for i in queryset:
            name = i.username
            last_login_ip = i.lastLoginIp
            last_login_time = i.lastLoginTime.strftime("%Y/%m/%d %H:%M:%S")
            now_login_time = i.nowLoginTime.strftime("%Y/%m/%d %H:%M:%S")
            now_login_ip = i.nowLoginIp
            user = models.UserInfo.objects.filter(username=name)
            for j in user:
                id = j.id
                ret = {}
                last_login = {}
                now_login = {}
                last_login["loginTime"] = last_login_time
                last_login["ip"] = last_login_ip
                now_login["loginTime"] = now_login_time
                now_login["ip"] = now_login_ip
                ret["_id"] = id
                ret["username"] = name
                ret["lastLogin"] = last_login
                ret["nowLogin"] = now_login
                data.append(ret)
        return Response(
            {
                "status": 200,
                "state": True,
                "msg": "success",
                "data": data,
                "__v": 0
            }
        )
