from django import forms
from django.core import validators
from UserData.models import UserDataModels, UserDataModelsContext


# 注册表单
class userRegisterForm(forms.Form):
    username = forms.CharField(max_length=10, min_length=6,
                               error_messages={'required': '不能为空', "max_length": '用户名长度不大于10',
                                               'min_length': '用户名长度不小于6'})
    phonenumber = forms.CharField(max_length=11, error_messages={'required': '不能为空', "max_length": '请输入有效的手机号码',
                                                                 "invalid": '请输入有效的手机号码', 'min_length': '请输入有效的手机号码'},
                                  validators=(validators.RegexValidator(regex='[\d]{11}'),))
    password1 = forms.CharField(max_length=10, min_length=6,
                                error_messages={'required': '不能为空', "max_length": '密码长度不大于10',
                                                "min_length": '密码长度小于6'})
    password2 = forms.CharField(max_length=10, min_length=6,
                                error_messages={'required': '不能为空', "max_length": '密码长度不大于10',
                                                "min_length": '密码长度小于6'})

    def clean_username(self):
        username = self.cleaned_data.get('username', None)
        if UserDataModels.objects.filter(username=username).exists():
            raise forms.ValidationError(message="用户已存在", code="UserRepeat")
        else:
            return username

    def clean_phonenumber(self):
        phonenumber = self.cleaned_data.get('phonenumber', None)
        if UserDataModels.objects.filter(phoneNumber=phonenumber).exists():
            raise forms.ValidationError(message="该手机号码不可用", code="PhonenumberRepeat")
        else:
            return phonenumber

    def clean(self):
        password1 = self.cleaned_data.get('password1')
        password2 = self.cleaned_data.get('password2')
        if password1 != password2:
            raise forms.ValidationError(message='密码不一致', code='passwprdError')
        else:
            return self.cleaned_data


# 登录表单
class userLoginForm(forms.Form):
    phonenumber = forms.CharField(max_length=11, error_messages={'required': '不能为空', "max_length": '请输入有效的手机号码',
                                                                 "invalid": '请输入有效的手机号码', 'min_length': '请输入有效的手机号码'},
                                  validators=(validators.RegexValidator(regex='[\d]{11}'),))
    password = forms.CharField(max_length=10, min_length=6,
                               error_messages={'required': '不能为空', "max_length": '密码长度不大于10',
                                               "min_length": '密码长度小于6'})
    voluntarilyLogin = forms.NullBooleanField()


# 修改email
class UserEmailModification(forms.Form):
    oldEmail = forms.EmailField(error_messages={'required': '不能为空', 'invalid': '请输入有效的电子邮件地址'})
    newEmail = forms.EmailField(error_messages={'required': '不能为空', 'invalid': '请输入有效的电子邮件地址'})

    def clean_newEmail(self):
        email = self.cleaned_data.get('newEmail')
        if UserDataModels.objects.filter(useremail=email).exists():
            raise forms.ValidationError(code='400', message='该邮箱已存在')
        else:
            return email


# 添加邮箱
class newEmail(forms.Form):
    newEmail1 = forms.EmailField(error_messages={'required': '不能为空', 'invalid': '请输入有效的电子邮件地址'})

    def clean_newEmail1(self):
        email = self.cleaned_data.get('newEmail1')
        if UserDataModels.objects.filter(useremail=email).exists():
            raise forms.ValidationError(code='400', message='该邮箱已存在')
        else:
            return email


# 修改phonenumber
class UserPhoneNumberModification(forms.Form):
    oldPhoneNumber = forms.CharField(max_length=11, error_messages={'required': '不能为空', "max_length": '请输入有效的手机号码',
                                                                    "invalid": '请输入有效的手机号码'},
                                     validators=(validators.RegexValidator(regex='[\d]{11}'),))
    newPhoneNumber = forms.CharField(max_length=11, error_messages={'required': '不能为空', "max_length": '请输入有效的手机号码',
                                                                    "invalid": '请输入有效的手机号码'})

    def clean_newPhoneNumber(self):
        phonenumber = self.cleaned_data.get('newPhoneNumber')
        if UserDataModels.objects.filter(phoneNumber=phonenumber).exists():
            raise forms.ValidationError(code=400, message='该手机号码已存在')
        else:
            return phonenumber

# 修改密码
class UserPasswordModification(forms.Form):
    oldPassword = forms.CharField(max_length=10, min_length=6,
                                  error_messages={'required': '不能为空', "max_length": '密码长度不大于10',
                                                  "min_length": '密码长度小于6'})
    newPassword1 = forms.CharField(max_length=10, min_length=6,
                                   error_messages={'required': '不能为空', "max_length": '密码长度不大于10',
                                                   "min_length": '密码长度小于6'})
    newPassword2 = forms.CharField(max_length=10, min_length=6,
                                   error_messages={'required': '不能为空', "max_length": '密码长度不大于10',
                                                   "min_length": '密码长度小于6'})

# 修改昵称
class UserNickname(forms.Form):
    modificationBorder_nickname = forms.CharField(max_length=10,
                                                  error_messages={'required': '不能为空', "max_length": '请输入有效的昵称'})

    def clean_modificationBorder_nickname(self):
        name = self.cleaned_data.get('modificationBorder_nickname')
        if UserDataModels.objects.filter(username=name).exists():
            raise forms.ValidationError(code=400, message='用户昵称不可用')
        else:
            return name

# 修改签名
class UserSignature(forms.Form):
    personalizedContext = forms.CharField(required=False, )


class UserImage(forms.Form):
    image = forms.ImageField(validators=[validators.FileExtensionValidator(allowed_extensions=['jpg', 'png']), ])

class add_Shop_data(forms.Form):
    shopName = forms.CharField()
    shopPrice = forms.CharField(validators=(validators.RegexValidator(regex='^[0-9]+$', message='非数字'),))
    shopQuantity = forms.CharField(validators=(validators.RegexValidator(regex='^[0-9]+$', message='非数字'),))
    shopImage = forms.ImageField(error_messages={'required': '缺少商品图片', 'empty': '文件类型错误'})
