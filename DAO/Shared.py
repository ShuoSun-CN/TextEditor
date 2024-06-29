from django.db import models
class Shared(models.Model):
    file_id=models.CharField()
    user_id=models.CharField()
    priority=models.IntegerField()
    owner=models.CharField()
    class Meta:
        db_table='shared'
