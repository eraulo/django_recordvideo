from django.shortcuts import render
from django.views.generic import TemplateView
from recordvideo.models import RecordVideo
from rest_framework import viewsets, filters
from recordvideo.serializers import VideoSerializer

# Create your views here.

class Index(TemplateView):
    template_name = 'recordvideo/index.html'


class VideoViewSet(viewsets.ModelViewSet):
    queryset = RecordVideo.objects.all()
    serializer_class = VideoSerializer
    filter_backends = (filters.SearchFilter,)
    search_fields = ('id', 'video')

