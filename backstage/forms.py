from django import forms
from django.core import validators
from UserData.models import UserDataModels


class app_user_data_form_api(forms.Form):
    username = forms.CharField(max_length=10, min_length=6,
                               error_messages={'required': '不能为空', "max_length": '用户名长度不大于10',
                                               'min_length': '用户名长度不小于6'})
    phoneNumber = forms.CharField(max_length=11, error_messages={'required': '不能为空', "max_length": '请输入有效的手机号码',
                                                                 "invalid": '请输入有效的手机号码',
                                                                 'min_length': '请输入有效的手机号码'},
                                  validators=(validators.RegexValidator(regex='[\d]{11}'),))
    useremail = forms.EmailField(error_messages={'required': '不能为空', 'invalid': '请输入有效的电子邮件地址'})
    userPassword = forms.CharField(max_length=10, min_length=6,
                                   error_messages={'required': '不能为空', "max_length": '密码长度不大于10',
                                                   "min_length": '密码长度小于6'})

    idiograph = forms.CharField(required=False)

    personal_icon_image = forms.ImageField(required=False, validators=[
        validators.FileExtensionValidator(allowed_extensions=['jpg', 'png']), ])

    def clean_username(self):
        username = self.cleaned_data.get('username')
        if UserDataModels.objects.filter(username=username).exists():
            raise forms.ValidationError(code='UserRepeat', message='用户已存在')
        return username

    def clean_phoneNumber(self):
        phoneNumber = self.cleaned_data.get('phoneNumber')
        if UserDataModels.objects.filter(phoneNumber=phoneNumber).exists():
            raise forms.ValidationError(code='PhonenumberRepeat', message='该手机号码不可用')
        return phoneNumber

    def clean_useremail(self):
        useremail = self.cleaned_data.get('useremail')
        if UserDataModels.objects.filter(useremail=useremail).exists():
            raise forms.ValidationError(code='400', message='该邮箱已存在')
        return useremail