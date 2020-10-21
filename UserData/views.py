from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.template.context_processors import csrf
from .models import UserDataModels, UserDataModelsContext
from . import formdata
from django.shortcuts import redirect, reverse
from customDecorator.CheckTheLogin import examineLogin
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
import os


# Create your views here.
# 登录页面
def User_data(request):
    return render(request, 'userLoginIndex/UserIndex.html', context=csrf(request))


# 注册api
def User_register_data(request):
    datas = formdata.userRegisterForm(request.POST)
    if datas.is_valid():
        username = datas.cleaned_data.get('username', None)
        phonenumber = datas.cleaned_data.get('phonenumber', None)
        password1 = datas.cleaned_data.get('password1', None)
        password2 = datas.cleaned_data.get('password2', None)
        if password1 != password2:
            return JsonResponse({
                "code": 201,  # 密码不一致
                "datas": {
                    "reaction": "passwordInconformity",  # 密码不一致
                    "errors": "确认密码不一致"
                }
            })
        else:
            UserObject = UserDataModels.objects.create(username=username, phoneNumber=phonenumber,
                                                       userPassword=password2)
            UserDataModelsContext.objects.create(UserObject=UserObject)
            return JsonResponse({
                "code": 200,
                "datas": {
                    "reaction": "userCreatorSucceed",  # 用户创建成功
                    "erroes": ""
                }
            })
    else:
        return JsonResponse({
            "code": 400,
            "datas": {
                "reaction": "userCreatorLose",  # 用户创建失败
                "errors": "用户创建失败"
            }
        })


# 登录api
def User_login_data(request):
    datas = formdata.userLoginForm(request.POST)
    if datas.is_valid():
        phonenumber = datas.cleaned_data.get('phonenumber', None)
        password = datas.cleaned_data.get('password', None)
        voluntarilyLogin = datas.cleaned_data.get('voluntarilyLogin', None)
        try:
            user = UserDataModels.objects.get(phoneNumber=phonenumber, )
        except Exception as errors:
            user = None
        if not user:
            return JsonResponse({
                "code": 204,
                'datas': {
                    "reaction": 'userNone',  # 用户不存在
                    "errors": '用户不存在'
                }
            })
        if user.userPassword == password:
            # 设置cookie,session
            if not voluntarilyLogin:
                Request = render(request, 'index/index.html', )
                request.session['UserName'] = user.username
                request.session.set_expiry(0)  # 关闭浏览器过期
                return Request
            else:
                Request = render(request, 'index/index.html', )
                request.session.set_expiry(86400)  # 一天时间过期
                request.session['UserName'] = user.username
                return Request
        else:
            return JsonResponse({
                "code": 203,  # 密码错误
                "datas": {
                    "reaction": "passwordError",
                    "errors": "密码错误"
                }
            })
    else:
        return JsonResponse({
            "code": 400,
            "datas": {
                "reaction": "formError",  # 表单错误
                "errors": "表单错误"
            }
        })


# 退出登录api
def quit_User(request):
    request.session.flush()
    return redirect(reverse('index:index'))


# 个人中心
@examineLogin
def personageCentre(request):
    return render(request, 'userLoginData/UserData.html', context=csrf(request))


# 修改数据: email
@examineLogin
def emailModification(request):
    emaildatas = formdata.UserEmailModification(request.POST)
    if emaildatas.is_valid():
        # 判断邮箱是否一致
        if request.user_datas.useremail == emaildatas.cleaned_data.get('oldEmail', None):
            UserDataModels.objects.filter(phoneNumber=request.user_datas.phoneNumber).update(
                useremail=emaildatas.cleaned_data.get('newEmail', None))
            return JsonResponse({
                "code": 200,
                "datas": {
                    "reaction": "EmailModificationSucceed",  # 邮箱修改成功
                    "errors": ""
                }
            })
        else:
            return JsonResponse({
                "code": 203,
                "datas": {
                    "reaction": "EmailInconformity",  # 邮箱不一致
                    "errors": "邮箱不一致"
                }
            })
    else:
        # {'oldEmail': [{'message': '请输入有效的电子邮件地址', 'code': 'invalid'}], 'newEmail': [{'message': '请输入有效的电子邮件地址', 'code': 'invalid'}]}
        return JsonResponse({
            "code": 400,
            "datas": {
                "reaction": "formError",  # 表单错误
                "errors": {
                    'error': emaildatas.errors.get_json_data()
                }
            }
        })


# 修改数据: phonenumber
@examineLogin
def phoneNumberModification(request):
    phonenumberdatas = formdata.UserPhoneNumberModification(request.POST)
    if phonenumberdatas.is_valid():
        if request.user_datas.phoneNumber == phonenumberdatas.cleaned_data.get('oldPhoneNumber', None):
            UserDataModels.objects.filter(phoneNumber=request.user_datas.phoneNumber).update(
                phoneNumber=phonenumberdatas.cleaned_data.get('newPhoneNumber', None))
            return JsonResponse({
                "code": 200,
                "datas": {
                    "reaction": "PhoneNumberModificationSucceed",  # 手机号码修改成功
                    "errors": ""
                }
            })
        else:
            return JsonResponse({
                "code": 203,
                "datas": {
                    "reaction": "phonenumberInconformity",  # 手机号码不一致
                    "errors": "手机号码不一致"
                }
            })
    else:
        return JsonResponse({
            "code": 400,
            "datas": {
                "reaction": "formError",  # 表单错误
                "errors": {
                    'error': phonenumberdatas.errors.get_json_data()
                }
            }
        })


# 修改数据: password
@examineLogin
def passwordModification(request):
    passwordDatas = formdata.UserPasswordModification(request.POST)
    if passwordDatas.is_valid():
        if passwordDatas.cleaned_data.get('oldPassword', None) == request.user_datas.userPassword:
            if passwordDatas.cleaned_data.get('newPassword1') == passwordDatas.cleaned_data.get('newPassword2', None):
                UserDataModels.objects.filter(phoneNumber=request.user_datas.phoneNumber).update(
                    userPassword=passwordDatas.cleaned_data.get('newPassword2', None))
                return JsonResponse({
                    "code": 200,
                    "datas": {
                        "reaction": "passwordModificationSucceed",  # 密码不一致错误
                        "errors": '密码修改成功'
                    }
                })
            else:
                return JsonResponse({
                    "code": 201,
                    "datas": {
                        "reaction": "passwordInconformityError",  # 密码不一致错误
                        "errors": '确认密码不一致错误'
                    }
                })
        else:
            return JsonResponse({
                "code": 203,
                "datas": {
                    "reaction": "passwordError",  # 密码错误
                    "errors": '原密码错误'
                }
            })
    else:
        print(passwordDatas.errors.get_json_data())
        return JsonResponse({
            "code": 400,
            "datas": {
                "reaction": "formError",  # 表单错误
                "errors": passwordDatas.errors.get_json_data()
            }
        })


# 我的信息页面
@examineLogin
def myInformation(request):
    UserData = UserDataModelsContext.objects.filter(UserObject__phoneNumber=request.user_datas.phoneNumber).first()
    return render(request, 'userLoginData/myInformation.html', context={'UserDataContext': UserData})


#  修改信息api
@examineLogin
def changeInformation(request):
    datas = formdata.UserMyInformation(request.POST)
    if datas.is_valid():
        #  判断personalizedContext是否为空
        if datas.cleaned_data.get('personalizedContext', None) is '':
            datas.cleaned_data.update({'personalizedContext': '大家好'})
        UserDataModelsContext.objects.filter(
            UserObject__phoneNumber=request.user_datas.phoneNumber).update(
            signatureText=datas.cleaned_data.get('personalizedContext', None))
        UserDataModels.objects.filter(phoneNumber=request.user_datas.phoneNumber).update(
            username=datas.cleaned_data.get('modificationBorder_nickname', None))
        return JsonResponse({
            "code": 200,
            "datas": {
                "reaction": "succeed",  # 用户信息修改成功
                "errors": ""
            }
        })
    else:
        print(datas.errors.get_json_data())
        return JsonResponse({
            "code": 400,
            "datas": {
                "reaction": "lose",  # 用户信息修改失败
                "errors": datas.errors.get_json_data()
            }
        })


# 我的头像页面
@examineLogin
def myProfile(request):
    UserImage = UserDataModelsContext.objects.filter(UserObject__phoneNumber=request.user_datas.phoneNumber).first()
    img = UserDataModels.objects.filter(phoneNumber=request.user_datas.phoneNumber).first()
    print(img.demo)
    return render(request, 'userLoginData/profile.html', context={'UserImage': UserImage.portraitImage})


#  用户头像设置
@csrf_exempt
def UserPortrait(request):  # images = request.FILES.get('image')
    # with open(os.path.join(settings.BASE_DIR, 'statics', 'publicfiles', 'images', images.name), 'wb+') as f:
    #     f.write(images.read())
    images = request.FILES
    print(images)
    img = UserDataModelsContext.objects.filter(UserObject__phoneNumber=request.user_datas.phoneNumber).first()
    img.portraitImage = images['image']
    img.save()
    return HttpResponse('ok')
