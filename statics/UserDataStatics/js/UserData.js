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
            $.post('http://' + location.host + '/user/emailModification/', {
                'oldEmail': oldEmail.val(),
                'newEmail': newEmail.val(),
                'csrfmiddlewaretoken': csrfmiddlewaretoken.val()
            }, function (datas, status) {
                if (status === 'success') {
                    if (datas.code === 200) {
                        // 刷新页面
                        alert("修改成功");
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
    // 新设置邮箱
    UserData.prototype.newEmail = function (self) {
        $('.Email1').click(function () {
            let newEmail1 = $('input[name="newEmail1"]');
            let csrfmiddlewaretoken = $('input[name="csrfmiddlewaretoken"]');
            $.post('http://' + location.host + '/user/newEmail/', {
                'newEmail1': newEmail1.val(),
                'csrfmiddlewaretoken': csrfmiddlewaretoken.val()
            }, function (datas, struct) {
                if (struct === 'success') {
                    if (datas.code === 200) {
                        alert("邮箱添加成功");
                        location.reload()
                    } else if (datas.code === 400) {
                        self.errorsInterfaceChanges(newEmail1, $('.newEmailErrortext1'), datas.datas.errors.newEmail1[0].message)
                    }
                }
            })
        })
    };
    // 手机号码修改
    UserData.prototype.phoneNumberModification = function (self) {
        let oldPhoneNumber = $('.generalFormat input[name="oldPhoneNumber"]');
        let newPhoneNumber = $('.generalFormat input[name="newPhoneNumber"]');
        let csrfmiddlewaretoken = $('input[name="csrfmiddlewaretoken"]');
        $('.PhoneNumber').click(function () {
            $.post('http://' + location.host + '/user/phonenumberModification/', {
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
            $.post('http://' + location.host + '/user/passwordModification/', {
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
    // 修改用户昵称 和 签名
    UserData.prototype.modification_userName = function (self) {
        $('.Info').click(function () {
            // 获取昵称
            let name = $('input[name="modificationBorder_nickname"]');
            let content = $('.personalizedContext textarea');
            let csrfmiddlewaretoken = $('input[name="csrfmiddlewaretoken"]');
            $.post('http://' + location.host + '/user/modificationUserNameContent/', {
                'modificationBorder_nickname': name.val(),
                'personalizedContext': content.val(),
                'csrfmiddlewaretoken': csrfmiddlewaretoken.val()
            }, function (datas, status) {
                if (status === 'success') {
                    console.log(datas);
                    if (datas.code === 200) {
                        // alert('修改成功');
                        location.reload()
                    } else if (datas.code === 400) {
                        console.log(datas);
                        self.errorsInterfaceChanges(name, $('.nameErrorText'), datas.datas.errors.modificationBorder_nickname[0].message)
                    }
                    // 判断name是否有错误
                    if (datas.code.name_code === 200) {
                        // 刷新页面
                        alert('昵称修改成功');
                        location.reload()
                    } else if (datas.code.name_code === 400) {
                        self.errorsInterfaceChanges(name, $('.nameErrorText'), datas.datas.name_erroes.modificationBorder_nickname[0].message)
                    }

                    // 判断签名是否有错误
                    if (datas.code.content_code === 200) {
                        // 在签名框下方提示更改成功
                        $('.textareaContent').text('更改成功').show();
                        setTimeout(function () {
                            $('.textareaContent').text('').hide()
                        }, 2000)
                    } else if (datas.code.content_code === 400) {
                        self.errorsInterfaceChanges(content, $('.textareaContent'), datas.datas.content_error.personalizedContext[0].message)
                    }
                }
            })
        })
    };
    // 修改用户签名
    UserData.prototype.modification_userSignatureText = function () {
        $('.Info').click(function () {
            let content = $('.personalizedContext textarea');
            let csrfmiddlewaretoken = $('input[name="csrfmiddlewaretoken"]');
            $.post('http://' + location.host + '/user/modificationUserSignatureText/', {
                'modificationBorder_nickname': content.val(),
                'csrfmiddlewaretoken': csrfmiddlewaretoken.val()
            }, function (datas, status) {
                if (status === 'success') {
                    console.log(datas);
                }
            })
        })
    };
    // 修改我的头像
    UserData.prototype.UserPortrait = function (self) {
        $('.fileData input').bind('change', function (event) {
            // let image = $('#qwe');
            let images = new FormData();
            images.append('image', $('input[name="image"]')[0].files[0]);
            $.ajax({
                url: 'http://127.0.0.1:8000/user/UserPortrait/',
                data: images,
                type: 'POST',
                dataType: 'json',
                async: false,
                cache: false,
                contentType: false,
                processData: false,
                success: function (datas, status) {
                    if (datas.code === 200) {
                        $('.modificationPortrait > img').attr({'src': datas.datas.reaction});
                        $('.UserProfile > img').attr({'src': datas.datas.reaction});
                    } else if (datas.code === 205) {
                        // 文件类型错误
                        self.errorsInterfaceChanges($('.fileData input'), $('.imageError'), datas.datas.errors)
                    } else if (datas.code === 206) {
                        // 文件大小错误
                        self.errorsInterfaceChanges($('.fileData input'), $('.imageError'), datas.datas.errors)
                    }
                }
            })
        })
    };
    // 开启商店
    UserData.prototype.open_Shop = function () {
        $('.Open_the_shop').click(function () {
            let content = prompt('请输入用户名开启商店');
            if (content === null) {
                return
            } else if (content === $('input[name="shop_name"]').val()) {
                // console.log('ok');
                // location.replace('/user/myShop/')
            } else {
                return
            }
            $.post('http://' + location.host + '/user/addShopJurisdiction/', {
                'openShop': 1,
                'csrfmiddlewaretoken': $('input[name="csrfmiddlewaretoken"]').val()
            }, function (datas, status) {
                if (status === 'success') {
                    if (datas.code === 200) {
                        location.replace('/user/myShop/')
                    } else if (datas.code === 400) {
                        console.log('错误');
                    }
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
    // 监控input_file 是否有图片
    UserData.prototype.monitoring_image = function (self) {
        $('.button_style input[name="button_style_image"]').bind('change', function () {
            if (!self.change_image(this.files[0], self)) {
                return
            } else {
                $('.image_show').css({'display': 'inline-block'});
                $('.image_show > img').attr({'src': URL.createObjectURL(this.files[0])})
            }
        })
    };
    // 图片变量
    UserData.prototype.image_file = null;
    // 检查图片是否符合要求
    UserData.prototype.change_image = function (files, self) {
        if (!files) {
            // console.log('无文件');
            return false
        }
        if (!(files.type === 'image/png' || files.type === 'image/jpeg')) {
            self.head_portrait_image_error('文件类型错误');
            // console.log('文件类型错误');
            return false
        }
        if (files.size > 2097152) {
            self.head_portrait_image_error('图片大于2M');
            // console.log('图片大于2M');
            return false
        }
        self.image_file = files;
        $('.shop_image_style span').text('').css({'display': 'none'});
        return true
        // $('.personal_icon_image img').attr({'src': URL.createObjectURL(this.files[0])})
    };
    // 处理图片错误
    UserData.prototype.head_portrait_image_error = function (error) {
        // $('.shop_image_style span').text(error).css({'display': 'inline'})
        let shop_image_style = $('.shop_image_style');
        let error_span = $('<span style="color:#e1251b;position: absolute;left: 420px;display: inline-block">' + error + '</span>');
        shop_image_style.append(error_span);
        shop_image_style.find('span').click(function () {
            $(this).remove()
        })
    };
    // 检查发送的数据是否合格
    // fields_data -> 检查的字段
    // errors_content -> 错误信息
    // send -> 是否可发送
    UserData.prototype.examine_send_datas = function (fields_data, errors_content, send) {
        if (fields_data.val() === '') {
            send['TXD'] = false;
            // 判断是否已经有错误显示
            if (fields_data.siblings().length !== 0) {
                return
            }
            let error_span = $('<span style="color:#e1251b;margin-left: 20px">' + errors_content + '</span>');
            fields_data.after(error_span);
            // 点击input或错误信息 错误信息隐藏
            fields_data.click(function () {
                if (fields_data.siblings().length === 0) {
                    return
                }
                $(fields_data.siblings()[0]).click(function () {
                    $(this).remove()
                });
                $(fields_data.siblings()[0]).remove()
            });
        }
    };
    // 检查发送的图片是否合格
    UserData.prototype.examine_send_images = function (image_data, send) {
        if (image_data === null) {
            send['TXD'] = false;
            let shop_image_style = $('.shop_image_style');
            if (shop_image_style.find('span').length !== 0) {
                return
            }
            let error_span = $('<span style="color:#e1251b;position: absolute;left: 420px;display: inline-block">商品图片不能为空</span>');
            shop_image_style.append(error_span);
            shop_image_style.find('span').click(function () {
                $(this).remove()
            })
        }
    };
    // 显示返回数据错误
    UserData.prototype.show_error_datas = function (shop_object_object, error) {
        shop_object_object.parent().find('span').remove();
        let error_html = $('<span style="color: #e1251b;margin-left: 20px">' + error + '</span>');
        shop_object_object.after(error_html)
    };

    // 发送添加商品
    UserData.prototype.send_shop_data = function (self) {
        $('.submit_style').click(function () {
            // 是否可以发送数据
            let TXD = {TXD: true};
            // 检查商品名称是否为空
            let shop_name = $('input[name="shopName"]');
            let shop_shopPrice = $('input[name="shopPrice"]');
            let shop_quantity = $('input[name="shopQuantity"]');
            self.examine_send_datas(shop_name, '这个字段是必填项', TXD);
            self.examine_send_datas(shop_shopPrice, '这个字段是必填项', TXD);
            self.examine_send_datas(shop_quantity, '这个字段是必填项', TXD);
            let shop_image = self.image_file;
            self.examine_send_images(self.image_file, TXD);
            let shop_datas = new FormData();
            shop_datas.append('shopName', shop_name.val());
            shop_datas.append('shopPrice', Number(shop_shopPrice.val()));
            shop_datas.append('shopQuantity', Number(shop_quantity.val()));
            shop_datas.append('shopImage', shop_image);
            shop_datas.append('csrfmiddlewaretoken', $('input[name="csrfmiddlewaretoken"]').val());
            if (!TXD['TXD']) {
                return
            }
            $.ajax({
                url: 'http://' + location.host + '/user/addShopApi/',
                type: 'post',
                contentType: false,
                data: shop_datas,
                dataType: 'json',
                processData: false,
                success: function (datas) {
                    if (datas.code === 200) {
                        alert('添加成功');
                        location.replace('/user/myShop/');
                        return
                    }
                    if (datas.datas['shopName']) {
                        self.show_error_datas($('input[name="shopName"]'), datas.datas['shopName'][0]['message'])
                    }
                    if (datas.datas['shopPrice']) {
                        self.show_error_datas($('input[name="shopPrice"]'), datas.datas['shopPrice'][0]['message'])
                    }
                    if (datas.datas['shopQuantity']) {
                        self.show_error_datas($('input[name="shopQuantity"]'), datas.datas['shopQuantity'][0]['message'])
                    }
                    if (datas.datas['shopImage']) {
                        // 创建span标签
                        let span_error = $('<span style="color:#e1251b;position: absolute;left: 420px;display: inline-block">' + datas.datas['shopImage'][0].message + '</span>');
                        $('.shop_image_style').append(span_error);
                        span_error.click(function () {
                            $(this).remove()
                        })
                    }
                }
            })
        })
    };
    // 错误点击input隐藏错误提示
    UserData.prototype.shop_error_hide = function () {
        $('.shop_general_style').each(function () {
            $(this).click(function () {
                $(this).find('span').remove()
            });
        })
    };
    // 删除商品列表
    UserData.prototype.delete_shop_list = [];
    // 删除按钮是否可用
    UserData.prototype.delete_submit = 0;
    // 监控delete_shop_list变化，改变删除按钮的样式
    UserData.prototype.control_delete_shop_list = function (self) {
        if (self.delete_shop_list.length === 0) {
            let Delete_the_goods = $('.Delete_the_goods');
            Delete_the_goods.removeClass('Delete_the_goods_cursor');
            Delete_the_goods.css({'cursor': 'not-allowed', 'background-color': '#9e9e9e'});
            self.delete_submit = 0;
        } else {
            let Delete_the_goods = $('.Delete_the_goods');
            Delete_the_goods.addClass('Delete_the_goods_cursor');
            Delete_the_goods.css({'cursor': 'pointer', 'background-color': '#e1251b'});
            self.delete_submit = 1;
        }
    };
    // 监控Delete_the_goods按钮
    UserData.prototype.monitor_delete_submit = function (self) {
        $('.Delete_the_goods').click(function () {
            if (self.delete_submit) {
                self.Generic_delete_to_confirm(self.delete_shop_list, '请确定要删除选中的商品', '删除商品', 'shop_delete', 'shop_no_delete', delete_shop_function, delete_shop_message_function, self)
            } else {
                return
            }
        })
    };

    // 删除商品函数
    function delete_shop_function(self) {
        let delete_data_list = JSON.stringify(self.delete_shop_list);
        $.post('http://' + location.host + '/user/deleteShop/', {
            'csrfmiddlewaretoken': $('input[name="csrfmiddlewaretoken"]').val(),
            delete_data_list,
        }, function (datas, status) {
            if (status === 'success') {
                console.log(datas);
            }
        })
    }

    // 除去删除商品信息
    function delete_shop_message_function(self) {
        // 找到所有删除的信息
        self.delete_shop_list.forEach(function (data) {
            $('.shop_introduce[data-shopPk="' + data + '"]').remove()
        });
        // 修改全部商品数量
        let num = $('.all_the_goods span');
        num.text(Number(num.text()) - self.delete_shop_list.length)
    }

    // 删除数据 显示待删除的数据 确认删除
    // delete_data_list_ul -> 删除的list数据
    // title_content -> 标题内容
    // delete_content -> 删除内容
    // affirm_delete -> 确认删除class
    // undelete -> 取消删除class
    // func -> 发送删除信息
    // delete_shop_style_bojject -> 删除商品信息样式
    UserData.prototype.Generic_delete_to_confirm = function (delete_data_list_ul, title_content, delete_content, affirm_delete, undelete, func, delete_shop_style_bojject, self) {
        // 找到body元素
        let body = $('body');
        // 创建背景板
        let background_board = $('<div class="background_plate" style="background-color:rgba(0,0,0,.5);width:100%;height:100%;position: absolute;top: 0px;left: 0px;z-index: 100;"></div>');
        // 删除数据信息表
        let delete_data_information_sheet = $('' +
            '<div style="display:block;width:800px;border-radius:5px;z-index:999;background-color:#f4f4f4;position:absolute;top:180px;left:500px;">' +
            '<div style="display:block;font-size:30px;margin-left:auto;margin-right:auto;margin-top:30px;text-align:center;">' + title_content + '</div>' +
            '<div style="font-size:20px;display:block;margin-top:30px;padding-left:96px;margin-bottom:10px;">' + delete_content + ':</div>' +
            '<div style="width:450px;height:auto;display:block;margin-left:auto;margin-right:auto;" class="delete_class_data_ul"></div>' +
            '<div style="width:630px;height:80px;display:block;margin-left:auto;margin-right:auto;line-height:80px;margin-top:50px;margin-bottom:10px;">' +
            '<div style="width:135px;height: 50px;border-radius:5px;background-color: #a41515;cursor: pointer;text-align: center;line-height: 50px;color: white;transform: translate(46px);display: inline-block;" class="' + affirm_delete + '">确 认 删 除</div>' +
            '<div style="width: 135px;height: 50px;border-radius: 5px;background-color: #ccc;cursor: pointer;text-align: center;line-height: 50px;transform: translate(307px);display: inline-block;" class="' + undelete + '">不，返回</div>' +
            '</div></div>');
        // 处理数据
        let data_ul = $('<ul></ul>');
        delete_data_list_ul.forEach(function (shopPk) {
            let shop_name = $($('.shop_introduce[data-shopPk="' + shopPk + '"]').children()[0]).children()[0].innerHTML;
            data_ul.append($('<li style="margin:10px 0px;display:list-item;text-align: -webkit-match-parent;">' + shop_name + '</li>'))
        });
        body.prepend(background_board);
        body.prepend(delete_data_information_sheet);
        delete_data_information_sheet.find('.delete_class_data_ul').append(data_ul);
        // 确认删除
        $('.' + affirm_delete + '').click(function () {
            func(self);
            delete_shop_style_bojject(self);
            delete_data_information_sheet.remove();
            background_board.remove();
        });
        $('.' + undelete + '').click(function () {
            console.log('不删除');
            // 清除delete_data_information_sheet
            delete_data_information_sheet.remove();
            // 清除背景
            background_board.remove()
        })
    };
    // 商品选中后，删除按钮可点击
    UserData.prototype.shop_checkbox_delete = function (self) {
        // 所有商品
        $('.shop_introduce').each(function () {
            $(this).find('input').bind('change', function () {
                if (this.checked) {
                    // 添加商品到删除列表
                    self.delete_shop_list.push(this.value);
                    self.control_delete_shop_list(self)
                } else {
                    // 删除 删除列表 中的该商品
                    self.delete_shop_list.splice(self.delete_shop_list.indexOf(this.value), 1);
                    self.control_delete_shop_list(self)
                }
            });
        })
    };
    // 账号设置 超出预订范围，固定位置
    UserData.prototype.rigidity = function () {
        console.log(window.innerHeight);
        $(window).scroll(function () {
            if (document.documentElement.scrollTop >= 70) {
                // 当前位置
                $('.selectMessage').css({'top': '' + document.documentElement.scrollTop + 'px'})
            } else if (document.documentElement.scrollTop < 70) {
                $('.selectMessage').css({'top': '70px'})
            }
        })
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
        self.modification_userName(self);
        self.UserPortrait(self);
        self.newEmail(self);
        self.open_Shop();
        self.monitoring_image(self);
        self.send_shop_data(self);
        self.shop_error_hide();
        self.shop_checkbox_delete(self);
        self.monitor_delete_submit(self);
        self.rigidity();
    };
    userdatamethods.run()
});