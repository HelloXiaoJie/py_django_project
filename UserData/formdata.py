from django import forms
from django.core import validators


# 注册表单
class userRegisterForm(forms.Form):
    username = forms.CharField(max_length=10, )
    phonenumber = forms.CharField(max_length=11, )
    password1 = forms.CharField(max_length=10, )
    password2 = forms.CharField(max_length=10, )


# 登录表单
class userLoginForm(forms.Form):
    phonenumber = forms.CharField(max_length=11, )
    password = forms.CharField(max_length=10, )
    voluntarilyLogin = forms.NullBooleanField()


# 修改email
class UserEmailModification(forms.Form):
    oldEmail = forms.EmailField(error_messages={'required': '不能为空', 'invalid': '请输入有效的电子邮件地址'})
    newEmail = forms.EmailField(error_messages={'required': '不能为空', 'invalid': '请输入有效的电子邮件地址'})


# 修改phonenumber
class UserPhoneNumberModification(forms.Form):
    oldPhoneNumber = forms.CharField(max_length=11, error_messages={'required': '不能为空', "max_length": '请输入有效的手机号码',
                                                                    "invalid": '请输入有效的手机号码'},
                                     validators=(validators.RegexValidator(regex='[\d]{11}'),))
    newPhoneNumber = forms.CharField(max_length=11, error_messages={'required': '不能为空', "max_length": '请输入有效的手机号码',
                                                                    "invalid": '请输入有效的手机号码'})


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


class UserMyInformation(forms.Form):
    modificationBorder_nickname = forms.CharField(max_length=10,
                                                  error_messages={'required': '不能为空', "max_length": '请输入有效的昵称'})
    personalizedContext = forms.CharField(required=False, )

class UserImage(forms.Form):
    image = forms.ImageField()
