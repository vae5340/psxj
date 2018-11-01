var serverName = GetQueryString("serverName");
var node = null;
var curId;
var state;
var Index = {
    init: function () {
        var that = this;
        this.vm = new ViewModel();
        ko.applyBindings(this.vm);
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
        //self.getTemplateData();
    },
    loadTreeData: function () {
        var that = this;
        //this.metadatatable.templateName("ceshi");
        var setting = {
            isSimpleData: false,              //数据是否采用简单 Array 格式，默认false
            treeNodeKey: "id",               //在isSimpleData格式下，当前节点id属性
            treeNodeParentKey: "seniorid",        //在isSimpleData格式下，当前节点的父节点id属性
            nameCol: "name",            //在isSimpleData格式下，当前节点名称
            expandSpeed: "slow", //设置 zTree节点展开、折叠时的动画速度或取消动画(三种默认定义："slow", "normal", "fast")或 表示动画时长的毫秒数值(如：1000)
            showLine: true,                  //是否显示节点间的连线
            checkable: true,                  //每个节点上是否显示 CheckBox
            callback: {
                onClick: zTreeOnClick
            }

        };
        var zTree;
        var requestURL = "";
        requestURL = "/" + serverName + "/asi/municipalBuild/facilityLayout/metadatacategory!getMetadatacategoryTree.action";
        $.ajax({
            type: "post",
            data: {},
            dataType: "json",
            url: requestURL,
            async: false,
            success: function (result) {
                var list = result.result;
                zTree = $.fn.zTree.init($("#Metadatacategory_tree"), setting, list);
                var nodes = zTree.getNodes();
                zTree.expandNode(nodes[0], true,false);
                if(node != null){
                    var node1 = zTree.getNodeByParam("id", node.iconSkin == 'icon_group'?node.id:node.seniorid, null);
                    zTree.expandNode(node1, true, false, true);
                    zTree.selectNode(node);
                }
            }
        });

    },
    refreshList: function () {
    }
}
Index.init();

//创建一个View对象
function ViewModel() {
    var self = this;
    self.metadatacategory = {};
    self.metadatacategory.ID = ko.observable();
    self.metadatacategory.metaDataCategoryName = ko.observable();
    self.metadatacategory.displayName = ko.observable();
    self.metadatacategory.state = ko.observable();
    self.metadatacategory.belongToFacMan = ko.observable();
    self.addMetadatacategory = addMetadatacategory;
    self.saveMetadatacategory = saveMetadatacategory;
    self.deleteMetadatacategory = deleteMetadatacategory;
};

function zTreeOnClick(event, treeId, treeNode) {
    node = treeNode;
    var treeObj = $.fn.zTree.getZTreeObj("Metadatacategory_tree");
    var nodes = treeObj.getSelectedNodes();
    if (nodes.length>0) {
        treeObj.expandNode(nodes[0], true, false, true);
    }
    $('#metadatacategory_nav a[href="#metadatacategory_add_tab"]').tab('show');
    if (curId == node.id) {

    } else {
        curId = node.id;
        getMetadatacategoryData();
    }
};

function addMetadatacategory() {
    if (node == null) {
        layer.alert('请选择市政设施！！');
    } else if (state == "leaf") {
        layer.alert('叶子节点下不能再次新增！！');
    } else {
        $('#metadatacategory_nav a[href="#Metadatacategory_add_tab"]').tab('show');
        cleanForm();
    }
}

function saveMetadatacategory() {
    if (node == null) {
        layer.alert('请选择市政设施！！');
    } else {
        var flag = $("#myform").valid();
        if (flag) {
            var metadatacategory = {
                metadatacategoryid: node.id
            };
            for (var i in Index.vm.metadatacategory) {

                metadatacategory[i] = Index.vm.metadatacategory[i]();

            }
            var requestURL = "";
            requestURL = "/" + serverName + "/asi/municipalBuild/facilityLayout/metadatacategory!saveMetadatacategoryData.action";
            $.ajax({
                type: "post",
                data: metadatacategory,
                dataType: "json",
                url: requestURL,
                async: false,
                success: function (result) {
                    if (result.success) {
                        layer.alert('保存成功！！');
                        Index.loadTreeData();
                        $("#state").attr("disabled", true);
                    }
                }
            });
        }
    }
}
function cleanForm() {
    curId = "";
    Index.vm.metadatacategory.ID("");
    Index.vm.metadatacategory.metaDataCategoryName("");
    Index.vm.metadatacategory.displayName("");
    Index.vm.metadatacategory.state("");
    Index.vm.metadatacategory.belongToFacMan("");
    $("#state").attr("disabled",false);
}
function getMetadatacategoryData() {
    var metadatacategory = {
        metadatacategoryid: node.id
    };
   var parentNode = node.getParentNode();
    var parentBelongtoValue = parentNode.belongtofacman;
    for (var i in Index.vm.metadatacategoryid) {
        metadatacategory[i] = Index.vm.metadatacategory[i]();
    }
    var requestURL = "";
    requestURL = "/" + serverName + "/asi/municipalBuild/facilityLayout/metadatacategory!getMetadatacategoryData.action";
    $.ajax({
        type: "post",
        data: metadatacategory,
        dataType: "json",
        url: requestURL,
        async: false,
        success: function (result) {
            var list = result.result;
            for (var item in list) {
                var value = list[item];
                Index.vm.metadatacategory.ID(value.id);
                Index.vm.metadatacategory.metaDataCategoryName(value.metadatacategoryname);
                Index.vm.metadatacategory.displayName(value.displayname);
                Index.vm.metadatacategory.state(value.state);
                Index.vm.metadatacategory.belongToFacMan(value.belongtofacman);
                state = value.state;
                $("#state").attr("disabled",true);
                if(parentBelongtoValue == 0){
                    $("#belongToFacMan").attr("disabled",true);
                }else{
                    $("#belongToFacMan").attr("disabled",false);
                }

            }
        }
    });
}

function deleteMetadatacategory() {
    if (node == null) {
        layer.alert('请选择市政设施！！');
    } else {
        layer.confirm('确定要删除该菜单及其子菜单吗？', {
            btn: ['确定', '取消'] //按钮
        }, function () {
            var metadatacategory = {
                metadatacategoryid: node.id
            };
            for (var i in Index.vm.metadatacategory) {
                metadatacategory[i] = Index.vm.metadatacategory[i]();
            }
            var requestURL = "";
            requestURL = "/" + serverName + "/asi/municipalBuild/facilityLayout/metadatacategory!delMetadatacategoryData.action";
            $.ajax({
                type: "post",
                data: metadatacategory,
                dataType: "json",
                url: requestURL,
                async: false,
                success: function (result) {
                    if (result.success) {
                        layer.alert('删除成功！！');
                        cleanForm();
                        Index.loadTreeData();
                    }
                }
            });
        }, function () {
            return ;
        });
    }
}
