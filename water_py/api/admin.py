from django.contrib import admin
from api.models import UserInfo
from api.models import Dev
from api.models import InfoShares
from api.models import WaterData
from api.models import Log


# User模型的管理器
class UserAdmin(admin.ModelAdmin):
    list_display = ('pk', 'username', 'password', 'phone', 'nickname', 'des')
    ordering = ['pk', ]


class DevAdmin(admin.ModelAdmin):
    list_display = ('devName', 'devNum', 'devDate', 'devSIM', 'devUse', 'devLocation', 'devAdmin', 'cTime')


class ShareAdmin(admin.ModelAdmin):
    list_display = ('shareName', 'contents', 'cTime', 'imgSrc')


class LogAdmin(admin.ModelAdmin):
    list_display = ('username', 'lastLoginTime', 'lastLoginIp', 'nowLoginTime', 'nowLoginIp')


class WaterAdmin(admin.ModelAdmin):
    list_display = ('pk', 'pH', 'NTU', 'oxygen', 'tem', 'ele', 'chlorine', 'site', 'time')
    ordering = ['pk', ]


#
#
# class SiteAdmin(admin.ModelAdmin):
#     list_display = ('pk', 'siteAll', 'siteON', 'siteOFF', 'siteExcept')
#     ordering = ['pk', ]


# Register your models here.
admin.site.register(UserInfo, UserAdmin)
admin.site.register(Dev, DevAdmin)
admin.site.register(InfoShares, ShareAdmin)
admin.site.register(Log, LogAdmin)
admin.site.register(WaterData, WaterAdmin)
