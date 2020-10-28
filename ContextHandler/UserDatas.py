def UserContent(request):
    content = {
        "user_datas": request.user_datas.get('userdatas', None),
        "user_content": request.user_datas.get('usercontext', None)
    }
    return content
