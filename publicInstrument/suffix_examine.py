def suffix_check(file_name, suffix_list):
    if file_name.split('.')[-1].lower() in suffix_list:
        return True
    else:
        return False