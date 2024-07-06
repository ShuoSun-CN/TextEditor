from django.db import models
class RecentFile(models.Model):
    class Meta:
        db_table='recent_file'
    file_id=models.CharField()
    user_id=models.CharField()
    recent_time=models.DateTimeField()