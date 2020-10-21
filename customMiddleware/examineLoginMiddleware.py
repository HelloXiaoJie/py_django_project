from UserData import models


# 用户不存在
def userInexistence(a, b, c=None):
    '''
    :param a:  request
    :param b: views_request
    :param c: user_data
    :return: views_request(request)
    '''
    # if c:
    #     a.user_datas = c
    #     return b(a)
    # else:
    #     a.user_datas = c
    #     return b(a)
    a.user_datas = c
    return b(a)


class LoginMiddleware(object):
    def __init__(self, views_request):
        self.views_request = views_request

    def __call__(self, request, *args, **kwargs):
        session = request.session.get('UserName')
        # 存在session
        if session:
            # 判断session的值是否存在
            try:
                user = models.UserDataModels.objects.get(username=session)  # user数据
            except Exception as errors:
                # 用户不存在
                user = models.UserDataModels.objects.none()  # None
            return userInexistence(request, self.views_request, user)
        else:
            return userInexistence(request, self.views_request)
