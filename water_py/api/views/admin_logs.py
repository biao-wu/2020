from django.core.paginator import Paginator

from rest_framework.views import APIView
from rest_framework.response import Response

from api import models


class AdminLogs(APIView):
    """
    查看操作日志
    """

    def get(self, request):
        name = request.GET.get("name")
        if name:
            query = models.OperationLogs.objects.filter(admin=name)
            page = request.data.get("page", 1)
            count = Paginator(query, 10)
            queryset = count.page(page)
            data = []
            for i in queryset:
                res = {}
                res["_id"] = i.id
                res["admin"] = i.admin
                res["opa"] = i.opa
                res["cTime"] = i.cTime.strftime("%Y/%m/%d %H:%M:%S")
                res["__v"] = 0
                data.append(res)
            return Response({
                "status": 1,
                "state": True,
                "msg": "success",
                "data": data
            })
        query = models.OperationLogs.objects.all()
        page = request.data.get("page", 1)
        count = Paginator(query, 10)
        queryset = count.page(page)
        data = []
        for i in queryset:
            res = {}
            res["_id"] = i.id
            res["admin"] = i.admin
            res["opa"] = i.opa
            res["cTime"] = i.cTime.strftime("%Y/%m/%d %H:%M:%S")
            res["__v"] = 0
            data.append(res)
        return Response({
            "status": 1,
            "state": True,
            "msg": "success",
            "data": data
        })

    # def post(self, request):
    #     pass


class AdminLogsAll(APIView):
    """
    查看全部操作日志
    """

    def post(self, request):
        query = models.OperationLogs.objects.all()
        page = request.data.get("page", 1)
        count = Paginator(query, 10)
        queryset = count.page(page)
        data = []
        for i in queryset:
            res = {}
            res["_id"] = i.id
            res["admin"] = i.admin
            res["opa"] = i.opa
            res["cTime"] = i.cTime.strftime("%Y/%m/%d %H:%M:%S")
            res["__v"] = 0
            data.append(res)
        return Response({
            "status": 1,
            "state": True,
            "msg": "全部操作日志获取成功",
            "data": data
        })
