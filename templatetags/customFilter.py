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


@register.filter
def limitationOfLength(a, b):
    '''
    :param a: 当前字体
    :param b: 显示字体数量
    :return:
    '''
    if isinstance(a, int):
        strint = str(a)
        if len(strint) >= b:
            return strint[0:b - 3] + '...'
        else:
            return strint
    else:
        if len(a) >= b:
            return a[0:b - 3] + '...'
        else:
            return a
