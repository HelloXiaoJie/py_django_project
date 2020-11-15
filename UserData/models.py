from django.db import models


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
    # 是否开放商店权限
    shop = models.IntegerField(default=0)

    class Meta:
        db_table = 'userdata'


class UserDataModelsContext(models.Model):
    #  个性签名
    signatureText = models.TextField(default='大家好')
    # 个人头像
    portraitImage = models.ImageField(null=True, upload_to='UserPortrait', default='UserPortrait/用户.png')
    UserObject = models.OneToOneField('UserDataModels', on_delete=models.CASCADE, null=True, related_name='usercontent')

    class Meta:
        db_table = 'userContext'


class UserShop(models.Model):
    shopUser = models.ForeignKey('UserDataModels', on_delete=models.SET_NULL, null=True)
    # 商品名称
    shopName = models.CharField(max_length=255)
    # 商品价格
    shopPrice = models.IntegerField()
    # 商品数量
    shopQuantity = models.IntegerField()
    # 月销售量
    monthlySales = models.IntegerField()
    # 收藏数量
    salesQuantity = models.IntegerField()

    class Meta:
        db_table = 'userShop'