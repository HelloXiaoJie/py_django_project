def UserContent(request):
    content = {
        "user_datas": request.user_datas,
    }
    return content