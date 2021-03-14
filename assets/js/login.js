$(function () {
    // 登录注册模块切换
    $('#link_reg').on('click', function () {
        $('.reg_box').show();
        $('.login_box').hide();
    })
    $('#link_login').on('click', function () {
        $('.reg_box').hide();
        $('.login_box').show();
    })


    // 校验
    let form = layui.form;

    form.verify({
        pwd: [
            /^[\S]{6,12}$/,
            '密码必须6到12位，且不能出现空格'
        ],
        regpwd: function (value) {
            // console.log(value);
            // console.log($('.reg_box input[name=password]').val().trim());
            if (value != $('.reg_box input[name=password]').val().trim()) {
                return '两次密码输入不一致';
            }
        }
    })

    // 注册用户
    let layer = layui.layer;
    $('#form-reg').on('submit', function (e) {
        e.preventDefault();

        $.ajax({
            type: 'post',
            url: '/api/reguser',
            data: {
                username: $('.reg_box input[name=username]').val().trim(),
                password: $('.reg_box input[name=password]').val().trim()
            },
            success: (res) => {
                // console.log(res);
                if (res.status != 1) {
                    layer.msg('注册账号成功', { icon: 6 });
                    // 跳转登录
                    $('#link_login').click();
                    // 重置表单
                    $('#form-reg')[0].reset();
                } else {
                    return layer.msg(res.message, { icon: 5 });
                }
            }
        })
    })

    //登录
    $('#form-login').on('submit', function (e) {
        e.preventDefault();

        $.ajax({
            type: 'post',
            url: '/api/login',
            data: $(this).serialize(),
            success: (res) => {
                console.log(res);
                if (res.status != 1) {
                    // 保存数据
                    localStorage.setItem('token', res.token)
                    // 跳转页面
                    location.href = "/index.html"
                } else {
                    return layer.msg(res.message, { icon: 5 });
                }
            }
        })
    })
})