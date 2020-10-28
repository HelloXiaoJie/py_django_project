from UserData import models


# 用户不存在
def userInexistence(a, b, c=None):
    '''
    :param a:  request
    :param b: views_request
    :param c: user_data
    :return: views_request(request)
    '''
    if c:
        a.user_datas = {
            'userdatas': c.values('username', 'phoneNumber', 'useremail', 'userPassword')[0],
            'usercontext': c.values('userdatamodelscontext__signatureText', 'userdatamodelscontext__portraitImage')[0]
        }
    else:
        a.user_datas = {
            'userdatas': None,
            'usercontext': None
        }
    return b(a)


class LoginMiddleware(object):
    def __init__(self, views_request):
        self.views_request = views_request

    def __call__(self, request, *args, **kwargs):
        session = request.session.get('phoneNumber')
        # 存在session
        if session:
            # 判断session的值是否存在
            try:
                user = models.UserDataModels.objects.filter(phoneNumber=session)  # user数据
            except Exception:
                # 用户不存在
                user = models.UserDataModels.objects.none()  # None
            return userInexistence(request, self.views_request, user)
        else:
            return userInexistence(request, self.views_request)
