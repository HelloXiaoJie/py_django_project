from django.urls import path
from . import views

urlpatterns = [
    path('backstage/', views.backstage_page, name='backstage'),  # 后台页面
    path('backstageUserData/', views.backstage_page_user_data, name='backstageUserData'),  # 后台页面 用户数据
    path('backstageUserData/user_pk/<int:user_pk>/', views.User_data_api, name='backstageUserData_pk'),  # 用户详情数据
    path('backstageUserData/deleteUser/', views.Delete_user_data_api, ),  # 删除用户api
    path('backstageUserData/adduser/', views.add_user, name="adduser"),  # 添加用户页面
    path('backstageUserData/adduserApi/', views.app_user_api, ),  # 添加用户api
]
