from datetime import timedelta

from django.utils import timezone
from django.core.paginator import Paginator

from rest_framework.views import APIView
from rest_framework.response import Response

from api import models
from ..utils.get_name import get_name


class ShareAdd(APIView):
    """
    添加信息
    """

    def post(self, request):
        content = request.data.get("contents")
        name = get_name(request)
        if content:
            c_time = timezone.now() + timedelta(hours=8)
            last_id = models.InfoShares.objects.order_by("-id")[0].id
            # 判断表中是否有数据
            if last_id:
                models.InfoShares.objects.filter(id=last_id).update(shareName=name, contents=content, cTime=c_time)
            # 没有数据直接写入
            else:
                models.InfoShares.objects.create(shareName=name, contents=content, cTime=c_time)
            return Response({
                "state": True,
                "status": 1,
                "msg": "内容添加成功"
            })
        return Response({
            "state": False,
            "status": 0,
            "msg": "请传入发布的内容"
        })


class ShareUpload(APIView):
    """
    上传文件接口
    """

    def post(self, request):
        file_obj = request.FILES.get('file')
        models.InfoShares.objects.create(imgSrc=file_obj)
        return Response({
            "status": 0,
            "path": "media/img/" + file_obj.name
        })


class ShareContentPage(APIView):
    """
    查询分享内容
    """

    def post(self, request):
        share_name = request.data.get("shareName")
        if share_name:
            data = []
            query = models.InfoShares.objects.filter(shareName=share_name)
            page = request.data.get("page", 1)
            news = Paginator(query, 5)
            queryset = news.page(page)
            for i in queryset:
                res = {}
                res["_id"] = i.id
                res["shareName"] = i.shareName
                res["contents"] = i.contents
                res["cTime"] = "" if i.cTime is None else i.cTime.strftime("%Y/%m/%d %H:%M:%S")
                res["imgSrc"] = "" if i.imgSrc is None else str(i.imgSrc)
                res["__v"] = 0
                data.append(res)
            return Response({
                "status": 1,
                "state": True,
                "msg": "查询成功",
                "data": data
            })
        data = []
        query = models.InfoShares.objects.all()
        for i in query:
            res = {}
            res["_id"] = i.id
            res["shareName"] = i.shareName
            res["contents"] = i.contents
            res["cTime"] = "" if i.cTime is None else i.cTime.strftime("%Y/%m/%d %H:%M:%S")
            res["imgSrc"] = "" if i.imgSrc is None else str(i.imgSrc)
            res["__v"] = 0
            data.append(res)
        return Response({
            "status": 1,
            "state": True,
            "msg": "查询成功",
            "data": data
        })


class ShareContentAll(APIView):
    """
    查看全部内容
    """

    def post(self, request):
        share_name = request.data.get("name")
        if share_name:
            data = []
            query = models.InfoShares.objects.filter(shareName=share_name)
            for i in query:
                res = {}
                res["_id"] = i.id
                res["shareName"] = i.shareName
                res["contents"] = i.contents
                res["cTime"] = "" if i.cTime is None else i.cTime.strftime("%Y/%m/%d %H:%M:%S")
                res["imgSrc"] = "" if i.imgSrc is None else str(i.imgSrc)
                res["__v"] = 0
                data.append(res)
            return Response({
                "status": 1,
                "state": True,
                "msg": "查询成功",
                "data": data
            })
        data = []
        query = models.InfoShares.objects.all()
        for i in query:
            res = {}
            res["_id"] = i.id
            res["shareName"] = i.shareName
            res["contents"] = i.contents
            res["cTime"] = "" if i.cTime is None else i.cTime.strftime("%Y/%m/%d %H:%M:%S")
            res["imgSrc"] = "" if i.imgSrc is None else str(i.imgSrc)
            res["__v"] = 0
            data.append(res)
        return Response({
            "status": 1,
            "state": True,
            "msg": "查询成功",
            "data": data
        })
