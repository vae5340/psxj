var serverName = GetQueryString("serverName");
var node;
var templateid_menu;
var templateid_view;
var roleId;
$(function () {
    $("#roleList").bootstrapTable({
        search: false,//显示搜索栏
        pagination: true,//显示分页
        clickToSelect: true,//点击选中行
        pageNumber: 1,//初始化加载第一页，默认第一页
        pageSize: 10,//每页记录的行数
        pageList: [5, 10, 20, 50, 100, 200],//分页可选页数
        paginationPreText: "上一页",
        paginationNextText: "下一页",
        sidePagination: "sever",//分页方式：client客户端分页，server服务端分页
        sortable: true,//是否启用排序
        singleSelect: true,
        clickToSelect: true,
        showRefresh: false,//刷新按钮
        iconSize: "outline",//图标尺寸
        columns: [{
            field: 'state',
            checkbox: 'true',
            events: 'actionEvents'
        }, {
            field: 'roleId',
            events: 'actionEvents',
            visible: false
        }, {
            field: 'roleCode',
            title: '角色编号',
            sortable: 'true'
        }, {
            field: 'roleName',
            title: '角色名称',
            sortable: 'true',
            align: 'center'
        }, {
            field: 'roleType',
            title: '角色类别',
            sortable: 'true',
            align: 'center'
        }],
        pagination: true,
        onClickRow: function (row, $element) {

        },
        onCheck: function (row) {
            roleId = row.roleId;
            Index.loadTemplateMenuTreeData();
            Index.loadTemplateViewTreeData();
        }
    });
    refreshData();
    Index.init();
});

function refreshData() {
    $.ajax({
        type: "post",
        data: $("#searchForm").serialize(),
        dataType: "json",
        url: "/" + serverName + "/asi/municipalBuild/xcyhLayout/wf-role-view-ref!getAcRole.action",
        async: false,
        success: function (ajaxResult) {
            if (ajaxResult.success) {
                var result = JSON.parse(ajaxResult.result);
                $('#roleList').bootstrapTable('load', result);
            }
        }
    });
}

var Index = {
    init: function () {
        this.getWfBusTemplateData();
        this.loadTemplateViewTreeData();
        this.loadTemplateMenuTreeData();
    },
    //任务视图树
    loadTemplateViewTreeData: function () {
        var setting = {
            isSimpleData: false,              //数据是否采用简单 Array 格式，默认false
            treeNodeKey: "id",               //在isSimpleData格式下，当前节点id属性
            nameCol: "name",            //在isSimpleData格式下，当前节点名称
            expandSpeed: "normal", //设置 zTree节点展开、折叠时的动画速度或取消动画(三种默认定义："slow", "normal", "fast")或 表示动画时长的毫秒数值(如：1000)
            showLine: false,                  //是否显示节点间的连线
            checkable: true,                  //每个节点上是否显示 CheckBox
            check: {
                enable: true,
                chkboxType: {"Y": "s", "N": "ps"}
            }
        };
        var zTree;
        templateid_view = $("#wftemplate_view_select").val();
        $.ajax({
            type: "post",
            data: {templateId: templateid_view, roleId: roleId},
            dataType: "json",
            url: "/" + serverName + "/asi/municipalBuild/xcyhLayout/wf-role-view-ref!getWfTemplateViewTree.action",
            async: false,
            success: function (result) {
                var list = result.result;
                zTree = $.fn.zTree.init($("#wftemplate_view_tree"), setting, list);
                var nodes = zTree.getNodes();
                zTree.expandNode(nodes[0], true, true);
            }
        });
    },
    //任务菜单树
    loadTemplateMenuTreeData: function () {
        templateid_menu = $("#wftemplate_menu_select").val();
        var param = {
            templateId: templateid_menu,
            roleId: roleId
        };

        var setting = {
            isSimpleData: false,              //数据是否采用简单 Array 格式，默认false
            treeNodeKey: "id",               //在isSimpleData格式下，当前节点id属性
            nameCol: "name",            //在isSimpleData格式下，当前节点名称
            expandSpeed: "normal", //设置 zTree节点展开、折叠时的动画速度或取消动画(三种默认定义："slow", "normal", "fast")或 表示动画时长的毫秒数值(如：1000)
            showLine: false,                  //是否显示节点间的连线
            checkable: true,                  //每个节点上是否显示 CheckBox
            check: {
                enable: true,
                chkboxType: {"Y": "s", "N": "ps"}
            }
        };

        $.ajax({
            type: "post",
            data: param,
            dataType: "json",
            url: "/" + serverName + "/asi/municipalBuild/xcyhLayout/wf-role-view-menu-ref!getTemplateViewMenuTree.action",
            async: false,
            success: function (result) {
                var list = result.result;
                var zTree = $.fn.zTree.init($("#wftemplate_menu_tree"), setting, list);
                var nodes = zTree.getNodes();
                zTree.expandNode(nodes[0], true, true);
            }
        });
    },
    //加载select的流程业务模板
    getWfBusTemplateData: function () {
        $.ajax({
            type: "post",
            data: {},
            dataType: "json",
            url: "/" + serverName + "/asi/municipalBuild/xcyhLayout/wf-template-view!getWfBusTemplateData.action",
            async: false,
            success: function (result) {
                var list = result.result;
                for (var item in list) {
                    var value = list[item];
                    $("#wftemplate_view_select").append("<option value='" + value.id + "'>" + value.templateName + "</option>");
                    $("#wftemplate_menu_select").append("<option value='" + value.id + "'>" + value.templateName + "</option>");
                }
            }
        });
    }
}

function loadtree_view() {
    Index.loadTemplateViewTreeData();
}
function loadtree_menu() {
    Index.loadTemplateMenuTreeData();
}

//保存数据
function saveRoleViewRef() {
    var param = {};
    //角色id
    var role = $('#roleList').bootstrapTable('getSelections');
    if (role.length > 0) {
        param.roleId = role[0].roleId;
    } else {
        alert('请选择用户');
        return;
    }
    //流程模版
    var divId = $('div.active').attr('id');
    var templateId = $('#' + divId + '_select').val();
    if (templateId) {
        param.templateId = templateId;
    } else {
        alert('请选择流程模版');
        return;
    }
    //视图或菜单树
    var treeId = divId + '_tree';
    $('#' + treeId).val();
    var checkedNodes = $.fn.zTree.getZTreeObj(divId + '_tree').getCheckedNodes(true);
    var checkedNodeId = '';
    var url = '';
    //两棵树的层数不同
    if (treeId == 'wftemplate_view_tree') {
        url = "/" + serverName + "/asi/municipalBuild/xcyhLayout/wf-role-view-ref!saveWfRoleViewRef.action";
        for (var i = 0; i < checkedNodes.length; i++) {
            var checkedNode = checkedNodes[i];
            if (checkedNode.level == 1) {
                if (checkedNodeId)
                    checkedNodeId += ',';
                checkedNodeId += checkedNode.id;
            }
        }
    } else {
        url = "/" + serverName + "/asi/municipalBuild/xcyhLayout/wf-role-view-menu-ref!saveWfRoleMenuRef.action";
        for (var i = 0; i < checkedNodes.length; i++) {
            var checkedNode = checkedNodes[i];
            if (checkedNode.level == 2) {
                if (checkedNodeId)
                    checkedNodeId += ',';
                checkedNodeId += checkedNode.id;
            }
        }
    }
    param.checkedNodeId = checkedNodeId;
    $.ajax({
        type: "post",
        data: param,
        dataType: "json",
        url: url,
        async: false,
        success: function (result) {
            if (result.success) {
                layer.alert('保存成功！！');
            } else {
                layer.alert('保存失败！！');
            }
        }
    });
}

function resetSearch() {
    $('#roleCode').val('');
    $('#roleName').val('');
}