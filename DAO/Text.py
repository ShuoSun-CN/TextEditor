from django.db import models
class Text(models.Model):
    class Meta:
        db_table='text'
    file_id=models.CharField(primary_key=True)
    file_name=models.CharField()
    owner=models.CharField()
    shared_write=models.IntegerField()
    def get_dict(self):
        one_dict = {
            'file_id': self.file_id,
            'file_name': self.file_name,
            'user_id': self.owner,
            'shared_write': self.shared_write,
        }
        return one_dict