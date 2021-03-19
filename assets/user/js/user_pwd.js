$(function () {
    let form = layui.form;
    let layer = layui.layer;
    // 定义密码规则
    form.verify({
        pwd: [
            /^[\S]{6,12}$/,
            '密码必须6到12位，且不能出现空格'
        ],
        // 原密码与新密码不能一样
        samePwd: function (value) {
            // console.log($('[name="oldPwd"]').val(), value);
            if (value == $('[name="oldPwd"]').val()) {
                return "新密码不能与原密码一样"
            }
        },
        // 新密码与确认密码保持一致
        rePwd: function (value) {
            if (value != $('[name="newPwd"]').val()) {
                return "两次输入密码不一致"
            }
        }
    })

    //表单提交
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: (res) => {
                console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                layer.msg("恭喜你，用户密码成功");
                // 重置表单
                $('.layui-form')[0].reset();

                // setTimeout(function () {
                //     // 跳转
                //     location.href = '/login.html'
                // }, 500)
            }
        })
    })

})