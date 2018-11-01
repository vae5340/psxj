/**
 * 封装的一些自定义组件
 *
 * 其他插件地址 https://github.com/weui/weui.js/
 */
//扩展支持touch的当前元素的click事件
function fastClick(){
    var supportTouch = function(){
        try {
            document.createEvent("TouchEvent");
            return true;
        } catch (e) {
            return false;
        }
    }();
    var _old$On = $.fn.on;

    $.fn.on = function(){
        if(/click/.test(arguments[0]) && typeof arguments[1] == 'function' && supportTouch){ // 只扩展支持touch的当前元素的click事件
            var touchStartY, callback = arguments[1];
            _old$On.apply(this, ['touchstart', function(e){
                touchStartY = e.changedTouches[0].clientY;
            }]);
            _old$On.apply(this, ['touchend', function(e){
                if (Math.abs(e.changedTouches[0].clientY - touchStartY) > 10) return;

                e.preventDefault();
                callback.apply(this, [e]);
            }]);
        }else{
            _old$On.apply(this, arguments);
        }
        return this;
    };
}

//Android 输入框被挡住
//如果页面高度不足，仍然会出现被挡住的情况，解决方法 自动增加页面高度， -- 未实现
function androidInputBugFix(){
    // .container 设置了 overflow 属性, 导致 Android 手机下输入框获取焦点时, 输入法挡住输入框的 bug
    // 相关 issue: https://github.com/weui/weui/issues/15
    // 解决方法:
    // 0. .container 去掉 overflow 属性, 但此 demo 下会引发别的问题
    // 1. 参考 http://stackoverflow.com/questions/23757345/android-does-not-correctly-scroll-on-input-focus-if-not-body-element
    //    Android 手机下, input 或 textarea 元素聚焦时, 主动滚一把
    if (/Android/gi.test(navigator.userAgent)) {
        window.addEventListener('resize', function () {
            if (document.activeElement.tagName == 'INPUT' || document.activeElement.tagName == 'TEXTAREA') {
                window.setTimeout(function () {
                    document.activeElement.scrollIntoViewIfNeeded();
                }, 0);
            }
        })
    }
}

$(function () {
    fastClick();
    androidInputBugFix();
});

//页面跳转
(function ($) {
    'use strict';

    /**
     * 定义插件的构造方法
     * @param element 选择器对象
     * @param options 配置项
     * @constructor
     */
    var Plugin = function(options) {
        //合并参数设置
        this.options = $.extend({
            _pageStack: [],
            _configs: [],
            _defaultPage: null,
            _pageIndex: 1
        }, Plugin.defaults, options);

        this.options.$container = $(this.options.container);
        this.options.$templates = $(this.options.template);
        this.options._pageAppend = this.options.pageAppend;

        //进行一些初始化工作
        var pages = {}, tpls = this.options.$templates;

        for (var i = 0, len = tpls.length; i < len; ++i) {
            var tpl = tpls[i], name = tpl.id.replace(/tpl_/, '');
            pages[name] = {
                name: name,
                url: '#' + name,
                template: '#' + tpl.id
            };
        }
        pages[this.options.defaultPage].url = '#';

        for (var page in pages) {
            this.push(pages[page]);
        }
        this.setDefault(this.options.defaultPage)
            .init();

        return this;
    };

    /**
     * 插件默认配置项
     * @type {{}}
     */
    Plugin.defaults = {
        container: '#container',
        template: 'script[type="text/html"]',
        defaultPage: 'home',
        pageAppend: function() {}
    };

    /**
     * 定义插件的方法
     * @type {{}}
     */
    Plugin.prototype = {
        setDefault: function (defaultPage) {
            this.options._defaultPage = this._find('name', defaultPage);
            return this;
        },
        init: function () {
            var self = this;

            $(window).on('hashchange', function () {
                var state = history.state || {};
                var url = location.hash.indexOf('#') === 0 ? location.hash : '#';
                var page = self._find('url', url) || self.options._defaultPage;
                if (state._pageIndex <= self._pageIndex || self._findInStack(url)) {
                    self._back(page);
                } else {
                    self._go(page);
                }
            });

            if (history.state && history.state._pageIndex) {
                this.options._pageIndex = history.state._pageIndex;
            }

            this.options._pageIndex--;

            var url = location.hash.indexOf('#') === 0 ? location.hash : '#';
            var page = self._find('url', url) || self.options._defaultPage;
            this._go(page);
            return this;
        },
        push: function (config) {
            this.options._configs.push(config);
            return this;
        },
        go: function (to) {
            var config = this._find('name', to);
            if (!config) {
                return;
            }
            location.hash = config.url;
        },
        _go: function (config) {
            this.options._pageIndex ++;

            history.replaceState && history.replaceState({_pageIndex: this.options._pageIndex}, '', location.href);

            var html = $(config.template).html();
            var $html = $(html).addClass('slideIn').addClass(config.name);
            $html.on('animationend webkitAnimationEnd', function(){
                $html.removeClass('slideIn').addClass('js_show');
            });
            this.options.$container.append($html);
            this.options._pageAppend.call(this, $html);
            this.options._pageStack.push({
                config: config,
                dom: $html
            });

            if (!config.isBind) {
                this._bind(config);
            }

            return this;
        },
        back: function () {
            history.back();
        },
        _back: function (config) {
            this.options._pageIndex --;

            var stack = this.options._pageStack.pop();
            if (!stack) {
                return;
            }

            var url = location.hash.indexOf('#') === 0 ? location.hash : '#';
            var found = this._findInStack(url);
            if (!found) {
                var html = $(config.template).html();
                var $html = $(html).addClass('js_show').addClass(config.name);
                $html.insertBefore(stack.dom);

                if (!config.isBind) {
                    this._bind(config);
                }

                this.options._pageStack.push({
                    config: config,
                    dom: $html
                });
            }

            stack.dom.addClass('slideOut').on('animationend webkitAnimationEnd', function () {
                stack.dom.remove();
            });

            return this;
        },
        _findInStack: function (url) {
            var found = null;
            for(var i = 0, len = this.options._pageStack.length; i < len; i++){
                var stack = this.options._pageStack[i];
                if (stack.config.url === url) {
                    found = stack;
                    break;
                }
            }
            return found;
        },
        _find: function (key, value) {
            var page = null;
            for (var i = 0, len = this.options._configs.length; i < len; i++) {
                if (this.options._configs[i][key] === value) {
                    page = this.options._configs[i];
                    break;
                }
            }
            return page;
        },
        _bind: function (page) {
            var events = page.events || {};
            for (var t in events) {
                for (var type in events[t]) {
                    this.options.$container.on(type, t, events[t][type]);
                }
            }
            page.isBind = true;
        }
    };

    $.ui = $.ui || {};

    /**
     * 页面跳转
     *
     * @param {object=} options 配置项
     * @param {string=} options.container 整个页面容器
     * @param {string=} options.template 各个子页面选择器
     * @param {string=} options.defaultPage 默认加载页面
     * @param {function} options.pageAppend 页面添加完成的回调
     *
     * @example
     * 初始化
     * var pager = $.ui.pager({
     *     container: '#container',
     *     template: 'script[type="text/html"]',
     *     defaultPage: 'home',
     *     pageAppend: function () { alert('页面添加完毕') }
     * });
     * 调用
     * pager.go(id);
     *
     *
     * 页面example
     * <div class="container" id="container"></div>
     *
     * <script type="text/html" id="tpl_home">
     *     home页面
     *     <div class="page">
     *         <div class="page__bd page__bd_spacing">
     *             <ul>
     *                  <li class="js_item" data-id="button">子页面1</li>
     *                  <li class="js_item" data-id="list">子页面2</li>
     *                  <li><a href="#another">子页面3</a></li>
     *             </ul>
     *         </div>
     *     </div>
     *     <script type="text/javascript">
     *         $(function(){
     *             $('.js_item').on('click', function(){
     *                 var id = $(this).data('id');
     *                 pager.go(id);
     *             });
     *         });
     *     </script>
     * </script>
     * <script type="text/html" id="tpl_button">
     *     子页面1
     * </script>
     * <script type="text/html" id="tpl_list">
     *     子页面2
     * </script>
     * <script type="text/html" id="tpl_another">
     *     子页面3
     * </script>
     * <script>
     *     var pager = $.ui.pager({
     *             container: '#container',
     *             template: 'script[type="text/html"]',
     *             defaultPage: 'home'
     *         });
     * </script>
     *
     */
    $.ui['pager'] = function(options) {
        if(typeof options === 'object') {
            if(typeof options.pageAppend !== 'function') {
                options.pageAppend = function($html){
                    var winH = $(window).height();

                    var $foot = $html.find('.page__ft');
                    if($foot.length < 1) return;

                    if($foot.position().top + $foot.height() < winH){
                        $foot.addClass('j_bottom');
                    }else{
                        $foot.removeClass('j_bottom');
                    }
                }
            }
        }

        return new Plugin(options);
    };
})(Zepto);

(function($){
    //参数解析
    $.parser = {
        parseValue: function(property, value, parent, delta){
            delta = delta || 0;
            var v = $.trim(String(value||''));
            var endchar = v.substr(v.length-1, 1);
            if (endchar == '%'){
                v = parseInt(v.substr(0, v.length-1));
                if (property.toLowerCase().indexOf('width') >= 0){
                    v = Math.floor((parent.width()-delta) * v / 100.0);
                } else {
                    v = Math.floor((parent.height()-delta) * v / 100.0);
                }
            } else {
                v = parseInt(v) || undefined;
            }
            return v;
        },

        /**
         * parse options, including standard 'data-options' attribute.
         *
         * calling examples:
         * $.parser.parseOptions(target);
         * $.parser.parseOptions(target, ['id','title','width',{fit:'boolean',border:'boolean'},{min:'number'}]);
         */
        parseOptions: function(target, properties){
            var t = $(target);
            var options = {};

            var s = $.trim(t.attr('data-options'));
            if (s){
                if (s.substring(0, 1) != '{'){
                    s = '{' + s + '}';
                }
                options = (new Function('return ' + s))();
            }
            $.map(['width','height','left','top','minWidth','maxWidth','minHeight','maxHeight'], function(p){
                var pv = $.trim(target.style[p] || '');
                if (pv){
                    if (pv.indexOf('%') == -1){
                        pv = parseInt(pv);
                        if (isNaN(pv)){
                            pv = undefined;
                        }
                    }
                    options[p] = pv;
                }
            });

            if (properties){
                var opts = {};
                for(var i=0; i<properties.length; i++){
                    var pp = properties[i];
                    if (typeof pp == 'string'){
                        opts[pp] = t.attr(pp);
                    } else {
                        for(var name in pp){
                            var type = pp[name];
                            if (type == 'boolean'){
                                opts[name] = t.attr(name) ? (t.attr(name) == 'true') : undefined;
                            } else if (type == 'number'){
                                opts[name] = t.attr(name)=='0' ? 0 : parseFloat(t.attr(name)) || undefined;
                            }
                        }
                    }
                }
                $.extend(options, opts);
            }
            return options;
        }
    };

    //模板渲染
    /**
     * render
     * 取值：<%= variable %>
     * 表达式：<% if {} %>
     * 例子：
     *  <div>
     *    <div class="weui-mask"></div>
     *    <div class="weui-dialog">
     *    <% if(typeof title === 'string'){ %>
     *           <div class="weui-dialog__hd"><strong class="weui-dialog__title"><%=title%></strong></div>
     *    <% } %>
     *    <div class="weui-dialog__bd"><%=content%></div>
     *    <div class="weui-dialog__ft">
     *    <% for(var i = 0; i < buttons.length; i++){ %>
     *        <a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_<%=buttons[i]['type']%>"><%=buttons[i]['label']%></a>
     *    <% } %>
     *    </div>
     *    </div>
     *  </div>
     * A very simple template engine
     * @param {String} tpl
     * @param {Object=} data
     * @returns {String}
     */
    $.os = $.os || {};
    $.os.render = function(tpl, data) {
        const code = 'var p=[],print=function(){p.push.apply(p,arguments);};with(this){p.push(\'' +
            tpl
                .replace(/[\r\t\n]/g, ' ')
                .split('<%').join('\t')
                .replace(/((^|%>)[^\t]*)'/g, '$1\r')
                .replace(/\t=(.*?)%>/g, '\',$1,\'')
                .split('\t').join('\');')
                .split('%>').join('p.push(\'')
                .split('\r').join('\\\'')
            + '\');}return p.join(\'\');';
        return new Function(code).apply(data);
    };

    //判断系统
    var android = navigator.userAgent.match(/(Android);?[\s\/]+([\d.]+)?/);
    if (android) {
        $.os.android = true;
        $.os.version = android[2];
    } else {
        $.os.android = false;
    }
})(Zepto);

//文本框 插件
(function ($) {
    'use strict';

    /**
     * 定义插件的构造方法
     * @param element 选择器对象
     * @param options 配置项
     * @constructor
     */
    var Plugin = function (element, options) {

        //合并参数设置
        this.options = $.extend({}, Plugin.defaults, options);

        //将选择器对象赋值给插件，方便后续调用
        this.$element = $(element);

        //进行一些初始化工作
        this.init();
    };

    /**
     * 插件名称，即调用时的名称（$.fn.pluginName）
     * @type {string}
     */
    Plugin.pluginName = "textarea";

    /**
     * 插件缓存名称，插件通过 data 方法缓存在 dom 结构里，存储数据的名称
     * @type {string}
     */
    Plugin.dataInstanceName = "cache";

    /**
     * 插件版本
     * @type {string}
     */
    Plugin.version = "1.0.0";

    /**
     * 插件默认配置项
     * @type {{}}
     */
    Plugin.defaults = {
        title: "",
        placeholder: "请输入文本",
        name: "name",
        rows: 3,
        content: "",
        maxLength: 200,
        showCount: true
    };

    /**
     * 定义插件的方法
     * @type {{}}
     */
    Plugin.prototype = {

        init: function () {
            var _html = [];
            if(this.options.title) {
                _html.push('<div class="weui-cells__title">');
                _html.push(this.options.title);
                _html.push('</div>');
            }
            _html.push('<div class="weui-cells weui-cells_form">');
            _html.push('<div class="weui-cell">');
            _html.push('<div class="weui-cell__bd">');

            _html.push('<textarea class="weui-textarea" ');
            _html.push(' placeholder="');
            _html.push(this.options.placeholder);
            _html.push('" name="');
            _html.push(this.options.name);
            _html.push('" rows="');
            _html.push(this.options.rows);
            _html.push('">');
            _html.push(this.options.content);
            _html.push('</textarea>');
            if(this.options.showCount) {
                _html.push('<div class="weui-textarea-counter"><span>');
                _html.push(this.options.content.length);
                _html.push('</span>/');
                _html.push(this.options.maxLength);
                _html.push('</div>');
            }

            _html.push('</div></div></div>');

            this.$element.html(_html.join(''));

            //绑定事件
            //计数
            if(this.options.showCount) {
                var _this = this;
                this.$element.find('textarea').on('keyup', function () {
                    $(this).parent().find('.weui-textarea-counter span').text(_this._count());
                });
            }
        },

        _count: function () {
            return this.$element.find('textarea').val().length;
        }
    };

    /**
     * 缓存同名插件
     */
    var old = $.fn[Plugin.pluginName];

    /**
     * 定义插件，扩展$.fn，为Zepto对象提供新的插件方法
     * 调用方式：$.fn.pluginName()
     * @param option {string/object}
     */
    $.fn[Plugin.pluginName] = function (option) {
        return this.each(function () {
            var $this = $(this);

            var _instance = $.fn[Plugin.pluginName].pluginData[$this.data(Plugin.dataInstanceName)];
            var options = typeof option == 'object' && option;

            //只实例化一次，后续如果再次调用了该插件时，则直接获取缓存的对象
            if (!_instance) {
                //zepto的data方法只能保存字符串，所以用此方法解决一下
                $.fn[Plugin.pluginName].pluginData[++$.fn[Plugin.pluginName].pluginData.index] = new Plugin(this, options);
                $this.data(Plugin.dataInstanceName, $.fn[Plugin.pluginName].pluginData.index);
                _instance = $.fn[Plugin.pluginName].pluginData[$this.data(Plugin.dataInstanceName)];
            }

            //如果插件的参数是一个字符串，则直接调用插件的名称为此字符串方法
            if (typeof option == 'string') _instance[option]();
        });
    };

    /**
     * zepto的data方法只能保存字符串，所以用一个对象来存储实例
     * @type {{index: number}}
     */
    $.fn[Plugin.pluginName].pluginData = {index: 0};

    $.fn[Plugin.pluginName].Constructor = Plugin;

    /**
     * 为插件增加 noConflict 方法，在插件重名时可以释放控制权
     * @returns {*}
     */
    $.fn[Plugin.pluginName].noConflict = function () {
        $.fn[Plugin.pluginName] = old;
        return this
    };

    /**
     * 通过在 dom 上定义 data-customer='pluginName' 的方式，自动实例化插件，省去页面编写代码
     * 在这里还可以扩展更多配置，仅仅通过 data 属性 API 就能使用插件
     */
    $(document).ready(function () {
        $('[data-customer="' + Plugin.pluginName + '"]').each(function () {
            var $this = $(this);

            $.fn[Plugin.pluginName].call($this, $.parser.parseOptions(this));
        });
    });
})(Zepto);

//各种框提示
(function ($) {
    'use strict';

    var _sington;

    /**
     * 定义插件的构造方法
     * @param element 选择器对象
     * @param options 配置项
     * @constructor
     */
    var Plugin = function(options) {
        if (_sington) return _sington;

        var isAndroid = $.os.android;

        options = $.extend({}, {
            title: null,
            content: '',
            className: '',
            buttons: [{
                label: '确定',
                type: 'primary',
                onClick: $.noop
            }],
            isAndroid: isAndroid
        }, options);

        var tpl = '<div class="<%=className%>">' +
            '    <div class="weui-mask"></div>' +
            '    <div class="weui-dialog <% if(isAndroid){ %> weui-skin_android <% } %>">' +
            '        <% if(title){ %>' +
            '        <div class="weui-dialog__hd"><strong class="weui-dialog__title"><%=title%></strong></div>' +
            '        <% } %>' +
            '        <div class="weui-dialog__bd"><%=content%></div>' +
            '        <div class="weui-dialog__ft">' +
            '            <% for(var i = 0; i < buttons.length; i++){ %>' +
            '            <a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_<%=buttons[i][\'type\']%>"><%=buttons[i][\'label\']%></a>' +
            '            <% } %>' +
            '        </div>' +
            '    </div>' +
            '</div>';
        var $dialogWrap = $($.os.render(tpl, options));
        var $dialog = $dialogWrap.find('.weui-dialog');
        var $mask = $dialogWrap.find('.weui-mask');

        function hide(callback) {
            $mask.addClass('weui-animate-fade-out');
            $dialog.addClass('weui-animate-fade-out')
                .on('animationend webkitAnimationEnd', function () {
                    _sington = false;
                    if (callback) {
                        callback();
                    }
                    $dialogWrap.remove();
                });
        }

        $('body').append($dialogWrap);
        // 不能直接把.weui-animate-fade-in加到$dialog，会导致mask的z-index有问题
        $mask.addClass('weui-animate-fade-in');
        $dialog.addClass('weui-animate-fade-in');

        //点击按钮
        $dialogWrap.on('click', '.weui-dialog__btn', function (evt) {
                var index = $(this).index();
                hide(function () {
                    options.buttons[index].onClick && options.buttons[index].onClick.call(this, evt);
                });
            }
        );
        //点击遮罩，默认只关闭
        $dialogWrap.on('click', '.weui-mask', function (evt) {
                hide(function () {
                    //默认触发第一个按钮的事件，无法确定触发哪个事件好，所以屏蔽
                    //options.buttons[0].onClick && options.buttons[0].onClick.call(this, evt);
                });
            }
        );

        _sington = $dialogWrap[0];
        _sington.hide = hide;
        return _sington;
    };

    /**
     * 插件名称，即调用时的名称（$.fn.pluginName）
     * @type {string}
     */
    Plugin.pluginName = "dialog";


    $.ui = $.ui || {};
    /**
     * 定义插件，扩展$.ui
     * 调用方式：$.ui.pluginName()
     * @param option {string/object}
     */
    /**
     * dialog，弹窗，alert和confirm的父类
     *
     * @param {object=} options 配置项
     * @param {string=} options.title 弹窗的标题
     * @param {string=} options.content 弹窗的内容
     * @param {string=} options.className 弹窗的自定义类名
     * @param {array=} options.buttons 按钮配置项
     *
     * @param {string} [options.buttons[].label=确定] 按钮的文字
     * @param {string} [options.buttons[].type=primary] 按钮的类型 [primary, default]
     * @param {function} [options.buttons[].onClick=$.noop] 按钮的回调
     *
     * @example
     * $.ui.dialog({
     *     title: 'dialog标题',
     *     content: 'dialog内容',
     *     className: 'custom-classname',
     *     buttons: [{
     *         label: '取消',
     *         type: 'default',
     *         onClick: function () { alert('取消') }
     *     }, {
     *         label: '确定',
     *         type: 'primary',
     *         onClick: function () { alert('确定') }
     *     }]
     * });
     */
    $.ui[Plugin.pluginName] = function (option) {
        return Plugin(this, options);
    };

    //alert
    /**
     * alert 警告弹框，功能类似于浏览器自带的 alert 弹框，用于提醒、警告用户简单扼要的信息，只有一个“确认”按钮，点击“确认”按钮后关闭弹框。
     * @param {string} content 弹窗内容
     * @param {function=} yes 点击确定按钮的回调
     * @param {object=} options 配置项
     * @param {string=} options.title 弹窗的标题
     * @param {string=} options.className 自定义类名
     * @param {array=} options.buttons 按钮配置项，详情参考dialog
     *
     * @example
     * $.ui.alert('普通的alert');
     * $.ui.alert('带回调的alert', function(){ console.log('ok') });
     * $.ui.alert('自定义标题的alert', { title: '自定义标题' });
     * $.ui.alert('带回调的自定义标题的alert', function(){
     *    console.log('ok')
     * }, {
     *    title: '自定义标题'
     * });
     * $.ui.alert('自定义按钮的alert', {
     *     title: '自定义按钮的alert',
     *     buttons: [{
     *         label: 'OK',
     *         type: 'primary',
     *         onClick: function(){ console.log('ok') }
     *     }]
     * });
     */
    $.ui['alert'] = function(content, yes, options) {
        var type = typeof yes === 'object';
        if (type) {
            options = yes;
        }

        options = $.extend({}, {
            content: content || '',
            buttons: [{
                label: '确定',
                type: 'primary',
                onClick: type ? function(){} : yes
            }]
        }, options);

        return Plugin(options);
    };

    //confirm
    /**
     * 确认弹窗
     * @param {string} content 弹窗内容
     * @param {function=} yes 点击确定按钮的回调
     * @param {function=} no  点击取消按钮的回调
     * @param {object=} options 配置项
     * @param {string=} options.title 弹窗的标题
     * @param {string=} options.className 自定义类名
     * @param {array=} options.buttons 按钮配置项，详情参考dialog
     *
     * @example
     * $.ui.confirm('普通的confirm');
     * $.ui.confirm('自定义标题的confirm', { title: '自定义标题' });
     * $.ui.confirm('带回调的confirm', function(){ console.log('yes') }, function(){ console.log('no') });
     * $.ui.confirm('带回调的自定义标题的confirm', function(){ console.log('yes') }, function(){ console.log('no') }, {
     *     title: '自定义标题'
     * });
     * $.ui.confirm('自定义按钮的confirm', {
     *     title: '自定义按钮的confirm',
     *     buttons: [{
     *         label: 'NO',
     *         type: 'default',
     *         onClick: function(){ console.log('no') }
     *     }, {
     *         label: 'YES',
     *         type: 'primary',
     *         onClick: function(){ console.log('yes') }
     *     }]
     * });
     */
    $.ui['confirm'] = function(content, yes, no, options) {
        var type = typeof yes === 'object';
        if (type) {
            options = yes;
        }

        options = $.extend({}, {
            content: content || '',
            buttons: [{
                label: '取消',
                type: 'default',
                onClick: type ? function(){} : no
            }, {
                label: '确定',
                type: 'primary',
                onClick: type ? function(){} : yes
            }]
        }, options);

        return Plugin(options);
    };

    /**
     * loading框
     * //显示页面级loading
     * $.ui.loading();
     * //关闭loading
     * $.ui.loading();
     *
     * @param seconds - 多少秒后关闭
     * @param text - 提示文字
     * @returns {*}
     */
    $.ui['loading'] = function (seconds, text) {
        if(seconds==undefined&&text==undefined){
            return $('.weui-loading-toast').remove();
        }
        /*if ($('.weui-loading-toast')[0]) {
         return $('.weui-loading-toast').remove();
         };*/

        var l = [];
        l.push('<div class="weui-loading-toast"><div class="weui-mask_transparent"></div>');
        l.push('<div class="weui-toast"><div class="weui-loading ui-loading">');
        for (var i = 0; i <= 11; i++) {
            l.push('<div class="weui-loading-leaf weui-loading-leaf-' + i + '"></div>');
        }
        l.push('</div>');
        l.push('<p class="weui-toast-content">' + (text ? text : '加载中') + '</p>');
        l.push('</div></div>');
        $(document.body ? document.body : 'body').append(l.join(''));

        //seconds 后自动关闭， 默认30s
        window.setTimeout(function () {
            if ($('.weui-loading-toast')[0]) {
                return $('.weui-loading-toast').remove();
            }
        }, (seconds ? seconds : 10) * 1000);
    };
})(Zepto);


// fadein fadeout
(function ($) {
    $.extend($.fn, {
        fadeIn: function (speed, easing, complete) {
            if (typeof(speed) === 'undefined') speed = 400;
            if (typeof(easing) === 'undefined') {
                easing = 'swing';
            } else if (typeof(easing) === 'function') {
                if (typeof(complete) === 'undefined') complete = easing;
                easing = 'swing';
            }

            $(this).css({
                display: 'block',
                opacity: 0
            }).animate({
                opacity: 1
            }, speed, easing, function () {
                // complete callback
                complete && typeof(complete) === 'function' && complete();
            });

            return this;
        },
        fadeOut: function (speed, easing, complete) {
            if (typeof(speed) === 'undefined') speed = 400;
            if (typeof(easing) === 'undefined') {
                easing = 'swing';
            } else if (typeof(easing) === 'function') {
                if (typeof(complete) === 'undefined') complete = easing;
                easing = 'swing';
            }

            $(this).css({
                opacity: 1
            }).animate({
                opacity: 0
            }, speed, easing, function () {
                $(this).css('display', 'none');
                // complete callback
                complete && typeof(complete) === 'function' && complete();
            });

            return this;
        },
        fadeToggle: function (speed, easing, complete) {
            return this.each(function () {
                var el = $(this);
                el[(el.css('opacity') === 0 || el.css('display') === 'none') ? 'fadeIn' : 'fadeOut'](speed, easing, complete)
            })
        }
    })
})(Zepto);