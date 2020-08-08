from django.db import models
from django.contrib.auth.models import AbstractUser


class UserInfo(AbstractUser):
    """
    用户
    """
    phone = models.CharField(max_length=11, verbose_name="电话")
    nickname = models.CharField(max_length=32, null=True, blank=True, verbose_name="昵称")
    des = models.CharField(max_length=300, null=True, blank=True, verbose_name="个性签名")

    class Meta:
        verbose_name = "用户"
        verbose_name_plural = verbose_name

    def __str__(self):
        return self.username


class Dev(models.Model):
    """
    设备
    """
    devName = models.CharField(max_length=32, verbose_name="设备名称")
    devNum = models.CharField(max_length=32, verbose_name="设备编号")
    devDate = models.DateTimeField(max_length=32, verbose_name="设备日期")
    devSIM = models.CharField(max_length=100, verbose_name="SIM卡号")
    devUse = models.BooleanField(verbose_name="是否正在使用")
    devLocation = models.CharField(max_length=200, verbose_name="位置")
    devAdmin = models.CharField(max_length=32, null=True, blank=True, verbose_name="维护人员")
    cTime = models.DateTimeField(max_length=100, null=True, blank=True, verbose_name="创建时间")
    site = models.ForeignKey(to='Site', default=1, verbose_name="站点信息", on_delete=models.CASCADE)

    class Meta:
        verbose_name = "设备"
        verbose_name_plural = verbose_name
        ordering = ["devNum"]

    def __str__(self):
        return self.devName


class Log(models.Model):
    """
    日志
    """
    username = models.CharField(max_length=32, blank=True, null=True, verbose_name="用户名")
    lastLoginTime = models.DateTimeField(max_length=100, blank=True, null=True, verbose_name="上次登录时间")
    lastLoginIp = models.CharField(max_length=32, blank=True, null=True, verbose_name="上次登录IP")
    nowLoginTime = models.DateTimeField(max_length=100, blank=True, null=True, verbose_name="本次登录时间")
    nowLoginIp = models.CharField(max_length=32, blank=True, null=True, verbose_name="本次登录IP")

    class Meta:
        verbose_name = "日志"
        verbose_name_plural = verbose_name
        ordering = ["username"]

    def __str__(self):
        return self.username


class OperationLogs(models.Model):
    """
    管理员操作日志
    """
    admin = models.CharField(max_length=64, verbose_name="管理员")
    opa = models.CharField(max_length=200, null=True, verbose_name="操作记录")
    cTime = models.DateTimeField(max_length=100, blank=True, null=True, verbose_name="操作时间")

    class Meta:
        verbose_name = "操作日志"
        verbose_name_plural = verbose_name
        ordering = ["admin"]

    def __str__(self):
        return self.admin


class InfoShares(models.Model):
    """
    信息分享
    """
    shareName = models.CharField(max_length=32, verbose_name="发布人员")
    contents = models.CharField(max_length=200, verbose_name="内容")
    cTime = models.DateTimeField(max_length=100, null=True, blank=True, verbose_name="创建时间")
    imgSrc = models.ImageField(upload_to='img', null=True, blank=True)

    class Meta:
        verbose_name = "信息分享"
        verbose_name_plural = verbose_name
        ordering = ["shareName"]

    def __str__(self):
        return self.shareName


class Site(models.Model):
    """
    站点信息
    """
    site_status = (
        (1, "正常"),
        (2, "异常"),
        (0, "离线")
    )
    siteName = models.CharField(max_length=32, verbose_name="站点名称")
    siteLocation = models.CharField(max_length=200, null=True, blank=True, verbose_name="位置")
    user = models.ForeignKey(to='UserInfo', null=True, blank=True, verbose_name="管理员", on_delete=models.CASCADE)
    status = models.IntegerField(choices=site_status, default=1, verbose_name="站点状态")

    class Meta:
        verbose_name = "站点信息"
        verbose_name_plural = verbose_name


class WaterData(models.Model):
    """
    各站点的水务数据
    """

    pH = models.CharField(max_length=32, verbose_name="PH")
    NTU = models.CharField(max_length=32, verbose_name="浑浊度")
    oxygen = models.CharField(max_length=32, verbose_name="溶解氧")
    tem = models.CharField(max_length=32, verbose_name="水温")
    ele = models.CharField(max_length=32, verbose_name="电导率")
    chlorine = models.CharField(max_length=32, verbose_name="余氯")

    time = models.DateTimeField(max_length=100, blank=True, null=True, verbose_name="上报日期")
    site = models.ForeignKey(to='Site', verbose_name="站点信息", on_delete=models.CASCADE)

    class Meta:
        verbose_name = "水务数据信息"
        verbose_name_plural = verbose_name


class DataSite(models.Model):
    """
    统计表
    """
    pH = models.CharField(max_length=32, verbose_name="PH合格率")
    NTU = models.CharField(max_length=32, verbose_name="浊度合格率")
    chlorine = models.CharField(max_length=32, verbose_name="余氯合格率")
    time = models.DateTimeField(max_length=100, blank=True, null=True, verbose_name="上报日期")
    site = models.ForeignKey(to='Site', verbose_name="站点信息", on_delete=models.CASCADE)

    class Meta:
        verbose_name = "水务数据统计"
        verbose_name_plural = verbose_name
