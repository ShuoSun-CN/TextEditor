from django.db import models
class Session(models.Model):
    class Meta:
        db_table='session'
    session_id=models.CharField()
    user_id=models.CharField(primary_key=True)
    expired_time=models.DateTimeField()