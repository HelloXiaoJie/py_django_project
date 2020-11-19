from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.template.context_processors import csrf
from .models import UserDataModels, UserDataModelsContext, UserShop
from . import formdata
from django.shortcuts import redirect, reverse
from customDecorator.CheckTheLogin import examineLogin
from django.views.decorators.csrf import csrf_exempt
from publicInstrument.suffix_examine import suffix_check
from django.conf import settings


# Create your views here.
# 登录页面
def User_data(request):
    return render(request, 'userLoginIndex/UserIndex.html', context=csrf(request))


# 注册api
def User_register_data(request):
    datas = formdata.userRegisterForm(request.POST)
    if datas.is_valid():
        userdata = UserDataModels.objects.create(username=datas.cleaned_data.get('username', None),
                                                 phoneNumber=datas.cleaned_data.get('phonenumber', None),
                                                 userPassword=datas.cleaned_data.get('password2', None))
        UserDataModelsContext.objects.create(UserObject=userdata)
        return JsonResponse({
            "code": 200,
            "datas": {
                "reaction": "userCreatorsucceed",  # 用户创建成功
                "errors": "用户创建成功"
            }
        })
    else:
        # print(datas.errors.get_json_data())
        return JsonResponse({
            "code": 400,
            "datas": {
                "reaction": "userCreatorLose",  # 用户创建失败
                "errors": datas.errors.get_json_data()
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
        except:
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
                request.session['phoneNumber'] = user.phoneNumber
                request.session.set_expiry(0)  # 关闭浏览器过期
                return Request
            else:
                Request = render(request, 'index/index.html', )
                request.session.set_expiry(86400)  # 一天时间过期
                request.session['phoneNumber'] = user.phoneNumber
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
                "errors": datas.errors.get_json_data()
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
        if request.user_datas.get('userdatas').get('useremail') == emaildatas.cleaned_data.get('oldEmail', None):
            UserDataModels.objects.filter(phoneNumber=request.user_datas.get('userdatas').get('phoneNumber')).update(
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


# 添加邮箱
@examineLogin
def newEmailModification(request):
    datas = formdata.newEmail(request.POST)
    if datas.is_valid():
        UserDataModels.objects.filter(phoneNumber=request.user_datas.get('userdatas').get('phoneNumber')).update(
            useremail=datas.cleaned_data.get('newEmail1'))
        return JsonResponse({
            "code": 200,
            "datas": {
                "reaction": "邮箱添加成功",  # 邮箱修改成功
                "errors": ""
            }
        })
    else:
        return JsonResponse({
            "code": 400,
            "datas": {
                "reaction": "邮箱添加失败",  # 邮箱修改成功
                "errors": datas.errors.get_json_data()
            }
        })


# 修改数据: phonenumber
@examineLogin
def phoneNumberModification(request):
    phonenumberdatas = formdata.UserPhoneNumberModification(request.POST)
    if phonenumberdatas.is_valid():
        if request.user_datas.get('userdatas').get('phoneNumber') == phonenumberdatas.cleaned_data.get('oldPhoneNumber',
                                                                                                       None):
            UserDataModels.objects.filter(phoneNumber=request.user_datas.get('userdatas').get('phoneNumber')).update(
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
        if passwordDatas.cleaned_data.get('oldPassword', None) == request.user_datas.get('userdatas').get(
                'userPassword'):
            if passwordDatas.cleaned_data.get('newPassword1') == passwordDatas.cleaned_data.get('newPassword2', None):
                UserDataModels.objects.filter(
                    phoneNumber=request.user_datas.get('userdatas').get('phoneNumber')).update(
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
    return render(request, 'userLoginData/myInformation.html')


#  修改昵称
@examineLogin
def modification_userName(request):
    datas_name = formdata.UserNickname(request.POST)  # 昵称
    datas_content = formdata.UserSignature(request.POST)  # 签名
    dict_data = {
        'code': {
            'name_code': 0,
            'content_code': 0
        },
        'datas': {
            'name_erroes': '',
            'content_error': ''
        }
    }
    if datas_name.is_valid():
        UserDataModels.objects.filter(
            phoneNumber=request.user_datas.get('userdatas').get('phoneNumber')).update(
            username=datas_name.cleaned_data.get('modificationBorder_nickname', None))
        dict_data['code'].update({
            'name_code': 200
        })
        dict_data['datas'].update({
            'name_erroes': ''
        })
    else:
        dict_data['code'].update({
            'name_code': 400
        })
        dict_data['datas'].update({
            'name_erroes': datas_name.errors.get_json_data()
        })

    if datas_content.is_valid():
        UserDataModelsContext.objects.filter(
            UserObject__phoneNumber=request.user_datas.get('userdatas').get('phoneNumber')).update(
            signatureText=datas_content.cleaned_data.get('personalizedContext', None))
        dict_data['code'].update({
            'content_code': 200
        })
        dict_data['datas'].update({
            'content_error': ''
        })
    else:
        dict_data['code'].update({
            'content_code': 400
        })
        dict_data['datas'].update({
            'content_error': datas_content.errors.get_json_data()
        })
    return JsonResponse(dict_data)


# 我的头像页面
@examineLogin
def myProfile(request):
    FileImageTage = formdata.UserImage()
    return render(request, 'userLoginData/profile.html', context={'FileImageTage': FileImageTage})


#  用户头像设置
@csrf_exempt
@examineLogin
def UserPortrait(request):  # images = request.FILES.get('image')
    images = request.FILES.get('image', None)
    if not images:
        return JsonResponse({
            "code": 400,
            "datas": {
                "reaction": "no data",  # 用户信息修改失败
                "errors": "no data"
            }
        })
    if suffix_check(str(images), ['jpg', 'png']):
        if images.size < 2097152:
            userContext = UserDataModelsContext.objects.filter(
                UserObject__phoneNumber=request.user_datas.get('userdatas').get('phoneNumber')).first()
            userContext.portraitImage = images
            userContext.save()
            return JsonResponse({
                "code": 200,
                "datas": {
                    "reaction": settings.MEDIA_URL + str(userContext.portraitImage),  # 图片上传成功
                    "errors": ""
                }
            })
        else:
            return JsonResponse({
                "code": 206,
                "datas": {
                    "reaction": "图片超过2M",  # 图片超过2M
                    "errors": "图片超过2M"
                }
            })
    else:
        return JsonResponse({
            "code": 205,
            "datas": {
                "reaction": "file type error",  # 文件类型错误
                "errors": "文件类型错误"
            }
        })


# 购物车
def shopping_trolley_page(request):
    return render(request, 'userLoginData/shopping_trolley_page.html')


# 我的商店
def my_shop(request):
    # 用户商品的数量
    user_shop_number = UserDataModels.objects.filter(phoneNumber=request.user_datas.get('userdatas').get('phoneNumber')).first()
    # 该用户所有的商品
    return render(request, 'userLoginData/my_shop.html', context={'user_shop_number': user_shop_number.usershop_set.count()})


# 开启商店权限api
def open_shop_jurisdiction_api(request):
    user_phone = request.POST.get('openShop')  # 1
    user = UserDataModels.objects.filter(phoneNumber=request.user_datas.get('userdatas').get('phoneNumber'))
    if not user:
        return JsonResponse({
            'code': 400,
            'datas': 'user_error'  # 无改用户
        })

    # 检查是否开启商店
    if user.first().shop == 0:
        user.update(shop=user_phone)
        return JsonResponse({
            'code': 200,
            'datas': 'ok'
        })
    else:
        return JsonResponse({
            'code': 400,
            'datas': 'error'
        })


# 添加商品页面
def add_shop(request):
    return render(request, 'add_shop/add_shop.html')


# 添加商店api
def add_shop_data_aip(request):
    datas = formdata.add_Shop_data(request.POST, request.FILES)
    if datas.is_valid():
        user = UserDataModels.objects.filter(phoneNumber=request.user_datas.get('userdatas').get('phoneNumber')).first()
        usershop = UserShop.objects.create(
            shopName=datas.cleaned_data.get('shopName'),
            shopPrice=datas.cleaned_data.get('shopPrice'),
            shopQuantity=datas.cleaned_data.get('shopQuantity'),
            shopImage=datas.cleaned_data.get('shopImage'),
            shopUser=user
        )
        usershop.save()
        return JsonResponse({
            'code': 200,
            'datas': ''
        })
    else:
        return JsonResponse({
            'code': 400,
            'datas': datas.errors.get_json_data()
        })
