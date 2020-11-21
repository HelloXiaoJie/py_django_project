from django.contrib import admin
from UserData import models

# Register your models here.
@admin.register(models.UserDataModels)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'phoneNumber', 'userPassword', 'useremail')
    fields = ('username', 'phoneNumber', 'userPassword', 'useremail')