/**
* jQuery EasyUI 1.4.3
* Copyright (c) 2009-2015 www.jeasyui.com. All rights reserved.
*
* Licensed under the GPL license: http://www.gnu.org/licenses/gpl.txt
* To use it on other terms please contact us at info@jeasyui.com
* http://www.jeasyui.com/license_commercial.php
*
* jQuery EasyUI combotree 扩展
* jeasyui.extensions.combotree.js
* 开发 流云
* 由 落阳 整理
* 最近更新：2016-02-29
*
* 依赖项：
*   1、jquery.jdirk.js
*   2、jeasyui.extensions.tree.xxx.js (想继承 easyui-tree 的什么扩展，就引用相应的扩展文件。)
*
* Copyright (c) 2015 ChenJianwei personal All rights reserved.
*/
(function ($) {

    $.util.namespace("$.fn.combotree.extensions");

    var defaults = $.fn.combotree.extensions.defaults = ($.fn.tree && $.fn.tree.extensions) ? $.extend({}, $.fn.tree.extensions.defaults, {

        //  扩展 easyui-combotree 的自定义属性；更改继承于 easyui-tree 的自定义属性 toggleOnClick 的默认值，使得 easyui-combotree 中 tree 组件的页节点在点击后不自动展开/折叠子节点；
        //  Boolean 类型，默认为 false。
        toggleOnClick: false
    }) : {};

    var methods = $.fn.combotree.extensions.methods = {


    };


    $.extend($.fn.combotree.defaults, defaults);
    $.extend($.fn.combotree.methods, methods);

})(jQuery);