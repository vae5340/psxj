/**
 * jQuery EasyUI 1.4.3
 * Copyright (c) 2009-2015 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the GPL license: http://www.gnu.org/licenses/gpl.txt
 * To use it on other terms please contact us at info@jeasyui.com
 * http://www.jeasyui.com/license_commercial.php
 *
 * jQuery EasyUI treegrid 扩展
 * jeasyui.extensions.treegrid.livesearch.js
 * 开发 流云
 * 由 落阳 整理
 * 最近更新：2016-03-11
 *
 * 依赖项：
 *   1、jquery.jdirk.js
 *
 * Copyright (c) 2016 ChenJianwei personal All rights reserved.
 */
(function ($) {

    $.util.namespace("$.fn.treegrid.extensions");

    var liveSearch = function (target, param) {
        var t = $(target), panel = t.treegrid("getPanel"), opts = t.treegrid("options"), treeField = opts.treeField,
            cells, field, value = param, regular = false, ignoreCase = true, regexp;
        if ($.isPlainObject(param)) {
            value = param.value;
            field = param.field;
            regular = param.regular;
            ignoreCase = param.ignoreCase;
            cells = panel.find("div.datagrid-body tr.datagrid-row td[" + (field ? "field=" + field : "field") + "] div.datagrid-cell");
        } else {
            cells = panel.find("div.datagrid-body tr.datagrid-row td[field] div.datagrid-cell");
        }
        regexp = regular ? new RegExp(value, ignoreCase ? "gm" : "igm") : value;
        cells.each(function () {
            var cell = $(this), td = cell.parent(), field = td.attr("field");
            if (field == treeField) { cell = cell.find("span.tree-title"); }
            cell.find("span.datagrid-cell-hightlight").replaceWith(function () { return $(this).text(); });
            if (!value) { return; }
            var text = cell.html(); if (!text) { return; }
            cell.html($.string.replaceAll(text, value, "<span class='datagrid-cell-hightlight'>" + value + "</span>"));
        });
    };

    var clearLiveHighLight = function (target, field) {
        var t = $(target), panel = t.treegrid("getPanel"), opts = t.treegrid("options"), treeField = opts.treeField, cells;
        if (field == null || field == undefined) {
            cells = panel.find("div.datagrid-body tr.datagrid-row td[field] div.datagrid-cell");
        }
        else {
            cells = panel.find("div.datagrid-body tr.datagrid-row td[field=" + String(field) + "] div.datagrid-cell");
        }

        cells.each(function () {
            var cell = $(this), td = cell.parent(), field = td.attr("field");
            if (field == treeField) { cell = cell.find("span.tree-title"); }
            cell.find("span.datagrid-cell-hightlight").replaceWith(function () { return $(this).text(); });
        });
    };

    var defaults = $.fn.treegrid.extensions.defaults = {

    };

    var methods = $.fn.treegrid.extensions.methods = {

        //  扩展 easyui-treegrid 的自定义方法；对当前 easyui-treegrid 中进行高亮关键词查询；该方法的 param 可以定义为如下两种类型：
        //      1、String 类型值：表示要对所有列进行的高亮查询关键词；
        //      2、JSON-Object：表示对特定列进行高亮查询的参数，该对象类型参数包含如下属性：
        //          field:      表示要进行高亮查询的列；
        //          value:      表示要进行高亮查询的关键词；
        //          regular:    Boolean 类型值，默认为 false；指示该关键词是否为正则表达式；
        //          ignoreCase: Boolean 类型值，默认为 true；指示高亮查询时是否忽略大小写。
        //  返回值：返回表示当前 easyui-treegrid 组件的 jQuery 链式对象。
        liveSearch: function (jq, param) { return jq.each(function () { liveSearch(this, param); }); },

        //  扩展 easyui-treegrid 的自定义方法；清除当前 easyui-treegrid 中进行高亮关键词查询后产生的高亮效果；该方法的 field 可以定义为如下类型：
        //      1、String 类型值：表示要对特定列的高亮效果进行清除，不提供该参数则表示要清除所有列的高亮效果；
        //  返回值：返回表示当前 easyui-treegrid 组件的 jQuery 链式对象。
        clearLiveHighLight: function (jq, field) { return jq.each(function () { clearLiveHighLight(this, field); }); }
    };


    $.extend($.fn.treegrid.defaults, defaults);
    $.extend($.fn.treegrid.methods, methods);

})(jQuery);