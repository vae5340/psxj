/**
* jQuery EasyUI 1.4.3
* Copyright (c) 2009-2015 www.jeasyui.com. All rights reserved.
*
* Licensed under the GPL license: http://www.gnu.org/licenses/gpl.txt
* To use it on other terms please contact us at info@jeasyui.com
* http://www.jeasyui.com/license_commercial.php
*
* jQuery EasyUI tree 扩展
* jeasyui.extensions.tree.dataPlain.js
* 开发 流云
* 由 落阳 整理
* 最近更新：2015-10-18
*
* 依赖项：
*   1、jquery.jdirk.js
*
* Copyright (c) 2015 ChenJianwei personal All rights reserved.
*/
(function ($) {

    $.util.namespace("$.fn.tree.extensions");

    $.fn.tree.extensions.dataPlainConverter = function (data, opts) {
        data = data || [];
        var ret = data, idField = opts.idField || "id", parentField = opts.parentField || "pid";
        if (opts.dataPlain) {
            var roots = $.array.filter(data, function (val) {
                if (val[parentField] == null || val[parentField] == undefined) { return true; }
                return !$.array.some(data, function (value) { return val[parentField] == value[idField]; });
            });
            var findChildren = function (array, value) {
                var temps = $.array.filter(array, function (val) {
                    return val[parentField] == null || val[parentField] == undefined ? false : val[parentField] == value[idField];
                });
                return $.array.map(temps, function (val) {
                    var children = findChildren(array, val);
                    if (children.length) {
                        val.children = $.array.likeArray(val.children) && !$.util.isString(val.children) ? val.children : [];
                        $.array.merge(val.children, children);
                    }
                    return val;
                });
            };
            ret = $.array.map(roots, function (val) {
                var children = findChildren(data, val);
                if (children.length) {
                    val.children = $.array.likeArray(val.children) && !$.util.isString(val.children) ? val.children : [];
                    $.array.merge(val.children, children);
                }
                return val;
            });
        }
        return ret;
    };

    var _loadFilter = $.fn.tree.extensions._loadFilter = $.fn.tree.defaults.loadFilter;
    var loadFilter = $.fn.tree.extensions.loadFilter = function (data, parent) {
        if ($.isFunction($.fn.tree.extensions._loadFilter)) { data = $.fn.tree.extensions._loadFilter.apply(this, arguments); }
        data = $.array.likeArray(data) && !$.util.isString(data) ? data : [];
        if (!data.length) { return data; }
        var t = $(this), opts = t.tree("options");
        return opts.dataPlain ? $.fn.tree.extensions.dataPlainConverter(data, opts) : data;
    };

    var defaults = $.fn.tree.extensions.defaults = {

        //  扩展 easyui-tree 的自定义属性，表示当前 easyui-tree 控件是否支持平滑数据格式。
        //  当支持平滑数据格式时，数据元素中不需要通过指定 children 来指定子节点，而是支持通过 pid 属性来指示其父级节点。
        //  Boolean 类型值，默认为 false。
        dataPlain: false,

        //  扩展 easyui-tree 的自定义属性，表示当前 easyui-tree 控件支持平滑数据格式时，用哪个 field 表示当前行数据的父级节点 idField 值
        //  String 类型值，默认为 "pid"。
        parentField: "pid",

        //  重写 easyui-tree 的 loadFilter 属性，以支持平滑数据格式。
        loadFilter: loadFilter
    };

    var methods = $.fn.tree.extensions.methods = {

        
    };


    $.extend($.fn.tree.defaults, defaults);
    $.extend($.fn.tree.methods, methods);

})(jQuery);