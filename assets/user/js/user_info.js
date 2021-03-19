$(function () {
    let form = layui.form;

    // 定义昵称规则
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return "昵称长度在 1-6 位之间"
            }
        }
    });

    // 渲染页面数据
    initUserinfo();

    // 表单重置
    $('#btnReset').on('click', function (e) {
        e.preventDefault();
        // 从新用户渲染
        initUserinfo();
    })

    // 修改用户
    $('.layui-form').on('submit', function (e) {
        // 阻止默认
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: (res) => {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg("恭喜你，用户信息更新成功");
                // 调用父页面中的更新用户信息 和头像方法
                window.parent.getUserInOf();
            }
        })
    })


})

// 封装获取用户数据
let form = layui.form;
let layer = layui.layer;
function initUserinfo() {
    $.ajax({
        type: 'GET',
        url: '/my/userinfo',
        success: (res) => {
            // console.log(res);
            if (res.status !== 0) {
                return layer.msg(res.message)
            }
            //formUserInfo 即 class="layui-form" 所在元素属性 lay-filter="" 对应的值
            form.val("formUserInfo", res.data);
        }
    })
};