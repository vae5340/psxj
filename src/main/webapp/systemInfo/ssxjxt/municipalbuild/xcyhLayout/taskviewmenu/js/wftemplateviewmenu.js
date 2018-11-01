var serverName = GetQueryString("serverName");
var node;
var curId;
var templateid;
var Index = {
    init: function () {
        var that = this;
        that.getWfBusTemplateData();
        that.renderUI();
        that.bindUI();
    },
    beforeRenderUI: function (callback) {

    },
    renderUI: function (data) {
        var self = this;
        self.loadTreeData();
    },
    bindUI: function () {
        var self = this;
    },
    loadTreeData: function () {
        var that = this;
        var setting = {
            isSimpleData: false,              //数据是否采用简单 Array 格式，默认false
            treeNodeKey: "id",               //在isSimpleData格式下，当前节点id属性
            nameCol: "name",            //在isSimpleData格式下，当前节点名称
            expandSpeed: "slow", //设置 zTree节点展开、折叠时的动画速度或取消动画(三种默认定义："slow", "normal", "fast")或 表示动画时长的毫秒数值(如：1000)
            showLine: false,                  //是否显示节点间的连线
            checkable: true,                  //每个节点上是否显示 CheckBox
            callback: {
                onClick: zTreeOnClick
            }

        };
        var zTree;
        templateid = $("#wfbustemplate").val();
        var requestURL = "";
        requestURL = "/" + serverName + "/asi/municipalBuild/xcyhLayout/wf-template-view!getWfTemplateViewTree.action";
        $.ajax({
            type: "post",
            data: {templateid:templateid},
            dataType: "json",
            url: requestURL,
            async: false,
            success: function (result) {
                var list = result.result;
                zTree = $.fn.zTree.init($("#Wftemplateview_tree"), setting, list);
                var nodes = zTree.getNodes();
                zTree.expandNode(nodes[0], true,false);

                var tNode = {};
                tNode.id = -1
                zTreeOnClick(null, null, tNode);
            }
        });

    },
    getWfBusTemplateData: function () {
        var requestURL = "";
        requestURL = "/" + serverName + "/asi/municipalBuild/xcyhLayout/wf-template-view!getWfBusTemplateData.action";
        $.ajax({
            type: "post",
            data: {},
            dataType: "json",
            url: requestURL,
            async: false,
            success: function (result) {
                var list = result.result;
                for (var item in list) {
                    var value = list[item];
                    $("#wfbustemplate").append("<option value='" + value.id + "'>" + value.templateName + "</option>");
                }
            }
        });
    },
    refreshList: function () {
    }
}
Index.init();

function zTreeOnClick(event, treeId, treeNode) {
    node = treeNode;
    var treeObj = $.fn.zTree.getZTreeObj("Wftemplateview_tree");
    var nodes = treeObj.getSelectedNodes();
    if (nodes.length>0) {
        treeObj.expandNode(nodes[0], true, false, true);
    }
    $('#wftemplateview_nav a[href="#wftemplateview_add_tab"]').tab('show');
    if (curId < 0 || curId != node.id) {
        curId = node.id;
        getWftemplateviewData();
    }
};

function saveWfTemplateViewMenuData() {
    if (node.id <= 0) {
        layer.alert('此节点不能进行保存操作!');
        return false;
    }

    templateid = $("#wfbustemplate").val();

    var treeObj = $.fn.zTree.getZTreeObj("wf-template-view-menu-tree");
    var checkedNodes = treeObj.getCheckedNodes(true);
    var nodes = new Array();
    for (var i = 0; i < checkedNodes.length; i++) {
        var newNode = checkedNodes[i];
        if (newNode.level == 2)
            nodes.push(newNode);
    }

    var ids = "";
    if (nodes.length > 0) {
        for (var i = 0; i < nodes.length; i++) {
            var newNode = nodes[i];
            if (i > 0)
                ids += ",";
            ids += newNode.id;
        }
    }

    var requestURL = "/" + serverName + "/asi/municipalBuild/xcyhLayout/wf-template-view-menu-ref!saveWfTemplateViewMenuData.action";
    var param = {
        templateId: templateid,
        viewId: node.id,
        elementIds: ids
    };
    $.ajax({
        type: "post",
        data: param,
        dataType: "json",
        url: requestURL,
        async: false,
        success: function (result) {
            if (result.success) {
                layer.alert('保存成功！！');
            }
        }
    });
}

function getWftemplateviewData() {

    var param = {
        viewId: node.id,
        templateId: templateid
    };

    var setting = {
        isSimpleData: false,              //数据是否采用简单 Array 格式，默认false
        treeNodeKey: "id",               //在isSimpleData格式下，当前节点id属性
        nameCol: "name",            //在isSimpleData格式下，当前节点名称
        check: {
            enable: true,
            chkboxType: { "Y" : "s", "N" : "ps"}
        },
        view: {
            showIcon: false,                //是否显示节点图标
            //showLine: false,                  //是否显示节点间的连线
            expandSpeed: "slow", //设置 zTree节点展开、折叠时的动画速度或取消动画(三种默认定义："slow", "normal", "fast")或 表示动画时长的毫秒数值(如：1000)
        },
        callback: {
        }

    };

    var requestURL = "";
    requestURL = "/" + serverName + "/asi/municipalBuild/xcyhLayout/wf-template-view-menu-ref!getWfTemplateViewMenuTree.action";
    $.ajax({
        type: "post",
        data: param,
        dataType: "json",
        url: requestURL,
        async: false,
        success: function (result) {
            var list = result.result;
            var zTree = $.fn.zTree.init($("#wf-template-view-menu-tree"), setting, list);
            zTree.expandAll(true);
        }
    });
}

function startloadtree(){
    Index.loadTreeData();
}