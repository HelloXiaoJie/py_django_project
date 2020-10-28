from django.urls import path
from . import views

app_name = 'user'

urlpatterns = [
    path('user/', views.User_data, name='UserLogin'),
    path('user/register/', views.User_register_data, ),  # 用户注册
    path('user/login/', views.User_login_data, ),  # 用户登录
    path('user/quit/', views.quit_User, name='UserQuit'),  # 用户退出
    path('user/personageCentre/', views.personageCentre, name='personageCentre'),  # 个人中心
    path('user/accountInformation/', views.personageCentre, name='accountInformation'),  # 账号信息
    path('user/emailModification/', views.emailModification, ),  # 修改邮箱
    path('user/newEmail/', views.newEmailModification, ),  # 添加邮箱
    path('user/phonenumberModification/', views.phoneNumberModification, ),  # 修改手机号码
    path('user/passwordModification/', views.passwordModification, ),  # 修改密码
    path('user/myInformation/', views.myInformation, name='myInformation'),  # 我的信息页面
    path('user/modificationUserNameContent/', views.modification_userName, ),  # 修改昵称 和 签名
    path('user/myProfile/', views.myProfile, name="myProfile"),  # 我的头像页面
    path('user/UserPortrait/', views.UserPortrait, )  # 用户头衔
]
