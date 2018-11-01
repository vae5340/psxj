(function ($) {
    //这里放私有函数

    // 上一页
    function previousPage($target) {
        var opts = $target.data('pageView').options;
        //获取当前页数并减一，就是上一页的页数
        var newPage = opts.pageNumber - 1;
        //调用翻页函数
        changePage($target, newPage);
    }

    // 下一页
    function nextPage($target) {
        var opts = $target.data('pageView').options;

        var newPage = opts.pageNumber + 1;

        changePage($target, newPage);
    }

    // 翻页
    function changePage($target, pageNum) {
        var opts = $target.data('pageView').options;
        //防止页数小于第一页
        if (pageNum < 1)
            pageNum = 1;
        //记录总行数
        var total = opts.totalRowNum;
        //总页数
        var pageNumSum = total % opts.pageSize == 0 ? total / opts.pageSize : parseInt(total / opts.pageSize) + 1;
        //防止页数超过总页数
        if (pageNum > pageNumSum)
            pageNum = pageNumSum;
        //如果新页数等于当前页数就不刷新数据
        if (opts.pageNumber != pageNum) {
            opts.pageNumber = pageNum;

            var pageData = {};
            pageData.pageNumber = opts.pageNumber;
            pageData.pageSize = opts.pageSize;

            //触发改变页码的事件
            opts.onChangePage.call(this, pageData);

            buildPage($target);
        }
    }

    //加载分页
    function loadPage($this) {
        buildPage($this);
    }

    //构建分页
    function buildPage($this) {
    	$this.empty();
        var opts = $this.data('pageView').options;

        //保存总行数
        var total = opts.totalRowNum;

        //计算总页数
        var pageSum = total % opts.pageSize == 0 ? total / opts.pageSize : parseInt(total / opts.pageSize) + 1;

        var $page = $('<div class="page"></div>');
        var $pageContent = $('<div class="page_content"></div>').appendTo($page);

        var $lastPage = $('<a href="javascript:;"">上一页</a>').appendTo($pageContent);
        var $nextPage = $('<a href="javascript:;"">下一页</a>').appendTo($pageContent);
        var $pageNumInput = $('<input type="text" value="' + opts.pageNumber + '"/>').appendTo($pageContent);
        var $toPageBtn = $('<button type="button" class="page_btn">跳转</button>').appendTo($pageContent);
        var $pageNumInfo = $('<span>(第' + opts.pageNumber + '页/共' + pageSum + '页，共' + total + '条)</span>').appendTo($pageContent);

        if (opts.pageNumber <= 1) {
            $lastPage.addClass("a_disableCss");
        } else {
            $lastPage.removeClass("a_disableCss");

            //上一页单击事件
            $lastPage.bind('click', function () {
                previousPage($this);
            });
        }

        if (opts.pageNumber >= pageSum) {
            $nextPage.addClass("a_disableCss");
        } else {
            $nextPage.removeClass("a_disableCss");

            //下一页单击事件
            $nextPage.bind('click', function () {
                nextPage($this);
            });
        }

        //跳转页面单击事件
        $toPageBtn.bind('click', function () {
            var newPageNum = parseInt($pageNumInput.val());
            //判断输入的页数是不是数字
            if (!isNaN(newPageNum)) {
                changePage($this, newPageNum);
            }
        });

        $this.append($page);

    }

    //插件构造函数
    $.fn.pageView = function (options, param) {
        //这里代表调用插件的方法，第一个参数是方法名，第二个参数是传入参数
        if (typeof options == 'string') {
            var method = $.fn.pageView.methods[options];
            if (method) {
                return method(this, param);
            }
        }

        options = options || {};
        return this.each(function () {
            var $this = $(this);
            var state = $this.data('pageView');
            if (state) {
                //已经初始化
                //属性值用新值覆盖
                $.extend(state.options, options);
            } else {
                //初始化（实例化）插件
                state = $this.data('pageView', {
                    options: $.extend({}, $.fn.pageView.defaults, options)
                });
            }
        });
    };

    //插件的公共方法
    $.fn.pageView.methods = {
        //获取插件的设置和参数值
        options: function (jq) {
            return $.data(jq[0], 'pageView').options;
        },
        //加载分页
        loadPage: function ($this) {
            loadPage($this);
        }
    };
    //默认的设置值
    $.fn.pageView.defaults = {
        //每页行数
        pageSize: 10,
        //当前页数（第一页是1）
        pageNumber: 1,
        //记录总行数（不分页），一般在加载数据时自动设置，不手动传入
        totalRowNum: 0,
        //改变页码的事件
        onChangePage: function(pageData) {
        }
    };
})(jQuery);
