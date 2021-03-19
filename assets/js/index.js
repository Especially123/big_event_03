$(function () {
    // console.log(1);
    getUserInOf();

    // 退出登录
    let layer = layui.layer;
    $('#btnTuChu').on('click', function () {
        layer.confirm('确定要退出吗？', { icon: 3, title: '提示' }, function (index) {
            //    清除数据
            localStorage.removeItem('token');
            // 跳转
            location.href = '/login.html'
            // 关闭
            layer.close(index);
        });
    })

})


// 获取用户数据
function getUserInOf() {
    $.ajax({
        type: 'get',
        url: '/my/userinfo',
        success: (res) => {
            // console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg(res.message, { icon: 5 });
            }
            renderAvatar(res.data)
        }
    })
}

//渲染头像
function renderAvatar(user) {
    let name = user.nickname || user.username
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    // 有图片渲染图片  没有则渲染文字
    if (user.user_pic == null) {
        $('.text-avatar').show().html(name[0].toUpperCase());
        $('.layui-nav-img').hide();
    } else {
        $('.text-avatar').hide();
        $('.layui-nav-img').show().attr('src', user.user_pic);
    }
}

