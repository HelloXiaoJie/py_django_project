from django.shortcuts import render
from UserData.models import UserDataModels


# 首页
def index(request):
    return render(request, 'index/index.html', )


def index1(request):
    pass
