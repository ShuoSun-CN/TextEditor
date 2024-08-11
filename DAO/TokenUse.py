from django.db import models
class TokenUse(models.Model):
    class Meta:
        db_table="tokens_use"

    user_id = models.CharField(max_length=20)
    consume_type=models.CharField()
    consume_tokens=models.IntegerField()
    rest_tokens=models.IntegerField()
    consume_time=models.DateTimeField()
    def get_dict(self):
        one_dict = {
            'consume_type': self.consume_type,  #星辉消费事项
            'consume_tokens': self.consume_tokens,  #消耗数量
            'rest_tokens': self.rest_tokens,   #剩余数量
            "consume_time":self.consume_time.strftime('%Y-%m-%d %H:%M:%S'),  #消费时间
        }
        return one_dict