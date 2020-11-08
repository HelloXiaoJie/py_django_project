from django.shortcuts import render, redirect, reverse
from django.http import HttpResponse, JsonResponse
from UserData.models import UserDataModels, UserDataModelsContext
from django.template.context_processors import csrf
from . import forms


# 后台页面 首页
def backstage_page(request):
    return render(request, 'backstage_index/backstage_index.html')


# 后台页面 用户数据
def backstage_page_user_data(request):
    # 用户数据
    userdatas = UserDataModels.objects.all()
    return render(request, 'backstage_index/backstage_UserData.html', context={'userdata': userdatas})


# 点击用户数据后返回数据
def User_data_api(request, user_pk):
    user_data = UserDataModels.objects.filter(pk=user_pk).first()
    user_data_content = UserDataModelsContext.objects.filter(UserObject=user_data).first()
    return render(request, 'backstage_index/backstage_user_data_api.html',
                  context={'data': user_data, 'data_content': user_data_content})


def Delete_user_data_api(request):
    delete_datas_list = dict(request.POST).get('data_list[]', None)
    print(delete_datas_list)
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
    return render(request, 'backstage_index/backstage_add_user.html', context=csrf(request))


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

# 用户数据变化修改api
def user_data_modification_examine(request):
    datas = forms.app_user_data_form_api(request.POST, request.FILES)
    if datas.is_valid():
        pass
    else:
        pass