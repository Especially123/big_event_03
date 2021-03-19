$(function () {
    let layer = layui.layer;
    let form = layui.form;

    // 定义 时间过滤器
    template.defaults.imports.dateFormat = function (dtStr) {
        let dt = new Date(dtStr);

        let y = padZero(dt.getFullYear());
        let m = padZero(dt.getMonth() + 1);
        let d = padZero(dt.getDate());

        let hh = padZero(dt.getHours());
        let mm = padZero(dt.getMinutes());
        let ss = padZero(dt.getSeconds());

        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
    }
    // 小于10加零
    function padZero(num) {
        return num < 10 ? "0" + num : num
    }
    // 定义提交参数
    let q = {
        pagenum: 1, //页码值
        pagesize: 2, //每页显示多少条数据
        cate_id: "", //文章分类的 Id
        state: "", //文章的状态，可选值有：已发布、草稿
    }
    // 初始化文章列表
    initTable();

    // 封装初始化文章列表
    function initTable() {
        $.ajax({
            type: 'GET',
            url: '/my/article/list',
            data: q,
            success: (res) => {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                let str = template('table', { data: res.data });
                $('tbody').html(str);
                //调用分页
                // console.log(res.total);
                renderPage(res.total);
            }
        })
    }

    // 初始化分类
    initCate();

    // 封装初始化分类
    function initCate() {
        $.ajax({
            type: 'get',
            url: '/my/article/cates',
            success: (res) => {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                // 赋值 渲染
                let str = template('cate', { data: res.data })
                $('[name="cate_id"]').html(str);
                // 更新
                form.render();
            }
        })
    }

    // 筛选功能
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        // 获取
        let cate_id = $('[name="cate_id"]').val();
        let state = $('[name="state"]').val();
        // 赋值
        q.cate_id = cate_id;
        q.state = state;
        // 初始化文章列表
        initTable();
    })

    //分页
    let laypage = layui.laypage;
    function renderPage(total) {
        // alert(total)
        //执行一个laypage实例
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            limit: q.pagesize, // 每页几条数据
            curr: q.pagenum,//第几页
            count: total, //数据总数，从服务端得到

            // 分页模块设置
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 4, 6, 8, 10],  //显示多少条数据

            jump: function (obj, first) {
                //obj包含了当前分页的所有参数， first是否第一次执行初始化分页
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数
                // 改变当前页
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                //首次不执行
                if (!first) {
                    // 初始化分页
                    initTable();
                }
            }
        });

    }

    // 删除
    $('tbody').on('click', '.btn-delete', function () {
        // 获取自定义id
        let id = $(this).attr('data-id');
        // console.log(id);
        //eg1
        layer.confirm('确定要删除吗？', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                type: 'GET',
                url: '/my/article/delete/' + id,
                success: (res) => {
                    // console.log(res);
                    if (res.status != 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg("恭喜你，文章删除成功");
                    //页面汇总删除按钮个数等于一 页码大于一
                    if ($('.btn-delete').length == 1 && q.pagenum > 1) q.pagenum--;
                    initTable();
                }
            })
            layer.close(index);
        });
    })


})