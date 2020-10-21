from django.shortcuts import render


# 首页
def index(request):
    content = {
        'user_datas': request.user_datas
    }
    return render(request, 'index/index.html', context=content)


def index1(request):
    pass
