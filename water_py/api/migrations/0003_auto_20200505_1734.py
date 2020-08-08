# Generated by Django 2.1.4 on 2020-05-05 09:34

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_auto_20200505_1518'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='site',
            options={'verbose_name': '站点信息', 'verbose_name_plural': '站点信息'},
        ),
        migrations.RemoveField(
            model_name='site',
            name='water',
        ),
        migrations.AddField(
            model_name='waterdata',
            name='status',
            field=models.IntegerField(choices=[(1, '正常'), (2, '异常'), (0, '离线')], default=1, verbose_name='站点状态'),
        ),
        migrations.AlterField(
            model_name='waterdata',
            name='site',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.Site', verbose_name='站点信息'),
        ),
    ]
