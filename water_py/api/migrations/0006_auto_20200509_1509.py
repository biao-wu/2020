# Generated by Django 2.1.4 on 2020-05-09 07:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_auto_20200506_1706'),
    ]

    operations = [
        migrations.AlterField(
            model_name='dev',
            name='devLocation',
            field=models.CharField(max_length=200, verbose_name='位置'),
        ),
    ]