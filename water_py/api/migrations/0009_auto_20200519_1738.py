# Generated by Django 2.1.4 on 2020-05-19 09:38

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0008_datasite'),
    ]

    operations = [
        migrations.AddField(
            model_name='dev',
            name='site',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='api.Site', verbose_name='站点信息'),
        ),
        migrations.AddField(
            model_name='site',
            name='siteLocation',
            field=models.CharField(blank=True, max_length=200, null=True, verbose_name='位置'),
        ),
        migrations.AddField(
            model_name='site',
            name='user',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='管理员'),
        ),
    ]