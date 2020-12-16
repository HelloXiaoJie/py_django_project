$(function () {
    function Overturn() {
    }

    // 登录隐藏, 注册显示
    Overturn.prototype.login = function () {
        // 获取按钮
        let registerPage = $('.registerPage');
        registerPage.click(function () {
            // 给登录视图添加hiod类, 删除注册视图hoid
            $(this).parent().parent().addClass('hoid').siblings().removeClass('hoid');
        })
    };

    // 注册隐藏, 登录显示
    Overturn.prototype.register = function () {
        // 获取按钮
        let loginPage = $('.loginPage');
        loginPage.click(function () {
            $(this).parent().addClass('hoid').siblings().removeClass('hoid');
        })
    };

    // ajax请求注册
    Overturn.prototype.registerAjax = function (self) {
        // 获取提交按钮
        let registerSubmit = $('.registerSubmit');
        // 获取昵称
        let username = $('.nickname input[name="username"]');
        // 获取手机号码
        let phonenumber = $('.phoneNumber input[name="phonenumber"]');
        // 获取密码
        let password1 = $('.password1 input[name="password1"]');
        // 获取确认密码
        let password2 = $('.password2 input[name="password2"]');
        // 获取csrf_token
        let csrf_token = $('input[name="csrfmiddlewaretoken"]');
        // 获取cookie
        registerSubmit.click(function () {
            // 使用ajax请求数据
            $.post('http://' + location.host +'/user/register/', {
                "username": username.val(),
                "phonenumber": phonenumber.val(),
                "password1": password1.val(),
                "password2": password2.val(),
                "csrfmiddlewaretoken": csrf_token.val()
            }, function (datas, status) {
                if (status === "success") {
                    if (datas.code === 200) {
                        alert("注册成功");
                        window.location.reload();
                        console.log(datas);
                    } else {
                        if (datas.datas.errors.username) {
                            self.errorsInterfaceChanges(username, $('.name_error'), datas.datas.errors.username[0].message)
                        }
                        if (datas.datas.errors.phonenumber) {
                            self.errorsInterfaceChanges(phonenumber, $('.phonenumber_error'), datas.datas.errors.phonenumber[0].message)
                        }
                        if (datas.datas.errors.password1) {
                            self.errorsInterfaceChanges(password1, $('.password1_error'), datas.datas.errors.password1[0].message);
                            password2.css({"border": "1px solid red"});
                            password2.click(function () {
                                $(this).css({'border': '1px solid #888888'});
                                $('.password1_error').text('').end().hide();
                            })
                        }
                        if (datas.datas.errors.__all__) {
                            let errorText = $('.errortex');
                            password1.css({"border": "1px solid red"}).click(function () {
                                errorText.text('').hide()
                            });
                            password2.css({"border": "1px solid red"}).click(function () {
                                errorText.text('').hide();
                            });
                            errorText.show().text(datas.datas.errors.__all__[0].message)
                        }
                    }
                }
            })
        });
    };
    // 再次点击密码错误边框，错误样式除去
    Overturn.prototype.removeErrorStyle = function () {
        // 获取密码
        let password1 = $('.password1 input[name="password1"]');
        // 获取确认密码
        let password2 = $('.password2 input[name="password2"]');
        password1.click(function () {
            password1.css({"border": "1px solid #888888"});
            password2.css({"border": "1px solid #888888"});
            $('.errortex').addClass('hoid')
        });
        password2.click(function () {
            password1.css({"border": "1px solid #888888"});
            password2.css({"border": "1px solid #888888"});
            $('.errortex').addClass('hoid')
        })
    };
    // ajax请求登录
    Overturn.prototype.loginAjax = function (self) {
        let loginKey = $('.loginKey');
        loginKey.click(function () {
            let phoneNumber = $('.phoneNumber input[name="loginPhoneNumber"]');
            let password = $('.password input[name="loginPassword"]');
            let csrf_token = $('input[name="csrfmiddlewaretoken"]');
            let voluntarilyLogin = $('.voluntarilyLogin input[name="voluntarilyLogin"]');
            $.post("http://" + location.host + "/user/login/", {
                "phonenumber": phoneNumber.val(),
                "password": password.val(),
                "voluntarilyLogin": voluntarilyLogin[0].checked,
                "csrfmiddlewaretoken": csrf_token.val()
            }, function (datas, status) {
                if (status === "success") {
                    // 204用户不存在
                    if (datas.code === 204) {
                        $('.userNone').removeClass('hoid')
                        // 203 密码错误
                    } else if (datas.code === 203) {
                        $('.password input[name="loginPassword"]').css({
                            'border': '1px solid red'
                        });
                        $('.userPasswordError').removeClass('hoid');
                        $('.voluntarilyLogin input').css({
                            'margin-top': '20px'
                        });
                        // 表单错误
                    } else if (datas.code === 400) {
                        console.log(datas);
                        if (datas.datas.errors.phonenumber) {
                            self.errorsInterfaceChanges(phoneNumber, $('.userNone'), datas.datas.errors.phonenumber[0].message)
                        }
                        if (datas.datas.errors.password) {
                            self.errorsInterfaceChanges(password, $('.userPasswordError'), '')
                        }
                    } else {
                        // 密码正确
                        window.location.href = 'http://127.0.0.1:8000/index/'
                    }
                }
            })
        })
    };
    // 登录错误处理
    Overturn.prototype.longErrorMethod = function () {
        $('.phoneNumber input[name="loginPhoneNumber"]').click(function () {
            $('.userNone').addClass('hoid')
        });
        $('.password input[name="loginPassword"]').click(function () {
            $(this).css({
                "border": "1px solid #888888"
            });
            $('.userPasswordError').addClass('hoid');
            $('.voluntarilyLogin').css({
                "margin-top": "5px"
            })
        })
    };

    // 错误接口调用
    Overturn.prototype.errorsInterfaceChanges = function (inputClass, errorClass, errorText) {
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

    Overturn.prototype.run = function () {
        let self = this;
        self.login();
        self.register();
        self.registerAjax(self);
        self.removeErrorStyle();
        self.loginAjax(self);
        self.longErrorMethod();
    };
    const User = new Overturn();
    User.run()
});