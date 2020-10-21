from django import template

register = template.Library()

@register.filter
def emailFilter(a):
    if not a:
        return "请绑定邮箱"
    return a[:4] + "****" + a[a.index('@'):]

@register.filter
def phoneNumber(a):
    return a[:4] + "****" + a[-2:]