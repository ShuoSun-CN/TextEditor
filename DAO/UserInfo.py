from django.db import models
class UserInfo(models.Model):
    class Meta:
        db_table='user_info'
    user_id=models.CharField(primary_key=True)
    user_name = models.CharField()
    user_avatar=models.CharField()
    vip=models.IntegerField()
    stars=models.FloatField()
    vip_expired_time=models.DateTimeField()