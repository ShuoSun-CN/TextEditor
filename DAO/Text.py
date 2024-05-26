from django.db import models
class Text(models.Model):
    class Meta:
        db_table='text'
    file_id=models.CharField(primary_key=True)
    file_name=models.CharField()
    owner=models.CharField()
    shared_write=models.IntegerField()