from django.db import models
class Shared(models.Model):
    class Meta:
        db_table='shared'
    file_id=models.CharField(primary_key=True)
    user_id=models.CharField()
    priority=models.IntegerField()
    owner=models.CharField()