$(function () {
    function Tags() {
    }

    // 实现tag的弹出和隐藏功能
    Tags.prototype.showtag = function () {
        // 获取点击元素
        let tagtarget = $('.border li');
        tagtarget.each(function () {
            // show
            $(this).mouseenter(function () {
                // console.log($(this).find('span'));
                $(this).find('span').css({display: 'inline-block'})
            });
            // hide
            $(this).mouseleave(function () {
                // console.log(this);
                $(this).find('span').css({display: 'none'})
            })
        })
    };

    // 轮播图插件
    Tags.prototype.slideshow_images_plug = function () {
        const mySwiper = new Swiper('.swiper-container', {
            direction: 'horizontal',
            loop: true,
            pagination: {
                el: '.swiper-pagination',
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            speed: 300,
            autoplay: {
                delay: 3000
            },
        });
    };

    // 选中商品显示边框
    Tags.prototype.border_up = function () {
        // 获取所有a标签
        let all_a_tags = $('.all_commodity a');
        // 绑定鼠标事件
        all_a_tags.each(function () {
            // show
            $(this).mouseenter(function () {
                console.log($(this).css('border'));
                $(this).css({border: '1px solid brown'})
            });
            // hide
            $(this).mouseleave(function () {
                $(this).css({'border': ''})
            })
        })
    };

    // 放大图片
    Tags.prototype.magnify_image = function () {
        let all_a_tags = $('.all_commodity a');
        // 绑定鼠标事件
        all_a_tags.each(function () {
            // show
            $(this).mouseenter(function () {
                $(this).find('img').css({width: '200px', height: '200px', 'transform': 'translate(0, 0)'})
                // $(this).css({border: '1px solid brown'})
            });
            // hide
            $(this).mouseleave(function () {
                $(this).find('img').css({width: '120px', height: '120px', 'transform': 'translate(40px, 40px)'})
            })
        })
    };

    // 鼠标移动到login上时显示
    Tags.prototype.showUserOperation = function () {
        let login = $('.login');
        let loginOperation = $('.loginOperation');
        login.mouseenter(function () {
            loginOperation.show()
        });
        loginOperation.mouseleave(function () {
            loginOperation.hide()
        });
    };

    // 用户操作鼠标响应
    Tags.prototype.mouseResponse = function () {
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
    Tags.prototype.run = function () {
        const self = this;
        self.showtag();
        self.slideshow_images_plug();
        // self.border_up()
        self.magnify_image();
        self.showUserOperation();
        self.mouseResponse()
    };

    const tagMethods = new Tags();
    tagMethods.run()
});