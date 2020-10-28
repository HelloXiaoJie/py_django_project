from django.db import models
from django.conf import settings

# Create your models here.
class UserDataModels(models.Model):
    # 用户昵称
    username = models.CharField(max_length=10, unique=True)
    # 用户手机号码
    phoneNumber = models.CharField(max_length=11, unique=True)
    # 密码-- 明文
    userPassword = models.CharField(max_length=10, )
    # email
    useremail = models.EmailField(null=True, )

    class Meta:
        db_table = 'userdata'


class UserDataModelsContext(models.Model):
    #  个性签名
    signatureText = models.TextField(default='大家好')
    # 个人头像
    portraitImage = models.ImageField(null=True, upload_to='UserPortrait', default='UserPortrait/用户.png')
    UserObject = models.OneToOneField('UserDataModels', on_delete=models.CASCADE, null=True)

    class Meta:
        db_table = 'userContext'