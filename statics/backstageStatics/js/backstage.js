$(function () {
    //backstageUserData 页面js
    function BackstageUserData() {
    }

    // 给确认删除提示提供数据
    BackstageUserData.prototype.Add_data_prompt = function (list_data) {
        // list_data -> [1,2,3,4]
        // 找到delete_class_data下的ul标签，获取数据
        let delete_class_data = $('.delete_class_data > ul');
        list_data.forEach(function (pk) {
            let data = $(".data[data-userPk=" + pk + "] div");
            let name = data[0].innerHTML;
            let phone = data[1].innerHTML;
            let li = $('<li>username:<div class="username">' + name + '</div>phone:<div class="userphone">' + phone + '</div></li>')
            // 将渲染好的数据插到html中
            delete_class_data.append(li)
        })
    };

    // 清除user_pk_data列表哦中的数据
    function clean_user_pk_list(data_list) {
        var number = data_list.length;
        for (i = 0; i < number; i++) {
            data_list.pop()
        }
    }

    // 数据操作方法
    BackstageUserData.prototype.data_operation = function (self) {
        // 存储选中user数据
        const user_pk_data = [];
        // 删除用户数据的背景
        let delete_background = $('.delete_background');
        // 删除确认
        let delete_affirm = $('.delete_affirm');
        // 获取所选的参数
        var execute_data = $('.data_select_operation select');
        $('.location_frame .execute').click(function () {
            // 判断所选参数
            switch (execute_data.val()) {
                case "0":
                    $('.delete_user_user_text').text('条目必须选中以对其进行操作').show();
                    return;
                case "1":
                    // 获取选中的数据
                    let select_data = $('.data input');
                    // 将删除的数据添加到data_list
                    select_data.each(function () {
                        if ($(this).prop("checked")) {
                            // 将删除的数据添加到data_list
                            user_pk_data.push($(this).val())
                        }
                    });
                    // 判断是否选中数据
                    if (!user_pk_data.length) {
                        // 空
                        $('.delete_user_user_text').text('条目必须选中以对其进行操作').show();
                        return
                    } else {
                        $('.delete_user_user_text').text('').hide();
                    }
                    // 背景显示
                    delete_background.show();
                    // 删除确认显示
                    delete_affirm.show();
                    // 处理数据
                    self.Add_data_prompt(user_pk_data);
                    // 删除数据
                    $('.delete').click(function () {
                        self.delete_selected_data(user_pk_data);
                        $('.delete_class_data > ul').empty();
                        delete_background.hide();
                        delete_affirm.hide();
                    });
                    // 取消删除数据
                    $('.no_delete').click(function () {
                        // 删除delete_class_data中的数据
                        clean_user_pk_list(user_pk_data);
                        $('.delete_class_data > ul').empty();
                        // 隐藏样式
                        delete_background.hide();
                        delete_affirm.hide();
                    });
            }
        })
    };

    // 执行 删除所选的数据
    BackstageUserData.prototype.delete_selected_data = function (data_list) {
        // 将删除的数据使用ajax发送到后台进行处理
        $.post('http://127.0.0.1:8000/backstageUserData/deleteUser/', {
            data_list,
            'csrfmiddlewaretoken': $('input[name="csrfmiddlewaretoken"]').val()
        }, function (datas, status) {
            if (status === 'success') {
                if (datas.code === 200) {
                    // 删除成功
                    // 删除元素
                    data_list.forEach(function (userPk) {
                        $(".show_data li[data-userPk=" + userPk + "]").remove();
                    });
                    // 删除相应的数据
                    clean_user_pk_list(data_list)
                } else if (datas.code === 201) {
                    $('.delete_user_user_text').text(datas.datas.errors).show()
                }
            }
        });
    };

    // 鼠标点击 添加用户个人资料 add_user_page页面显示
    BackstageUserData.prototype.show_add_user_content_page = function () {
        let user_add_border = $('.user_add_border');
        let add_user_page = $('.add_user_page');
        let show_page_state = false;
        $('.personal_data').click(function () {
            if (!show_page_state) {
                show_page_state = !show_page_state;
                add_user_page.attr({'data-save': '1'});
                user_add_border.removeClass('user_add_border_hide');
                user_add_border.addClass('user_add_border_show');
            } else {
                show_page_state = !show_page_state;
                add_user_page.attr({'data-save': '0'});
                user_add_border.removeClass('user_add_border_show');
                user_add_border.addClass('user_add_border_hide');
            }
        });

        // 取消添加按钮
        $('.cancel_add_user_data').click(function () {
            if (show_page_state) {
                // 隐藏
                show_page_state = !show_page_state;
                add_user_page.attr({'data-save': '0'});
                user_add_border.removeClass('user_add_border_show');
                user_add_border.addClass('user_add_border_hide');
            }
        })
    };

    // 使用post方法提交数据
    BackstageUserData.prototype.post_add_user_data = function (self) {
        $('.save_submit').click(function () {
            let save_data = $(this).attr('data-submit');
            // console.log(this);
            // console.log($(this).attr('data-submit'));
            let username = $('.modification_data input[name="username"]');
            let phoneNumber = $('.modification_data input[name="phoneNumber"]');
            let useremail = $('.modification_data input[name="useremail"]');
            let userPassword = $('.modification_data input[name="userPassword"]');
            let idiograph = $('.idiograph textarea');
            // 头像文件
            // let personal_icon_image = $('.personal_icon_image input[name="user_image"]');
            let csrf_token = $('input[name="csrfmiddlewaretoken"]');
            let user_datas = new FormData();
            if (!Number($('.add_user_page').attr('data-save'))) {
                // 没设置个人数据
                user_datas.append('username', username.val());
                user_datas.append('phoneNumber', phoneNumber.val());
                user_datas.append('useremail', useremail.val());
                user_datas.append('userPassword', userPassword.val());
                user_datas.append('csrfmiddlewaretoken', csrf_token.val());
            } else {
                // 设置个人数据
                user_datas.append('username', username.val());
                user_datas.append('phoneNumber', phoneNumber.val());
                user_datas.append('useremail', useremail.val());
                user_datas.append('userPassword', userPassword.val());
                user_datas.append('idiograph', idiograph.val());
                user_datas.append('personal_icon_image', self.head_portrait_image);
                user_datas.append('csrfmiddlewaretoken', csrf_token.val());
            }
            $.ajax({
                url: 'http://127.0.0.1:8000/backstageUserData/adduserApi/',
                type: 'post',
                data: user_datas,
                processData: false,
                contentType: false,
                dataType: 'json',
                // async: false,//要求为Boolean类型的参数，默认设置为true，所有请求均为异步请求。如果需要发送同步请求，请将
                // // 此选项设置为false。注意，同步请求将锁住浏览器，用户其他操作必须等待请求完成才可以执行。
                // cache: false,//要求为Boolean类型的参数，默认为true（当dataType为script时，默认为false），设置为false将不
                // // 会从浏览器缓存中加载请求信息。
                error: function (datas) {
                    console.log(datas);
                },
                success: function (datas) {
                    if (datas.code === 200) {
                        alert('添加成功');
                        if (Number(save_data)) {
                            location.replace('/backstageUserData/')
                        } else {
                            location.reload()
                        }
                    } else if (datas.code === 400) {
                        // console.log(datas.datas.errors);
                        if (datas.datas.errors.username) {
                            self.error_datas_style(username, datas.datas.errors.username[0].message)
                        }
                        if (datas.datas.errors.phoneNumber) {
                            self.error_datas_style(phoneNumber, datas.datas.errors.phoneNumber[0].message)
                        }
                        if (datas.datas.errors.useremail) {
                            self.error_datas_style(useremail, datas.datas.errors.useremail[0].message)
                        }
                        if (datas.datas.errors.userPassword) {
                            self.error_datas_style(userPassword, datas.datas.errors.userPassword[0].message)
                        }
                    }
                }
            })
        })
    };
    // 给有错误的数据添加样式
    BackstageUserData.prototype.error_datas_style = function (error_Object, error_text) {
        error_Object.parent().siblings().filter('.errors_text').text(error_text).css({'display': "inline-block"});
        error_Object.click(function () {
            error_Object.parent().siblings().filter('.errors_text').text('').hide();
        })
    };
    // 头像设置显示
    BackstageUserData.prototype.head_portrait_set = function (self) {
        $('.personal_icon_image input[name="user_image"]').bind('change', function () {
            if (!this.files[0]) {
                return
            }
            if (!(this.files[0].type === 'image/png' || this.files[0].type === 'image/jpeg')) {
                self.head_portrait_file_error('文件类型错误');
                return;
            }
            if (this.files[0].size > 2097152) {
                self.head_portrait_file_error('图片大于2M');
                return;
            }
            self.head_portrait_image = this.files[0];
            $('.personal_icon_image img').attr({'src': URL.createObjectURL(this.files[0])})
        })
    };
    // 头像设置/backstageUserData/user_pk页面
    BackstageUserData.prototype.head_portrait_set_1 = function (self) {
        $('.user_personage_data_portraitImage input[name="file_image"]').bind('change', function () {
            if (!this.files[0]) {
                return
            }
            if (!(this.files[0].type === 'image/png' || this.files[0].type === 'image/jpeg')) {
                self.head_portrait_file_error_1('文件类型错误');
                return;
            }
            if (this.files[0].size > 2097152) {
                self.head_portrait_file_error_1('图片大于2M');
                return;
            }
            self.head_portrait_image = this.files[0];
            self.image_file_change = true;
            $('.user_data_image img').attr({'src': URL.createObjectURL(this.files[0])})
        })
    };
    // 检查用户签名是否改变
    BackstageUserData.prototype.change_user_idiograph = function (self) {
        $('.user_personage_data_signatureText textarea').bind('change', function () {
            self.signatureText_change = true;
            self.user_signatureText_content = $(this).val();
        })
    };
    // 头像变量
    BackstageUserData.prototype.head_portrait_image = null;
    // 图片文件是否改变
    BackstageUserData.prototype.image_file_change = false;
    // 用户签名是否改变
    BackstageUserData.prototype.signatureText_change = false;
    // 用户签名内容
    BackstageUserData.prototype.user_signatureText_content = null;
    //处理头像文件错误
    BackstageUserData.prototype.head_portrait_file_error = function (error_text) {
        $('.image_file_error').text(error_text).css({'display': 'inline-block'})
    };

    BackstageUserData.prototype.head_portrait_file_error_1 = function (error_text) {
        $('.file_image_error').text(error_text).css({'display': 'inline-block'})
    };
    // 点击头像文件错误提示消失
    BackstageUserData.prototype.head_portrait_hide = function () {
        $('.personal_icon_image input[name="user_image"]').click(function () {
            $('.image_file_error').text('').css({'display': 'none'})
        })
    };
    BackstageUserData.prototype.head_portrait_hide_1 = function () {
        $('.user_personage_data_portraitImage input[name="file_image"]').click(function () {
            $('.file_image_error').text('').css({'display': 'none'})
        })
    };
    // 修改用户数据
    BackstageUserData.prototype.user_data_modification = function (self) {
        $('.save_data').click(function () {
            let pk = $('input[name="user_pk"]');
            let username = $('.modification_data input[name="username"]');
            let phoneNumber = $('.modification_data input[name="phoneNumber"]');
            let useremail = $('.modification_data input[name="useremail"]');
            let userPassword = $('.modification_data input[name="userPassword"]');
            // let idiograph = $('.user_personage_data_signatureText textarea');
            let csrf_token = $('input[name="csrfmiddlewaretoken"]');
            let datas = new FormData();
            datas.append('pk', pk.val());
            datas.append('username', username.val());
            datas.append('phoneNumber', phoneNumber.val());
            datas.append('useremail', useremail.val());
            datas.append('userPassword', userPassword.val());
            // datas.append('signatureText', idiograph.val());
            datas.append('csrfmiddlewaretoken', csrf_token.val());
            datas.append('portraitImage', self.head_portrait_image);
            datas.append('signatureText', self.user_signatureText_content);
            datas.append('image_file_change', self.image_file_change);
            datas.append('signatureText_change', self.signatureText_change);
            // console.log(self.user_signatureText_content);
            $.ajax({
                url: 'http://127.0.0.1:8000/backstageUserData/modificationuserApi/',
                type: 'POST',
                processData: false,
                contentType: false,
                dataType: 'json',
                data: datas,
                success: function (datas) {
                    self.image_file_change = false;
                    self.signatureText_change = false;
                    if (datas.code === 200 && datas.datas === 'data_uniformity') {
                        location.replace('/backstageUserData/')
                    } else if (datas.code === 200 && datas.datas === 'modify_successfully') {
                        alert('修改成功');
                    } else if (datas.code === 400) {
                        console.log(datas.datas);
                        if (datas.datas['username']) {
                            self.user_data_update_error_show($('.data_error_style_username'), datas.datas['username'])
                        }
                        if (datas.datas['phoneNumber']) {
                            self.user_data_update_error_show($('.data_error_style_phoneNumber'), datas.datas['phoneNumber'])
                        }
                        if (datas.datas['userPassword']) {
                            self.user_data_update_error_show($('.data_error_style_userPassword'), datas.datas['userPassword'])
                        }
                        if (datas.datas['useremail']) {
                            self.user_data_update_error_show($('.data_error_style_useremail'), datas.datas['useremail'])
                        }
                    }
                }
            })
        })
    };

    // 用户数据更新错误提示
    BackstageUserData.prototype.user_data_update_error_show = function (error_object, error_text) {
        error_object.text(error_text);
        error_object.css({'display': 'inline-block'});

        $(error_object.siblings()[1]).children().click(function () {
            error_object.text('').hide()
        })
    };

    // 删除
    BackstageUserData.prototype.delete_user_data = function (self) {
        $('.delete_data').click(function () {
            // 获取用户id
            // let user_pk = $('input[name="user_pk"]').val();
            let data_list = [];
            data_list.push($('input[name="user_pk"]').val());
            $('.delete_background').show();
            $('.delete_affirm').show();
            let delete_class_data = $('.delete_class_data > ul');
            let name = $('input[name="username"]').val();
            let phone = $('input[name="phoneNumber"]').val();
            let li = $('<li>username:<div class="username">' + name + '</div>phone:<div class="userphone">' + phone + '</div></li>')
            delete_class_data.append(li);
            $('.delete').click(function () {
                $.post('http://127.0.0.1:8000/backstageUserData/deleteUser/',
                    {
                        data_list,
                        'csrfmiddlewaretoken': $('input[name="csrfmiddlewaretoken"]').val()
                    },
                    function (datas, status) {
                        if (status === 'success') {
                            console.log(datas);
                            if (datas.code === 200) {
                                location.replace('/backstageUserData/')
                            }
                        }
                    })
            });
            $('.no_delete').click(function () {
                $('.delete_class_data > ul').empty();
                // 隐藏样式
                $('.delete_background').hide();
                $('.delete_affirm').hide();
            });
        })
    };
    // 点击开启或关闭商店
    BackstageUserData.prototype.click_open_or_close = function () {
        $('.custom_button').click(function () {
            // 用户序号
            let userPk = $('input[name="user_pk"]').val();
            let csrfmiddlewaretoken = $('input[name="csrfmiddlewaretoken"]').val();
            $.post('/backstageUserData/AdminShop/', {
                'userPk': userPk,
                'csrfmiddlewaretoken': csrfmiddlewaretoken,
            }, function (datas, status) {
                if (status === 'success') {
                    if (datas.code === 200) {
                        if (datas.datas.shop_status === 1) {
                            // 需要开启商店
                            $('.the_switch_square').css({'left': '0px'})
                        } else if (datas.datas.shop_status === 0) {
                            // 关闭商店
                            $('.the_switch_square').css({'left': '-74px'})
                        }
                    } else if (datas.code === 400) {

                    }
                }
            })
        })
    };
    BackstageUserData.prototype.run = function () {
        let self = this;
        self.data_operation(self);
        self.show_add_user_content_page();
        self.post_add_user_data(self);
        self.head_portrait_set(self);
        self.head_portrait_hide();
        self.head_portrait_hide_1();
        self.head_portrait_set_1(self);
        self.user_data_modification(self);
        self.change_user_idiograph(self);
        self.delete_user_data(self);
        self.click_open_or_close()
    };
    const backstageUserData_Method = new BackstageUserData();
    backstageUserData_Method.run()
});

