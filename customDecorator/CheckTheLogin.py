from django.shortcuts import redirect, reverse


def examineLogin(func):
    def decorator(request, *args, **kwargs):
        userData = request.user_datas.get('userdatas')
        # 无user数据,没登录
        if not userData:
            return redirect(reverse('user:UserLogin'))
        else:
            return func(request, *args, **kwargs)

    return decorator
