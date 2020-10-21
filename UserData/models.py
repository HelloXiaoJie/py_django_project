from django.db import models
from django.conf import settings

# Create your models here.
class UserDataModels(models.Model):
    # 用户昵称
    username = models.CharField(max_length=10, )
    # 用户手机号码
    phoneNumber = models.CharField(max_length=11)
    # 用户密码
    userPassword = models.CharField(max_length=10, )
    # email
    useremail = models.EmailField(null=True)

    class Meta:
        db_table = 'userdata'


class UserDataModelsContext(models.Model):
    #  个性签名
    signatureText = models.TextField(default='大家好')
    portraitImage = models.ImageField(null=True, upload_to='UserPortrait', default='UserPortrait/用户.png')
    UserObject = models.OneToOneField('UserDataModels', on_delete=models.CASCADE, null=True)

    class Meta:
        db_table = 'userContext'


class DemoModel(models.Model):
    name = models.CharField(max_length=10)
    user = models.ForeignKey('UserDataModels', on_delete=models.CASCADE, related_name='demo')