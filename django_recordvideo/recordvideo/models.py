from django.db import models

# Create your models here.

class RecordVideo(models.Model):
    id = models.AutoField(primary_key=True)
    video = models.FileField(upload_to='video/')
