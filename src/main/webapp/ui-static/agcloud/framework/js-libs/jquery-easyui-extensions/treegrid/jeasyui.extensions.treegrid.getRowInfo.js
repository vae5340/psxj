/**
 * jQuery EasyUI 1.4.3
 * Copyright (c) 2009-2015 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the GPL license: http://www.gnu.org/licenses/gpl.txt
 * To use it on other terms please contact us at info@jeasyui.com
 * http://www.jeasyui.com/license_commercial.php
 *
 * jQuery EasyUI treegrid 扩展
 * jeasyui.extensions.treegrid.getRowInfo.js
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


    var getRows = function (target, cascade) {
        var t = $(target), rows = t.treegrid("getRoots"), opts = t.treegrid("options");
        rows = rows && rows.length ? rows : [];
        return cascade ? $.array.reduce(rows, function (prev, val, index) {
            prev.push(val);
            var cc = t.treegrid("getChildren", val[opts.idField]);
            if (cc && cc.length) { $.array.merge(prev, cc); }
            return prev;
        }, []) : rows;
    };

    $.extend($.fn.treegrid.extensions, {
        find: $.fn.treegrid.methods.find
    });
    var findRow = function (target, param, grid) {
        var t = grid || $(target);
        if (!$.isFunction(param)) { return $.fn.treegrid.extensions.find.call(target, t, param); }
        var rows = getRows(target, true);
        return $.array.first(rows, param);
    };

    var getNode = function (target, id) {
        return $(target).treegrid("find", id);
    };

    var findRows = function (target, param) {
        var t = $(target), ret;
        if ($.isFunction(param)) {
            ret = $.array.filter(getRows(target, true), param);
        } else if ($.array.likeArray(param) && !$.util.isString(param)) {
            ret = $.array.map(param, function (val) { return findRow(target, val, t); });
            ret = $.array.filter(ret, function (val) { return val != undefined && val != null; });
        } else {
            ret = [findRow(target, param, t)];
        }
        return ret;
    };

    var getRowDom = function (target, param) {
        param = $.isPlainObject(param) ? param : { id: param, cascade: false };
        var id = param.id, cascade = param.cascade ? true : false,
            t = $(target), opts = t.treegrid("options"), panel = t.treegrid("getPanel"),
            dom = panel.find(".datagrid-view .datagrid-body tr.datagrid-row[node-id=" + id + "]");
        if (cascade) {
            var children = t.treegrid("getChildren", id);
            $.each(children, function (i, n) { var d = getRowDom(target, n[opts.idField]); dom = dom.add(d); });
        }
        return dom;
    };

    var getNextRow = function (target, id) {
        var t = $(target);
        var row = t.treegrid("getRowDom", id).nextAll("tr.datagrid-row:first"), rowId = row.attr("node-id");
        if (!row.length || !rowId) { return null; }
        return t.treegrid("find", rowId);
    };

    var getPrevRow = function (target, id) {
        var t = $(target);
        var row = t.treegrid("getRowDom", id).prevAll("tr.datagrid-row:first"), rowId = row.attr("node-id");
        if (!row.length || !rowId) { return null; }
        return t.treegrid("find", rowId);
    };

    var isRootNode = function (target, id) {
        var t = $(target), roots = t.treegrid("getRoots"), node = t.treegrid("find", id);
        return node && $.array.contains(roots, node);
    };

    var getNears = function (target, id) {
        var t = $(target), opts = t.treegrid("options");
        if (isRootNode(target, id)) { return t.treegrid("getRoots"); }
        var p = t.treegrid("getParent", id);
        if (!p) { return t.treegrid("getRoots"); }
        return getNearChildren(target, p[opts.idField]);
    };

    var getNearChildren = function (target, id) {
        var t = $(target), opts = t.treegrid("options"),
            children = t.treegrid("getChildren", id);
        return $.array.filter(children, function (val) { return t.treegrid("getParent", val[opts.idField])[opts.idField] == id; });
    };

    var defaults = $.fn.treegrid.extensions.defaults = {

    };

    var methods = $.fn.treegrid.extensions.methods = {

        //  扩展 easyui-treegrid 的自定义方法；获取 easyui-treegrid 中当前页的行数据(包括根节点和子节点)所构成的一个集合；该方法的参数 cascade 定义为如下类型：
        //      Boolean 类型，默认为 false，表示是否连同子级节点数据一并返回；
        //  返回值：返回一个 Array 数组对象，数组中的每一个元素都表示一个 node；
        //      如果 cascade 为 true，则返回所有根节点以及子节点合并所构成的一个数组；
        //      如果 cascade 为 false，则仅返回所有根节点数据，同 getRoots 方法；
        //      如果 easyui-treegrid 的当前页没有数据，则返回一个长度为 0 的数组。
        getRows: function (jq, cascade) { return getRows(jq[0], cascade); },

        //  重写 easyui-treegrid 的原生方法 find，使之功能更加丰富。
        //  获取当前 easyui-treegrid 当前页指定 idField(主键) 的节点对象并返回；该方法的参数 param 可以定义为如下两种类型：
        //      待查找的行数据的 idField(主键) 字段值；
        //      function 类型，该回调函数签名为 function(row, index, rows)，其中 row 表示行数据对象、index 表示行索引号、rows 表示当前 easyui-treegrid 所有节点对象集合；
        //          如果 param 参数为 function 类型，则 findRow 方法会对当前 easyui-treegrid 的当前页的每一行数据调用该回调函数；
        //          当回调函数返回 true 时，则表示找到需要查找的结果，立即停止循环调用并返回该行数据；
        //          如果回调函数始终未返回 true，则该回调函数会一直遍历 rows 直到最后并返回 null。
        //  返回值：返回一个 JSON-Object，表示一个行节点数据对象；如果未找到相应数据，则返回 null。
        find: function (jq, param) { return findRow(jq[0], param); },

        //  扩展 easyui-treegrid 的自定义方法；获取当前 easyui-treegrid 中当前页指定 idField(主键) 的节点数据对象；同 find 方法。
        getNode: function (jq, id) { return getNode(jq[0], id); },

        //  扩展 easyui-treegrid 的自定义方法；获取当前 easyui-treegrid 中当前页指定 idField(主键) 的节点数据对象；同 find 方法。
        findRow: function (jq, param) { return findRow(jq[0], param); },

        //  扩展 easyui-treegrid 的自定义方法；获取当前 easyui-treegrid 当前页上的指定行数据集合并返回；该方法的参数 param 可以定义为如下两种类型：
        //      Function 类型，该回调函数签名为 function(row, index, rows)，其中 row 表示行数据对象、index 表示行索引号、rows 表示当前 easyui-treegrid 所有节点对象集合；
        //          如果 param 参数为 Function 类型，则 findRows 方法会对当前 easyui-treegrid 的当前页的每一行数据调用该回调函数；
        //          当回调函数返回 true 时，则返回的结果集中将会包含该行数据；
        //          如果该回调函数始终未返回 true，则该方法最终返回一个长度为 0 的数组对象。
        //      Array 类型，数组中的每一项都可以定义为如下类型：
        //          待查找的行数据的 idField(主键) 字段值；
        //          Function 类型；具体回调函数签名参考 findRow 方法中 param 参数为 function 类型时的定义；
        //          当 param 参数定义为 Array 类型时，则 findRows 方法会对数组中的每一项循环调用 findRow 方法，并过滤掉 findRow 方法返回 null 的结果行；
        //  返回值：返回一个 Array 数组对象；数组中的每一项都是 JSON-Object 类型，表示一个行数据对象；如果未找到相应数据，则返回一个长度为 0 的数组对象。
        findRows: function (jq, param) { return findRows(jq[0], param); },

        //  扩展 easyui-treegrid 的自定义方法；获取当前 easyui-treegrid 当前页上的多个节点所构成的一个数据集合；同 findRows 方法。
        getNodes: function (jq, param) { return findRows(jq[0], param); },

        //  扩展 easyui-treegrid 的自定义方法；获取 easyui-treegrid 中当前页指定行节点的 DOM-jQuery 对象元素集合；该方法的参数 param 可以定义为以下两种类型：
        //      1、表示要获取的行节点的 idField(主键) 值；
        //      2、JSON-Object 对象，该对象需定义如下属性：
        //          id:     表示要获取的行节点的 idField(主键) 值；
        //          cascade:Boolean 类型值，默认为 false，表示是否连同其子级节点的 DOM 行对象一并获取并返回。
        //  返回值：如果当前页存在 idField(主键) 指示的行，则返回该行的 DOM-jQuery 对象集合，该集合中包含的 DOM 节点级别为一组 tr class="datagrid-row" 对象；
        //          否则返回一个空的 jQuery 对象。
        getRowDom: function (jq, param) { return getRowDom(jq[0], param); },

        //  扩展 easyui-treegrid 的自定义方法；获取指定节点的平级下一格位置的 tree-node 节点；该方法定义如下参数：
        //      id:  指定的表示 tree-node 对象的 idField 值；
        //  返回值：返回 tree-node idField 的同级别下一格位置的 tree-node 节点 node 对象；
        //      如果该 tree-node idField 为当前级别的最后一个节点即没有下一格节点；则返回 null。
        nextRow: function (jq, id) { return getNextRow(jq[0], id); },

        //  扩展 easyui-treegrid 的自定义方法；获取指定节点的平级上一格位置的 tree-node 节点；该方法定义如下参数：
        //      id:  指定的表示 tree-node 对象的 idField 值；
        //  返回值：返回 tree-node idField 的同级别上一格位置的 tree-node 节点对象；该 tree-node 对象含有如下属性：
        //      如果该 tree-node idField 为当前级别的第一个节点即没有上一格节点；则返回 null。
        prevRow: function (jq, id) { return getPrevRow(jq[0], id); },

        //  扩展 easyui-treegrid 的自定义方法；获取指定节点的同级所有节点(包含自身)；该方法定义如下参数：
        //      id:  指定的表示 tree-node 对象的 idField 值；
        //  返回值：返回 tree-node idField 的同级别(具有和当前 tree-node idField 同一个父级节点)所有节点构成的一个数组对象；
        //      如果传入的参数 id 是某个根节点的 idField 或者未定义 idField 参数，则该方法和 getRoots 方法返回的值相同；
        getNears: function (jq, id) { return getNears(jq[0], id); },

        //  扩展 easyui-treegrid 的自定义方法；获取指定节点的下一级所有节点；该方法定义如下参数：
        //      id:  指定的表示 tree-node 对象的 idField 值；
        //  返回值：返回 tree-node id 的下一级所有节点构成的一个数组对象；
        //      如果传入的参数 id 没有子节点，则返回一个包含 0 个元素的数组。
        //  备注：该方法和 getChildren 的不同之处在于，getChildren 方法返回的是 tree-node id 下的所有子节点内容；
        getNearChildren: function (jq, id) { return getNearChildren(jq[0], id); }
    };


    $.extend($.fn.treegrid.defaults, defaults);
    $.extend($.fn.treegrid.methods, methods);

})(jQuery);