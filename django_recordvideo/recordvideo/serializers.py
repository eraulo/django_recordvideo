from rest_framework import serializers
from recordvideo.models import RecordVideo

class VideoSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = RecordVideo
        fields = ['url', 'id', 'video']
