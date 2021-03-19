$(function () {
    let layer = layui.layer;
    let form = layui.form;
    // 文章类别列表展示
    initSrtCateList();
    // 封装文章类别列表展示
    function initSrtCateList() {
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            data: {},
            success: (res) => {
                // console.log(res);
                let str = template('art_cate', { data: res.data });
                $('tbody').html(str);
            }
        })
    }

    // 显示添加分类列表
    $('#btnAdd').on('click', function () {
        // 框架提示
        indexAdd = layer.open({
            type: 1,
            title: '添加文章类别',
            area: ['500px', '260px'],
            content: $('#dialog-add').html()
        });

    })
    // 提交添加文章 事件委托 
    let indexAdd = null;
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: (res) => {
                console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                // 成功 渲染页面 关闭添加框
                initSrtCateList();
                layer.msg("恭喜你，文章类别添加成功");
                layer.close(indexAdd);
            }
        })
    })

    //显显示修改分类列表  事件委托
    $('tbody').on('click', '.btn-edit', function () {
        // 框架提示
        indexEdit = layer.open({
            type: 1,
            title: '添加文章类别',
            area: ['500px', '260px'],
            content: $('#dialog-edit').html()
        });
        // 获取当前自定义id
        let id = $(this).attr('data-id');
        // alert(id)
        $.ajax({
            type: 'get',
            url: '/my/article/cates/' + id,
            success: (res) => {
                // console.log(res);
                // 赋值
                form.val("form-edit", res.data)
            }
        })

    })

    // 修改提交
    let indexEdit = null;
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: (res) => {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                // 成功 渲染页面 关闭添加框
                initSrtCateList();
                layer.msg("恭喜你，文章类别更新成功");
                layer.close(indexEdit);
            }
        })
    })

    // 删除
    $('tbody').on('click', '.btn-delete', function () {
        // 获取当前id
        let id = $(this).attr('data-id');
        // alert(id)
        //显示 提示框
        layer.confirm('确定要删除吗?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                type: 'GET',
                url: '/my/article/deletecate/' + id,
                success: (res) => {
                    // console.log(res);
                    if (res.status != 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg("恭喜你，文章类别删除成功");
                    initSrtCateList();
                    layer.close(index);
                }
            })


        });

    })
})