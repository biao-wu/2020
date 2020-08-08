import json
from datetime import timedelta

from django.utils import timezone
from django.core.paginator import Paginator

from rest_framework.views import APIView
from rest_framework.response import Response

from api import models
from ..utils.get_name import get_name


class AddDev(APIView):
    """
    添加设备
    """

    def post(self, request):
        dev_name = request.data.get("devName")
        dev_num = request.data.get("devNum")
        dev_date = request.data.get("devDate")
        # 查看devName,devNum,devDate否传入
        if dev_name and dev_num and dev_date:
            if dev_num:
                # 先查询数据库是否有相同的设备编号
                dev_obj = models.Dev.objects.filter(devNum=dev_num)
                if dev_obj:
                    return Response({
                        "state": False,
                        "status": 0,
                        "msg": "设备已注册"
                    })
                else:
                    # 设备信息写入到数据库

                    now_time = timezone.now() + timedelta(hours=8)
                    request.data["cTime"] = now_time
                    models.Dev.objects.create(**request.data)
                    # 记录日志
                    dev_admin = get_name(request)
                    # dev_admin = request.data.get("devAdmin")
                    opa = "添加一个新设备:" + dev_num

                    try:
                        models.OperationLogs.objects.create(admin=dev_admin, opa=opa, cTime=now_time)
                        return Response({
                            "state": True,
                            "status": 1,
                            "logs": 1,
                            "msg": "设备添加成功,日志添加成功"
                        })
                    except Exception as e:
                        return Response({
                            "state": True,
                            "status": 1,
                            "logs": 0,
                            "msg": "设备添加成功,日志添加失败"
                        })
            return Response({
                "state": False,
                "status": 0,
                "msg": "设备添加失败"
            })
        return Response({
            "state": False,
            "status": 0,
            "msg": "查询失败"
        })


class UpdateDev(APIView):
    """
    修改设备基本信息（devName,devNum,devDate不可更改） 通过devNum进行查找修改
    """

    def post(self, request):
        dev_num = request.data.get("devNum")
        queryset = models.Dev.objects.filter(devNum=dev_num)
        for i in queryset:
            dev_sim = i.devSIM
            dev_use = str(i.devUse)
            dev_location = i.devLocation
            dev_admin = i.devAdmin
            if request.data.get("devSIM") == dev_sim and \
                    request.data.get("devUse") == dev_use and \
                    request.data.get("devLocation") == dev_location and \
                    request.data.get("devAdmin") == dev_admin:
                return Response({
                    "state": False,
                    "status": 0,
                    "msg": "设备信息一致,更新失败"
                })
            # 更新信息到数据库
            models.Dev.objects.filter(devNum=dev_num).update(**request.data)
            # 添加日志到数据库
            l_admin = get_name(request)
            opa = "修改了设备信息:" + json.dumps(request.data)
            ctime = timezone.now() + timedelta(hours=8)
            models.OperationLogs.objects.create(admin=l_admin, opa=opa, cTime=ctime)
            return Response({
                "state": True,
                "status": 1,
                "logs": 1,
                "msg": "设备信息更新成功,日志添加成功"
            })
        return Response({
            "state": False,
            "status": 0,
            "msg": "查询失败"
        })


class DevFind(APIView):
    """
    查询设备信息
    """

    def post(self, request):
        receive_data = request.data
        # 获得了post请求传过来的数据，字典形式{'devName': '2112', 'devNum': '123456'}
        if receive_data:
            dev_num = receive_data.get("devNum")
            if dev_num:
                find_result = []
                page = request.data.get("page", 1)
                count = request.data.get("count", 5)
                dev_obj = models.Dev.objects.filter(devNum=dev_num)
                news = Paginator(dev_obj, count)
                queryset = news.page(page)
                if queryset:
                    res = {}
                    for i in queryset:
                        s1 = i.devLocation.replace("'", '"')
                        dev_location = [float(item) for item in json.loads(s1)]
                        res["devLocation"] = dev_location
                        res["_id"] = i.id
                        res["devName"] = i.devName
                        res["devNum"] = i.devNum
                        res["devDate"] = i.devDate.strftime("%Y/%m/%d %H:%M:%S")
                        res["devSIM"] = i.devSIM
                        res["devUse"] = i.devUse
                        res["devAdmin"] = i.devAdmin
                        res["cTime"] = i.cTime.strftime("%Y/%m/%d %H:%M:%S")
                        res["__v"] = 0
                    find_result.append(res)
                    if find_result:
                        return Response({
                            "state": True,
                            "status": 1,
                            "findResult": find_result
                        })

                # return Response({
                #     "state": True,
                #     "status": 1,
                #     "findResult": []
                # })
            return Response({
                "state": False,
                "status": 0,
                "msg": "查询失败"
            })
        else:
            query = models.Dev.objects.all()
            page = request.data.get('page', 1)
            news = Paginator(query, 5)
            queryset = news.page(page)
            find_result = []
            for i in queryset:
                res = {}
                s1 = i.devLocation.replace("'", '"')
                dev_location = [float(item) for item in json.loads(s1)]
                res["devLocation"] = dev_location
                res["_id"] = i.id
                res["devName"] = i.devName
                res["devNum"] = i.devNum
                res["devDate"] = i.devDate.strftime("%Y/%m/%d %H:%M:%S")
                res["devSIM"] = i.devSIM
                res["devUse"] = i.devUse
                res["devAdmin"] = i.devAdmin
                res["cTime"] = i.cTime.strftime("%Y/%m/%d %H:%M:%S")
                res["__v"] = 0
                find_result.append(res)
            if find_result:
                return Response({
                    "state": True,
                    "status": 1,
                    "findResult": find_result
                })
            return Response({
                "state": False,
                "status": 0,
                "msg": "查询失败"
            })


class DevFindAll(APIView):
    """
    查询所有设备信息
    """

    def post(self, request):
        query = models.Dev.objects.all()
        find_result = []

        for i in query:
            res = {}
            s1 = i.devLocation.replace("'", '"')
            dev_location = [float(item) for item in json.loads(s1)]
            res["devLocation"] = dev_location
            res["_id"] = i.id
            res["devName"] = i.devName
            res["devNum"] = i.devNum
            res["devDate"] = i.devDate.strftime("%Y/%m/%d %H:%M:%S")
            res["devSIM"] = i.devSIM
            res["devUse"] = i.devUse
            res["devAdmin"] = i.devAdmin
            res["cTime"] = i.cTime.strftime("%Y/%m/%d %H:%M:%S")
            res["__v"] = 0

            find_result.append(res)
        if find_result:
            return Response({
                "state": True,
                "status": 1,
                "findResult": find_result
            })
        return Response({
            "state": False,
            "status": 0,
            "msg": "查询失败"
        })


class DeleteDev(APIView):
    """
    删除设备
    """

    def post(self, request):
        dev_num = request.data.get("devNum")
        if dev_num:
            dev_obj = models.Dev.objects.filter(devNum=dev_num)

            if dev_obj:
                # 数据库中删除该条数据
                dev_obj.delete()
                # 记录日志到数据库
                admin = get_name(request)
                opa = "删除设备:" + dev_num
                c_time = timezone.now() + timedelta(hours=8)
                models.OperationLogs.objects.create(admin=admin, opa=opa, cTime=c_time)
                return Response({
                    "state": True,
                    "status": 1,
                    "logs": 1,
                    "msg": "设备删除成功,日志添加成功"
                })
            return Response({
                "state": False,
                "status": 0,
                "msg": "查询失败"
            })
        return Response({
            "state": False,
            "status": 0,
            "msg": "设备编号必传"
        })
