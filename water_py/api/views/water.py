import json
import pymysql
from datetime import timedelta

from django.db.models import Min
from django.utils import timezone
from django.shortcuts import render
from django.http import JsonResponse

from rest_framework.views import APIView
from rest_framework.response import Response

from api import models
from api.form import SiteForm
from Water_demo.settings import db

cur = db.cursor(cursor=pymysql.cursors.DictCursor)


class Water(APIView):
    """
    大屏页面展示
    """

    authentication_classes = []

    def get(self, request):

        site_num = models.Site.objects.distinct().count()
        site_num = str(site_num)
        site_all_1 = 0 if len(site_num) == 1 else site_num[0]
        site_all_2 = site_num[0] if len(site_num) == 1 else site_num[1]
        # 正常站点数
        on_obj = models.Site.objects.filter(status=1)
        on_id_list = []
        for i in on_obj:
            on_id_list.append(i.id)
        site_on = len(set(on_id_list))
        # 离线站点数
        off_obj = models.Site.objects.filter(status=0)
        off_id_list = []
        for i in off_obj:
            off_id_list.append(i.id)
        site_off = len(set(off_id_list))
        # 异常站点数
        exp_obj = models.Site.objects.filter(status=2)
        exp_id_list = []
        for i in exp_obj:
            exp_id_list.append(i.id)
        site_exp = len(set(exp_id_list))
        # 站点信息

        site_obj = models.Site.objects.all()
        cur.execute(
            'SELECT * FROM api_site INNER JOIN api_waterdata on api_site.id = api_waterdata.site_id WHERE time in (SELECT max(time) FROM api_waterdata GROUP BY site_id)')
        ret = cur.fetchall()

        db.commit()
        result = []
        for i in ret:
            res = {}
            res["create_time"] = i.get("time")
            res["ph_data"] = str(format(float(i.get('pH')) / 7 * 100, '.1f')) + "%"
            res["chlorine_data"] = str(float(i.get('chlorine')) / 10 * 100) + "%"
            res["NTU_data"] = str(float(i.get('NTU')) / 1 * 100) + "%"
            res["siteName"] = i.get("siteName")
            result.append(res)

        return render(request, "index.html",
                      {"siteAllONE": site_all_1, "siteAllTWO": site_all_2, "siteON": site_on, "siteOFF": site_off,
                       "siteExcept": site_exp, "site_obj": site_obj, "water_obj": result})


def water_form(request):
    if request.method == "GET":
        form_obj = SiteForm()

        return render(request, 'water_f.html', {"form_obj": form_obj})

    else:
        data = request.POST
        form_obj = SiteForm(data)
        if form_obj.is_valid():
            data = form_obj.cleaned_data
            # 将表单数据写入数据库
            site_name = data.get("siteName")
            obj = models.Site.objects.update_or_create(siteName=site_name)

            site_id = obj[0].id
            create_time = timezone.now() + timedelta(hours=8)
            data.pop('siteName')
            data["time"] = create_time
            data["site_id"] = site_id
            # 写入数据库
            # models.WaterData.objects.create(**data)
            site_num = models.Site.objects.distinct().count()
            site_num = str(site_num)
            site_all_1 = 0 if len(site_num) == 1 else site_num[0]
            site_all_2 = site_num[0] if len(site_num) == 1 else site_num[1]
            # 正常站点数
            on_obj = models.Site.objects.filter(status=1)
            on_id_list = []
            for i in on_obj:
                on_id_list.append(i.id)
            site_on = len(set(on_id_list))
            # 离线站点数
            off_obj = models.Site.objects.filter(status=0)
            off_id_list = []
            for i in off_obj:
                off_id_list.append(i.id)
            site_off = len(set(off_id_list))
            # 异常站点数
            exp_obj = models.Site.objects.filter(status=2)
            exp_id_list = []
            for i in exp_obj:
                exp_id_list.append(i.id)
            site_exp = len(set(exp_id_list))
            # 站点信息
            site_obj = models.Site.objects.all()
            cur.execute(
                'SELECT * FROM api_site INNER JOIN api_waterdata on api_site.id = api_waterdata.site_id WHERE time in (SELECT max(time) FROM api_waterdata GROUP BY site_id)')
            ret = cur.fetchall()
            db.commit()
            result = []
            for i in ret:
                res = {}
                res["create_time"] = i.get("time")
                res["ph_data"] = str(format(float(i.get('pH')) / 7 * 100, '.1f')) + "%"
                res["chlorine_data"] = str(float(i.get('chlorine')) / 10 * 100) + "%"
                res["NTU_data"] = str(float(i.get('NTU')) / 1 * 100) + "%"
                res["siteName"] = i.get("siteName")
                result.append(res)
                models.DataSite.objects.update_or_create(pH=res["ph_data"], NTU=res["NTU_data"],
                                                         chlorine=res["chlorine_data"], time=res["create_time"],
                                                         site_id=i.get("site_id"))
            return render(request, 'index.html',
                          {"siteAllONE": site_all_1, "siteAllTWO": site_all_2, "siteON": site_on, "siteOFF": site_off,
                           "siteExcept": site_exp, "site_obj": site_obj, "water_obj": result})
        else:
            return render(request, 'water_f.html', {'form_obj': form_obj})


def echarts_data(request):
    cur.execute('select chlorine,time,pH,NTU,oxygen,ele from api_waterdata where site_id = 1')
    ret = cur.fetchall()
    name_list = []
    site_name_1 = models.Site.objects.get(id=1)
    name_list.append(site_name_1.siteName)
    hours_1 = []
    chlorines_1 = []
    ph_list_1 = []
    ntu_list_one = []
    oxygen_list_one = []
    ele_list_one = []
    for i in ret:
        hours_1.append(i.get("time").strftime('%H:%M'))
        chlorines_1.append(i.get("chlorine"))
        ph_list_1.append(i.get("pH"))
        ntu_list_one.append(i.get("NTU"))
        oxygen_list_one.append(i.get("oxygen"))
        ele_list_one.append(i.get("ele"))
    cur.execute('select chlorine,time,pH,NTU,oxygen,ele from api_waterdata where site_id = 2')
    ret1 = cur.fetchall()
    db.commit()
    site_name_2 = models.Site.objects.get(id=2)
    name_list.append(site_name_2.siteName)
    hours_2 = []
    chlorines_2 = []
    ph_list_2 = []
    ntu_list_two = []
    oxygen_list_two = []
    ele_list_two = []
    for i in ret1:
        hours_2.append(i.get("time").strftime('%H:%M'))
        chlorines_2.append(i.get("chlorine"))
        ph_list_2.append(i.get("pH"))
        ntu_list_two.append(i.get("NTU"))
        oxygen_list_two.append(i.get("oxygen"))
        ele_list_two.append(i.get("ele"))
    json_data = {
        "name": name_list,
        "key": hours_1,
        "value_c1": chlorines_1,
        "value_c2": chlorines_2,
        "val_ph1": ph_list_1,
        "val_ph2": ph_list_2,
        "val_ntu1": ntu_list_one,
        "val_ntu2": ntu_list_two,
        "val_oxygen1": oxygen_list_one,
        "val_oxygen2": oxygen_list_two,
        "val_ele1": ele_list_one,
        "val_ele2": ele_list_two,
    }

    return JsonResponse(json_data)


def map_data(request):
    query = models.Site.objects.values()

    location_list = []
    for i in query:
        location = {}
        location["id"] = i.get('id')
        location["status"] = i.get('status')
        location['location'] = [float(item) for item in json.loads(i.get("siteLocation"))]
        location_list.append(location)

    obj1 = models.WaterData.objects.filter(site_id=1).annotate(Min('time')).values()
    json_data_one = []
    for i in obj1:
        res = {}
        res["siteName"] = models.Site.objects.filter(id=1).first().siteName
        res["status"] = models.Site.objects.filter(id=1).first().status
        res["PH"] = i.get("pH")
        res["NTU"] = i.get("NTU")
        res["chlorine"] = i.get("chlorine")
        res["ele"] = str(round(float(i.get("ele")) * 0.0001, 2))
        res["oxygen"] = i.get("oxygen")
        res["tem"] = i.get("tem")
        res["time"] = (i.get("time")).strftime("%Y/%m/%d-%H:%M:%S")
        json_data_one.append(res)

    obj2 = models.WaterData.objects.filter(site_id=2).annotate(Min('time')).values()
    json_data_two = []
    for i in obj2:
        ret = {}
        ret["siteName"] = models.Site.objects.filter(id=2).first().siteName
        ret["status"] = models.Site.objects.filter(id=2).first().status
        ret["PH"] = i.get("pH")
        ret["NTU"] = i.get("NTU")
        ret["chlorine"] = i.get("chlorine")
        ret["ele"] = str(round(float(i.get("ele")) * 0.0001, 2))
        ret["oxygen"] = i.get("oxygen")
        ret["tem"] = i.get("tem")
        ret["time"] = (i.get("time")).strftime("%Y/%m/%d-%H:%M:%S")
        json_data_two.append(ret)

    obj3 = models.WaterData.objects.filter(site_id=3).annotate(Min('time')).values()
    json_data_three = []
    for i in obj3:
        res = {}
        res["siteName"] = models.Site.objects.filter(id=3).first().siteName
        res["status"] = models.Site.objects.filter(id=3).first().status
        res["PH"] = i.get("pH")
        res["NTU"] = i.get("NTU")
        res["chlorine"] = i.get("chlorine")
        # 电导率计算1us/cm=10^(-4)s/m
        res["ele"] = str(round(float(i.get("ele")) * 0.0001, 2))
        res["oxygen"] = i.get("oxygen")
        res["tem"] = i.get("tem")
        res["time"] = (i.get("time")).strftime("%Y/%m/%d-%H:%M:%S")
        json_data_three.append(res)
    RET = {}
    RET['data1'] = json_data_one
    RET['data2'] = json_data_two
    RET['data3'] = json_data_three
    RET['location'] = location_list
    # print(json_data_one)
    # print(json_data_two)

    return JsonResponse(RET)


# 折线图
class Aliyun(APIView):
    """
    water信息展示
    """

    def get(self, request):

        res = models.WaterData.objects.values('pH', 'NTU', 'oxygen', 'tem', 'ele', 'time').filter(site=1)
        if res:
            return Response(res)
        else:
            return Response(res)


def water_test(request):
    if request.method == "GET":
        return render(request, "test.html")
