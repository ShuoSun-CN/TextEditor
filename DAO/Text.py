from django.db import models
class Text(models.Model):
    class Meta:
        db_table='text'
    file_id=models.CharField(primary_key=True)
    file_name=models.CharField()
    owner=models.CharField()
    create_time=models.DateTimeField()
    update_time=models.DateTimeField()
    def get_dict(self):
        one_dict = {
            'file_id': self.file_id,
            'file_name': self.file_name,
            'user_id': self.owner,
            "create_time":self.create_time,
            "update_time":self.update_time
        }
        return one_dict