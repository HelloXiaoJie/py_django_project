from django.contrib import admin
from django.urls import path
from django.http.response import HttpResponse

def demo(request):
    return HttpResponse("hello django")

urlpatterns = [
    # path('admin/', admin.site.urls),
    path('', demo)
]
