from django.shortcuts import render, redirect, reverse
from django.http import HttpResponse, JsonResponse
from UserData.models import UserDataModels, UserDataModelsContext, UserShop
from django.template.context_processors import csrf
from . import forms


# 后台页面 首页
def backstage_page(request):
    return render(request, 'backstage_index/backstage_index.html', context={'page': 0})


# 后台页面 用户数据
def backstage_page_user_data(request):
    # 用户数据
    userdatas = UserDataModels.objects.all()
    return render(request, 'backstage_index/backstage_UserData.html', context={'userdata': userdatas, 'page': 1})


# 点击用户数据后返回数据
def User_data_api(request, user_pk):
    user_data = UserDataModels.objects.filter(pk=user_pk).first()
    user_data_content = UserDataModelsContext.objects.filter(UserObject=user_data).first()
    return render(request, 'backstage_index/backstage_user_data_api.html',
                  context={'data': user_data, 'data_content': user_data_content, 'page': 1})


def Delete_user_data_api(request):
    delete_datas_list = dict(request.POST).get('data_list[]', None)
    if not delete_datas_list:
        return JsonResponse({
            'code': 201,
            'datas': {
                'errors': '条目必须选中以对其进行操作'
            }
        })
    else:
        UserDataModels.objects.filter(pk__in=delete_datas_list).delete()  # 删除数据
        return JsonResponse({
            'code': 200,
            'datas': {
                'errors': ""
            }
        })


def add_user(request):
    context = {}
    context.update(csrf(request))
    context.update({'page': 1})
    return render(request, 'backstage_index/backstage_add_user.html', context=context)


# 添加用户api
def app_user_api(request):
    datas = forms.app_user_data_form_api(request.POST, request.FILES)
    if datas.is_valid():
        user_data = UserDataModels.objects.create(username=datas.cleaned_data.get('username'),
                                                  phoneNumber=datas.cleaned_data.get('phoneNumber'),
                                                  userPassword=datas.cleaned_data.get('userPassword'),
                                                  useremail=datas.cleaned_data.get('useremail'),
                                                  )
        user_content = UserDataModelsContext.objects.create()
        if datas.cleaned_data.get('idiograph', None):
            user_content.signatureText = datas.cleaned_data.get('idiograph')
        if datas.cleaned_data.get('personal_icon_image', None):
            user_content.portraitImage = datas.cleaned_data.get('personal_icon_image')
        user_content.UserObject = user_data
        user_content.save()
        return JsonResponse({
            'code': 200,
            'datas': {
                'errors': ''
            }
        })
    else:
        return JsonResponse({
            'code': 400,
            'datas': {
                'errors': datas.errors.get_json_data()
            }
        })


# 对数据变动的数据进行检查是否唯一
def examine_data_sole(amend_user_data, amend_user_data_errors, user_args_dict):
    for key, value in amend_user_data.items():
        if key == 'portraitImage' or key == 'signatureText':
            continue
        if key == 'username':
            if UserDataModels.objects.filter(username=value).exists():
                amend_user_data_errors.update({key: user_args_dict.get(key)})
        elif key == 'phoneNumber':
            if UserDataModels.objects.filter(phoneNumber=value).exists():
                amend_user_data_errors.update({key: user_args_dict.get(key)})
        elif key == 'useremail':
            if UserDataModels.objects.filter(useremail=value).exists():
                amend_user_data_errors.update({key: user_args_dict.get(key)})


# 用户数据变化修改api
def user_data_modification_examine(request):
    pk = request.POST.get('pk', None)
    # 数据变化的数据
    amend_user_data = {}
    # 数据处理异常
    amend_user_data_errors = {}
    # 数码异常关联
    user_args_dict = {'username': '用户已存在', 'phoneNumber': '该手机号码不可用', 'useremail': '该邮箱已存在'}
    # 获得当前用户下的usernamw, phonenumber, useremail, userpassword 的数据
    user_data = UserDataModels.objects.filter(pk=pk).values('username', 'phoneNumber', 'useremail',
                                                            'userPassword').first()
    datas = forms.user_datae_the_first_time_check(request.POST, request.FILES)
    if datas.is_valid():
        user_data_change = False
        # 判断数据是否改动
        for key, value in datas.cleaned_data.items():
            if key == 'portraitImage' or key == 'signatureText':
                continue
            if user_data.get(key) != value:
                user_data_change = True
                break
        # 图片 或 签名 发生变化
        if request.POST.get('image_file_change') == 'true' or request.POST.get('signatureText_change') == 'true':
            user_data_change = True

        if user_data_change:
            # 数据有变化
            # 选出数据发生变化的数据 -> username useremail userPassword phonenumber
            for key, value in datas.cleaned_data.items():
                if key == 'signatureText' or key == 'portraitImage':
                    continue
                if value != user_data.get(key):
                    amend_user_data.update({key: value})

            if request.POST.get('signatureText_change') == 'true':
                amend_user_data.update({'signatureText': datas.cleaned_data.get('signatureText')})

            if request.POST.get('image_file_change') == 'true':
                amend_user_data.update({'portraitImage': datas.cleaned_data.get('portraitImage')})

            # 对数据变动的数据进行检查是否唯一
            examine_data_sole(amend_user_data, amend_user_data_errors, user_args_dict)

            # 数据异常返回异常
            if amend_user_data_errors:
                return JsonResponse({
                    'code': 400,
                    'datas': amend_user_data_errors
                })

            # 处理变化的数据
            for key, value in amend_user_data.items():
                if key == 'username':
                    UserDataModels.objects.filter(pk=pk).update(username=value)
                elif key == 'phoneNumber':
                    UserDataModels.objects.filter(pk=pk).update(phoneNumber=value)
                elif key == 'useremail':
                    UserDataModels.objects.filter(pk=pk).update(useremail=value)
                elif key == 'userPassword':
                    UserDataModels.objects.filter(pk=pk).update(userPassword=value)
                elif key == 'signatureText':
                    UserDataModelsContext.objects.filter(UserObject__pk=pk).update(
                        signatureText=datas.cleaned_data.get('signatureText'))
                elif key == 'portraitImage':
                    user_image = UserDataModelsContext.objects.filter(UserObject__pk=pk).first()
                    # user_image.portraitImage.delete()
                    user_image.portraitImage = datas.cleaned_data.get('portraitImage')
                    user_image.save()

            return JsonResponse({
                'code': 200,
                'datas': 'modify_successfully'  # 修改成功
            })
        else:
            # 数据无变化
            return JsonResponse({
                'code': 200,
                'datas': "data_uniformity"  # 数据无变化
            })
    else:
        # 处理错误的数据
        for key, value in datas.errors.get_json_data().items():
            amend_user_data_errors.update({key: value[0].get('message')})

        user_data_change = False
        # 判断数据是否改动
        for key, value in datas.cleaned_data.items():
            if user_data.get(key) != value:
                user_data_change = True
                break

        if user_data_change:
            # 数据有变化
            # 选出数据发生变化的数据
            for key, value in datas.cleaned_data.items():
                if value != user_data.get(key):
                    amend_user_data.update({key: value})

        # 对数据变动的数据进行检查是否唯一
        examine_data_sole(amend_user_data, amend_user_data_errors, user_args_dict)

        # 数据异常返回异常
        return JsonResponse({
            'code': 400,
            'datas': amend_user_data_errors
        })


# 管理员开启商店或关闭商店
def admin_open_or_close_shop(request):
    # 获取用户序号
    userPk = request.POST.get('userPk', None)
    if not userPk:
        return JsonResponse({
            'code': 400,
            'datas': '错误'
        })
    user_data = UserDataModels.objects.filter(pk=userPk)
    if not user_data.exists():
        return JsonResponse({
            'code': 400,
            'datas': '用户不存在'
        })
    print(user_data)
    if user_data.first().shop == 1:
        # 关闭商店
        user_data.update(shop=0)
        return JsonResponse({
            'code': 200,
            'datas': {
                'shop_status': 0
            }
        })
    else:
        # 开启商店
        user_data.update(shop=1)
        return JsonResponse({
            'code': 200,
            'datas': {
                'shop_status': 1
            }
        })


def Display_all_items(request):
    # 获取所有商品
    all_shop = UserShop.objects.all().values('shopName', 'shopPrice', 'shopQuantity', 'monthlySales', 'salesQuantity')
    return render(request, 'backstage_index/Display_all_items.html', context={'page': 2, 'allShop': all_shop})
