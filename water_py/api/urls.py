from django.conf.urls import url
from django.conf import settings
from django.conf.urls.static import static

from api.views import dev
from api.views import logs
from api.views import water
from api.views import share
from api.views import accounts
from api.views import admin_logs
from api.views import test

urlpatterns = [
                  # 大屏页面
                  url(r'^water/$', water.Water.as_view(), name='water'),
                  # 表单
                  url(r'^water/form/$', water.water_form, name='water_form'),
                  url(r'^water/test/$', water.water_test, name='water_test'),
                  # 折线图展示
                  url(r'^aliyun$', water.Aliyun.as_view(), name='test'),
                  # 用户注册
                  url(r'^users/regist$', accounts.RegisterView.as_view(), name='register'),
                  # 用户登录
                  url(r'^users/login$', accounts.LoginView.as_view(), name='login'),
                  # 查看所有用户
                  url(r'^users/find$', accounts.UsersView.as_view(), name='users'),
                  # 更新用户信息
                  url(r'^users/updata$', accounts.UsersUpdateView.as_view(), name='update'),
                  # 更改密码
                  url(r'^users/uppwd$', accounts.UsersUppwd.as_view(), name='up_pwd'),
                  # 获取日志
                  url(r'^getlogs$', logs.GetLogs.as_view(), name='logs'),
                  # 获取所有日志
                  url(r'^getlogs/all$', logs.GetLogsAll.as_view(), name='logs_all'),
                  # 新增设备
                  url(r'^dev/adddev$', dev.AddDev.as_view(), name='add_dev'),
                  # 更新设备信息
                  url(r'^dev/updatedev$', dev.UpdateDev.as_view(), name='update_dev'),
                  # 删除设备
                  url(r'^dev/dltdev$', dev.DeleteDev.as_view(), name='del_find'),
                  # 查看设备
                  url(r'^dev/finddev$', dev.DevFind.as_view(), name='dev_find'),
                  # 查看所有设备
                  url(r'^dev/findalldev$', dev.DevFindAll.as_view(), name='dev_find'),
                  # 用户操作日志
                  url(r'^adminlogs$', admin_logs.AdminLogs.as_view(), name='admin_logs'),
                  # 用户操作所有日志
                  url(r'^adminlogs/all$', admin_logs.AdminLogsAll.as_view(), name='admin_logs_all'),
                  # 新增分享
                  url(r'^share/add$', share.ShareAdd.as_view(), name='share_add'),
                  # 分享内容展示
                  url(r'^share/contentpage$', share.ShareContentPage.as_view(), name='share_content'),
                  # 所有分享内容
                  url(r'^share/contentall$', share.ShareContentAll.as_view(), name='share_content_all'),
                  # 上传图片
                  url(r'^share/upload$', share.ShareUpload.as_view(), name='share_upload'),
                  # 测试接口
                  url(r'^test$', test.Test.as_view(), name='test'),
                  # 大屏图表展示ajax
                  url(r'^echarts/$', water.echarts_data, name='echarts'),
                  # 地图数据展示
                  url(r'^map/$', water.map_data, name='map'),

              ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
