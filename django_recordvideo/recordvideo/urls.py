from django.urls import path
from recordvideo.views import Index

urlpatterns = [
    path('', Index.as_view(), name='index'),
]
