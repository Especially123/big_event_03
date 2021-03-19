$(function () {
    let layer = layui.layer;
    let form = layui.form;
    // 初始化分类
    initCate();

    // 封装初始化
    function initCate() {
        $.ajax({
            type: 'get',
            url: '/my/article/cates',
            success: (res) => {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                // 渲染
                let str = template('cate', { data: res.data });
                $('[name="cate_id"]').html(str);
                // 更新 一般是在表单 表格 
                form.render();
            }
        })
    }

    // 初始化富文本编辑器
    initEditor()

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 选择文件
    $('#btnChooseImage').on('click', function () {
        $('#file').click();
    })

    // 设置图片
    $('#file').change(function (e) {
        let file = e.target.files[0];
        if (!file) return layer.msg("请选择一张图片作为封面")

        var newImgURL = URL.createObjectURL(file)
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    });

    // 设置状态
    let state = "已发布";
    $('btnSave2').click(function () {
        state = "草稿";
    })

    // 添加文章
    $('#form-pub').on('submit', function (e) {
        e.preventDefault();
        // 收集数据
        let fn = new FormData(this);
        // 放入状态
        fn.append('state', state);
        // 放入图片
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fn.append('cover_img', blob)
                // console.log(fn);
                // console.log(...fn);
                //发送数据 
                publishArtilcle(fn);

            });
    })
    // 封装 添加文章方法
    function publishArtilcle(fn) {
        $.ajax({
            type: 'POST',
            url: '/my/article/add',
            data: fn,
            contentType: false,
            processData: false,
            success: (res) => {
                console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                layer.msg("恭喜你，文章发布成功");

                // 跳转
                // location.href = "art_list.html";
                setTimeout(function () {
                    window.parent.document.getElementById('art_list').click();
                }, 500)
            }
        })
    }

})