from rest_framework import serializers

from api import models


class PagerSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Log
        fields = "__all__"
