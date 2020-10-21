$(function () {
    function UserData() {
    }

    UserData.prototype.showUserOperation = function () {
        let login = $('.login');
        let loginOperation = $('.loginOperation');
        login.mouseenter(function () {
            loginOperation.show()
        });
        loginOperation.mouseleave(function () {
            loginOperation.hide()
        });
    };

    UserData.prototype.mouseResponse = function () {
        let loginOperationSpanTags = $('.loginOperation span');
        loginOperationSpanTags.each(function () {
            $(this).mouseenter(function () {
                $(this).css({
                    "background-color": "silver"
                })
            });
            $(this).mouseleave(function () {
                $(this).css({
                    "background-color": ""
                })
            })
        })
    };

    // 账号设置选项样式变化
    UserData.prototype.accountStyleChange = function () {
        let InformationStyles = $('.InformationStyle');
        InformationStyles.each(function () {
            // 鼠标移入时
            $(this).mouseenter(function () {
                // 添加样式
                // 改变背景
                $(this).addClass('InformationStyleBackground');
                // 改变图案
                $(this).find('div').removeClass('pitchDotImage').addClass('pitchRightImage');
                // 改变字体颜色
                $(this).find('span').css({
                    'color': 'black'
                })
            });
            // 鼠标移出时
            $(this).mouseleave(function () {
                // 改变背景
                $(this).removeClass('InformationStyleBackground');
                // 改变图案
                $(this).find('div').removeClass('pitchRightImage').addClass('pitchDotImage')
                // 改变字体颜色
                $(this).find('span').css({
                    'color': ''
                })
            })
        })
    };

    // 修改用户信息
    UserData.prototype.showUserModification = function () {
        let showModificationBorderUser = $('.modificationBorder ul li');
        showModificationBorderUser.each(function () {
            // 点击修改数据时 背景板出现 显示
            $($(this).children()[3]).click(function () {
                $('.modificationUserBackground').show();
                $($(this).siblings()[0]).show()
            });
            // console.log($(this).find('.X'));
            $(this).find('.X').click(function () {
                $('.modificationUserBackground').hide();
                $(this).parent().parent().hide()
            })
        })
    };
    // 邮箱修改
    UserData.prototype.emailDatasModification = function (self) {
        let oldEmail = $('.generalFormat input[name="oldEmail"]');
        let newEmail = $('.generalFormat input[name="newEmail"]');
        let csrfmiddlewaretoken = $('input[name="csrfmiddlewaretoken"]');
        $('.Email').click(function () {
            $.post('http://127.0.0.1:8000/user/emailModification/', {
                'oldEmail': oldEmail.val(),
                'newEmail': newEmail.val(),
                'csrfmiddlewaretoken': csrfmiddlewaretoken.val()
            }, function (datas, status) {
                if (status === 'success') {
                    if (datas.code === 200) {
                        // 刷新页面
                        location.reload()
                    } else if (datas.code === 203) {
                        // 邮箱不正确
                        self.errorsInterfaceChanges($('.oldEmail input[name="oldEmail"]'), $('.oldEmailErrortext'), datas.datas.errors)
                    } else if (datas.code === 400) {
                        // 就邮箱错误
                        // console.log(datas.datas.errors.error.oldEmail[0].message);
                        if (datas.datas.errors.error.oldEmail) {
                            // 有错误
                            self.errorsInterfaceChanges($('.oldEmail input[name="oldEmail"]'), $('.oldEmailErrortext'), datas.datas.errors.error.oldEmail[0].message)
                        }
                        if (datas.datas.errors.error.newEmail) {
                            // 有错误
                            self.errorsInterfaceChanges($('.newEmail input[name="newEmail"]'), $('.newEmailErrortext'), datas.datas.errors.error.newEmail[0].message)
                        }
                    }
                }
            })
        });
    };
    // 手机号码修改
    UserData.prototype.phoneNumberModification = function (self) {
        let oldPhoneNumber = $('.generalFormat input[name="oldPhoneNumber"]');
        let newPhoneNumber = $('.generalFormat input[name="newPhoneNumber"]');
        let csrfmiddlewaretoken = $('input[name="csrfmiddlewaretoken"]');
        $('.PhoneNumber').click(function () {
            $.post('http://127.0.0.1:8000/user/phonenumberModification/', {
                'oldPhoneNumber': oldPhoneNumber.val(),
                'newPhoneNumber': newPhoneNumber.val(),
                'csrfmiddlewaretoken': csrfmiddlewaretoken.val()
            }, function (datas, status) {
                if (status === 'success') {
                    if (datas.code === 203) {
                        self.errorsInterfaceChanges($('.generalFormat input[name="oldPhoneNumber"]'), $('.oldPhonenumberErrortext'), datas.datas.errors);
                    } else if (datas.code === 400) {
                        if (datas.datas.errors.error.oldPhoneNumber) {
                            // 有错误
                            self.errorsInterfaceChanges($('.generalFormat input[name="oldPhoneNumber"]'), $('.oldPhonenumberErrortext'), datas.datas.errors.error.oldPhoneNumber[0].message)
                        }
                        if (datas.datas.errors.error.newPhoneNumber) {
                            // 有错误
                            self.errorsInterfaceChanges($('.generalFormat input[name="newPhoneNumber"]'), $('.newPhonenumberErrortext'), datas.datas.errors.error.newPhoneNumber[0].message)
                        }
                    } else {
                        alert('手机号码修改成功');
                        location.reload()
                    }
                }
            });
        });
    };

    // 密码修改
    UserData.prototype.passwordModification = function (self) {
        let oldPassword = $('input[name="oldPassword"]');
        let newPassword1 = $('input[name="newPassword1"]');
        let newPassword2 = $('input[name="newPassword2"]');
        let csrfmiddlewaretoken = $('input[name="csrfmiddlewaretoken"]');
        $('.Password').click(function () {
            $.post('http://127.0.0.1:8000/user/passwordModification/', {
                'oldPassword': oldPassword.val(),
                'newPassword1': newPassword1.val(),
                'newPassword2': newPassword2.val(),
                'csrfmiddlewaretoken': csrfmiddlewaretoken.val()
            }, function (datas, status) {
                if (status === 'success') {
                    if (datas.code === 400) {
                        if (datas.datas.errors.newPassword1) {
                            self.errorsInterfaceChanges($('input[name="newPassword1"]'), $('.PhonenumberErrortext1'), datas.datas.errors.newPassword1[0].message)
                        }
                        if (datas.datas.errors.newPassword2) {
                            self.errorsInterfaceChanges($('input[name="newPassword2"]'), $('.PhonenumberErrortext2'), datas.datas.errors.newPassword2[0].message)
                        }
                        if (datas.datas.errors.oldPassword) {
                            self.errorsInterfaceChanges($('input[name="oldPassword"]'), $('.PasswordErrortext'), datas.datas.errors.oldPassword[0].message)
                        }
                    } else if (datas.code === 201) {
                        function errorsHide() {
                            newPassword1.css({
                                'border': '1px solid #888888'
                            });
                            newPassword2.css({
                                'border': '1px solid #888888'
                            });
                            $('.PhonenumberErrortext1').text('').end().hide();
                            $('.PhonenumberErrortext2').text('').end().hide();
                            newPassword1.unbind('click', errorsHide);
                            newPassword2.unbind('click', errorsHide);
                        }

                        newPassword1.css({
                            'border': '1px solid red'
                        });
                        newPassword2.css({
                            'border': '1px solid red'
                        });
                        $('.PhonenumberErrortext1').show().text(datas.datas.errors);
                        $('.PhonenumberErrortext2').show().text(datas.datas.errors);
                        newPassword1.click(errorsHide);
                        newPassword2.click(errorsHide);
                    } else if (datas.code === 203) {
                        self.errorsInterfaceChanges($('input[name="oldPassword"]'), $('.PasswordErrortext'), datas.datas.errors);
                    } else {
                        alert("密码修改成功");
                        location.reload()
                    }
                }
            });
        })
    };
    // 我的信息修改
    UserData.prototype.modificationInfo = function (self) {
        $('.Info').click(function () {
            // 获取昵称
            let name = $('.nickname input[name="modificationBorder_nickname"]');
            let context = $('.personalizedContext textarea');
            let csrfmiddlewaretoken = $('input[name="csrfmiddlewaretoken"]');
            $.post('http://127.0.0.1:8000/user/changeInformation/', {
                'modificationBorder_nickname': name.val(),
                'personalizedContext': context.val(),
                'csrfmiddlewaretoken': csrfmiddlewaretoken.val()
            }, function (datas, status) {
                if (status === 'success') {
                    if (datas.code === 200) {
                        alert('修改成功');
                        location.reload()
                    } else if (datas.code === 400) {
                        self.errorsInterfaceChanges($('.nickname input[name="modificationBorder_nickname"]'), $('.nameErrorText'), datas.datas.errors.modificationBorder_nickname[0].message)
                    }
                }
            })
        })
    };
    // 修改我的头像
    UserData.prototype.UserPortrait = function () {
        let csrfmiddlewaretoken = $('input[name="csrfmiddlewaretoken"]');
        $('.fileData input').bind('input propertychange', function (event) {
            let image = $('#qwe');
            let images = new FormData(image[0]);
            images.get('image');
            $.ajax({
                url: 'http://127.0.0.1:8000/user/UserPortrait/',
                data: images,
                type: 'POST',
                dataType: 'json',
                async: false,
                cache: false,
                contentType: false,
                processData: false,
                success: function (data) {
                    console.log(data);
                },
                error: function (data) {
                    console.log(data);
                }
            })
        })
    };

    // 错误接口调用
    UserData.prototype.errorsInterfaceChanges = function (inputClass, errorClass, errorText) {
        // 边框变红
        inputClass.css({
            'border': '1px solid red'
        });
        // 显示错误信息
        errorClass.show().text(errorText);
        // 绑定点击消失事件
        inputClass.click(function () {
            inputClass.css({
                'border': '1px solid #888888'
            });
            errorClass.text('').end().hide();
        });
    };
    const userdatamethods = new UserData();
    UserData.prototype.run = function () {
        const self = this;
        self.mouseResponse();
        self.showUserOperation();
        self.accountStyleChange();
        self.showUserModification();
        self.emailDatasModification(self);
        self.phoneNumberModification(self);
        self.passwordModification(self);
        self.modificationInfo(self);
        self.UserPortrait()
    };
    userdatamethods.run()
});