var serverName = GetQueryString("serverName");
var node = null;
var curTableid;
var index = 0;

var Index = {
    init: function () {
        var that = this;
        this.vm = new ViewModel();
        ko.applyBindings(this.vm);
        that.renderUI();
        that.bindUI();
        that.validateForm();
    },
    beforeRenderUI: function (callback) {

    },
    renderUI: function (data) {
        var self = this;
        self.loadTreeData();
    },
    bindUI: function () {
        $(".tablefield-add").on("click", function (evt) {
            addTableFieldEdit();
        });
        $(".tablefield-del").on("click", function (evt) {
            delTableFieldEdit();
        });

        $("#tableType").on("change", function (evt) {
            if ($("#tableType").val() == "1") {
                $("#layerType").show();
            } else {
                $("#layerType").hide();
            }
        });
    },
    validateForm: function () {
        $('#defaultForm').bootstrapValidator({
            message: 'This value is not valid',
            feedbackIcons: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                referenceTable: {
                    validators: {
                        callback: {
                            message: '输入名需加表用户如：agme.aa',
                            callback: function (value, validator) {
                                var index = value.indexOf(".");
                                return index > 0;
                            }
                        }
                    }
                },
                templateclassname: {
                    validators: {
                        notEmpty: {
                            message: '字段不能为空'
                        }
                    }
                },
                displayname: {
                    validators: {
                        notEmpty: {
                            message: '字段不能为空'
                        }
                    }
                }
            }
        });
    },
    loadTreeData: function () {
        var that = this;
        var setting = {
            isSimpleData: false,              //数据是否采用简单 Array 格式，默认false
            treeNodeKey: "id",                //在isSimpleData格式下，当前节点id属性
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
        requestURL = "/" + serverName + "/asi/municipalBuild/facilityLayout/metatemplateclass!getMetatemplateclassTree.action";
        $.ajax({
            type: "post",
            data: {},
            dataType: "json",
            url: requestURL,
            async: false,
            success: function (result) {
                var list = result.result;
                zTree = $.fn.zTree.init($("#metadatatable_tree"), setting, list);
                var nodes = zTree.getNodes();
                zTree.expandNode(nodes[0], true,false);
                if(node != null){
                    var node1 = zTree.getNodeByParam("id", node.iconSkin == 'icon_group'?node.id:node.seniorid, null);
                    zTree.expandNode(node1, true, false, true);
                    zTree.selectNode(node);
                }
            }
        });
        getMetatemplateclassList(0)
    },
    refreshList: function () {
    }
}
Index.init();

//创建一个View对象
function ViewModel() {
    var self = this;
    self.metatemplateclasslist = ko.observable();
    self.metatemplateclass = {};
    self.metatemplateclass.id = ko.observable();
    self.metatemplateclass.templateclassid = ko.observable();
    self.metatemplateclass.templateclassname = ko.observable();
    self.metatemplateclass.displayname = ko.observable();
    self.metatemplateclass.templateclassdesc = ko.observable();
    self.metatemplateclass.fieldstatecode = ko.observable();
    self.metatemplateclass.referenceTable = ko.observable();
    self.addMetatemplateclass = addMetatemplateclass;
    self.saveMetatemplateclass = saveMetatemplateclass;
    self.sortMetatemplateclass = sortMetatemplateclass;
    self.deleteMetatemplateclass = deleteMetatemplateclass;
    self.getTableField = getTableField;
};

function zTreeOnClick(event, treeId, treeNode) {
    node = treeNode;
    if (treeNode.iconCls == "icon-template") {
        $('#metadatatable_nav a[href="#metadatatable_add_tab"]').tab('show');
        getMetatemplateclassData();
        getMetatemplateclassList(node.seniorid);
    } else {
        for (var i in Index.vm.metatemplateclass) {
            Index.vm.metatemplateclass[i]("");
        }
        $("#editDetailTableField").empty();
        getMetatemplateclassList(node.id);
        $('#metadatatable_nav a[href="#metadatatable_list_tab"]').tab('show');
    }
    curTableid = node.id;
};

function getMetatemplateclassList(nodeid){
    var metatemplateclass = {
        metadatacategoryid:nodeid
    }
    $.ajax({
        type:'post',
        url:"/" + serverName + "/asi/municipalBuild/facilityLayout/metatemplateclass!getMetatemplateclassList.action",
        data:metatemplateclass,
        dataType:'json',
        success:function(result){
            if(result.result != ""){
                var rlt = result.result;
                for(var i=0;i<rlt.length;i++){
                    if(rlt[i].templateclassdesc == undefined){
                        rlt[i].templateclassdesc = "";
                    }
                }
                Index.vm.metatemplateclasslist(rlt);
            }
        }
    })
}

function getMetatemplateclassData() {
    $(".tablefield-add").show();
    $(".tablefield-del").show();
    $('#defaultForm').data('bootstrapValidator').resetForm(true);
    $("#getTableField").show();
    for (var i in Index.vm.metatemplateclass) {
        Index.vm.metatemplateclass[i]("");
    }
    var requestURL = "";
    var metatemplateclass = {
        templateclassid: node.id
    };
    requestURL = "/" + serverName + "/asi/municipalBuild/facilityLayout/metatemplateclass!getMetatemplateclassData.action";
    $.ajax({
        type: "post",
        data: metatemplateclass,
        dataType: "json",
        url: requestURL,
        async: false,
        success: function (result) {
            if (result != null) {
                var list = result.result[0];
                for (var item in list) {
                    var value = list[item];
                    Index.vm.metatemplateclass.id(value.id);
                    Index.vm.metatemplateclass.templateclassid(value.templateclassid);
                    Index.vm.metatemplateclass.templateclassname(value.templateclassname);
                    Index.vm.metatemplateclass.displayname(value.displayname);
                    Index.vm.metatemplateclass.templateclassdesc(value.templateclassdesc);
                }

                initTableFieldTitle();

                var tableFieldList = result.result[1];
                //基类属性信息
                if (null != tableFieldList && tableFieldList.length > 0) {
                    for (var i = 0; i < tableFieldList.length; i++) {
                        index++;
                        var htmlText = [];
                        htmlText.push("<tr id='field_" + index + "'>");
                        htmlText.push("<td><input    type='checkbox'  id='index_" + index + "'>");
                        htmlText.push("<td style='display:none'><input type='text' class='textbox' id='id_" + index + "' value='" + tableFieldList[i].id + "'  /></td>");
                        htmlText.push("<td><input type='text' class='textbox' id='fieldName_" + index + "' value='" + (tableFieldList[i].classpropertyname==undefined?"":tableFieldList[i].classpropertyname) + "'  /></td>");
                        htmlText.push("<td><input type='text' class='textbox' id='disName_" + index + "' value='" + (tableFieldList[i].displayname==undefined?"":tableFieldList[i].displayname)+ "' /></td>");
                        htmlText.push("<td><input type='text' style='width: 100%' class='textbox' id='fieldDesc_" + index + "' value='" + (tableFieldList[i].classpropertydesc==undefined?"":tableFieldList[i].classpropertydesc) + "' /></td>");
                        htmlText.push("<td style='display: none'><input type='text' style='width: 100%' class='textbox' id='fieldstatecode_" + index + "' value='" + (tableFieldList[i].fieldstatecode==undefined?"":tableFieldList[i].fieldstatecode) + "' /></td>");

                        if (0 == tableFieldList[i].nullflag) {
                            htmlText.push("<td><input    type='checkbox'  id='nullFlag_" + index + "'>");
                        } else {
                            htmlText.push("<td><input  checked type='checkbox'  id='nullFlag_" + index + "'>");
                        }
                        if (0 == tableFieldList[i].querypropertyflag) {
                            htmlText.push("<td><input  type='checkbox' id='queryPropertyFlag_" + index + "'>");
                        } else {
                            htmlText.push("<td><input checked  type='checkbox' id='queryPropertyFlag_" + index + "'>");
                        }
                        if (0 == tableFieldList[i].listpropertyflag) {
                            htmlText.push("<td><input  type='checkbox' id='listPropertyFlag_" + index + "'>");
                        } else {
                            htmlText.push("<td><input checked  type='checkbox' id='listPropertyFlag_" + index + "'>");
                        }
                        htmlText.push("</tr>");
                        $("#editDetailTableField").append(htmlText.join(""));
                    }
                }
        		$("#paneltable").css('height',$("#tab-content-panel").height()-((($("#form-group-row").height()==-1 ? 35 : $("#form-group-row").height())+6)*2)-75+'px');//
            }
        }
    });
}

//初始化基类属性字段表头
function initTableFieldTitle() {
    index = 0;
    curTableid = null;
    $("#editDetailTableField").empty();//清空元素
    var htmlText = [];
    htmlText.push("<tr>");
    htmlText.push("<td style='display:none'>ID</td>");
    htmlText.push("<td class=' col-xs-1'><input type='checkbox'  id='allIndexCheck'>序号</td>");
    htmlText.push("<td class=' col-xs-1'>属性名称</td>");
    htmlText.push("<td class=' col-xs-1'>显示名称</td>");
    htmlText.push("<td class=' col-xs-2'>属性描述</td>");
    htmlText.push("<td class=' col-xs-2' style='display: none'>字段状态标识</td>");
    htmlText.push("<td class=' col-xs-1'>可否为空<input type='checkbox'  id='allNullCheck'></td>");
    htmlText.push("<td class=' col-xs-1'>查询字段<input type='checkbox'  id='allQueryCheck'></td>");
    htmlText.push("<td class=' col-xs-1'>列表字段<input type='checkbox'  id='allListCheck'></td>");
    htmlText.push("</tr>");
    $("#editDetailTableField").append(htmlText.join(""));

    $("#allIndexCheck").on("click", function (evt) {
        var checked = $("#allIndexCheck")[0].checked;
        $('#editDetailTableField input[type="checkbox"]').each(function () {
            if ((this.id).indexOf("index_") > -1) {
                this.checked = checked;
            }
        });
    });
    $("#allNullCheck").on("click",function(evt){
        var checked = $("#allNullCheck")[0].checked;
        $('#editDetailTableField input[type="checkbox"]').each(function() {
            if ((this.id).indexOf("nullFlag_") > -1) {
                this.checked=checked;
            }
        });
    });
    $("#allQueryCheck").on("click",function(evt){
        var checked = $("#allQueryCheck")[0].checked;
        $('#editDetailTableField input[type="checkbox"]').each(function() {
            if ((this.id).indexOf("queryPropertyFlag_") > -1) {
                this.checked=checked;
            }
        });
    });
    $("#allListCheck").on("click",function(evt){
        var checked = $("#allListCheck")[0].checked;
        $('#editDetailTableField input[type="checkbox"]').each(function() {
            if ((this.id).indexOf("listPropertyFlag_") > -1) {
                this.checked=checked;
            }
        });
    });
}

//增加基类模板属性字段
function addTableFieldEdit() {
    index++;
    var htmlText = [];
    htmlText.push("<tr id='field_" + index + "'>");
    htmlText.push("<td><input    type='checkbox'  id='index_" + index + "'>");
    htmlText.push("<td style='display:none'><input type='text' class='textbox' id='id_" + index + "'/></td>");
    htmlText.push("<td><input type='text' class='textbox' id='fieldName_" + index + "' value=''/></td>");
    htmlText.push("<td><input type='text' class='textbox' id='disName_" + index + "' /></td>");
    htmlText.push("<td><input style='width: 100%' type='text' class='textbox' id='fieldDesc_" + index + "' /></td>");
    htmlText.push("<td style='display: none' ><input type='text' class='textbox' id='fieldstatecode_" + index + "' /></td>");
    htmlText.push("<td><input checked   type='checkbox'  id='nullFlag_" + index + "'>");
    htmlText.push("<td><input    type='checkbox'  id='queryPropertyFlag_" + index + "'>");
    htmlText.push("<td><input checked   type='checkbox'  id='listPropertyFlag_" + index + "'>");
    htmlText.push("</tr>");
    $("#editDetailTableField").append(htmlText.join(""));
}

//删除基类模板属性字段
function delTableFieldEdit() {
    var ids = "";
    var trs = [];
    var requestURL = "/" + serverName + "/asi/municipalBuild/facilityLayout/metatemplateclass!delMetaclasspropertyData.action";

    $('#editDetailTableField tr').each(function () {
        if (this.id.indexOf("field_") > -1) {
            var fieldName = this.id.replace("field_", "");
            if ($("#index_" + fieldName)[0].checked == true) {
                if(null != $("#id_"+fieldName).val() && $("#id_"+fieldName).val() != ""){
                    ids+=$("#id_"+fieldName).val()+",";
                    trs.push("#" + this.id);
                }else{
                    $("tr").remove("#" + this.id);//清空指定子元素
                }
            }
        }
    });
    if(ids != ""){
        ids = ids.substring(0,ids.length-1);
        layer.confirm('是否删除选中的基类属性信息？', {
            btn: ['确定', '取消'] //按钮
        }, function () {
            $.ajax({
                type: "post",
                data: {ids:ids},
                dataType: "json",
                url: requestURL,
                async: false,
                success: function (result) {
                    if (result.success) {
                        for(var i in trs){
                            $("tr").remove(trs[i]);
                        }
                        layer.msg('删除成功！', {
                            icon: 1,
                            time: 2000 //2秒关闭（如果不配置，默认是3秒）
                        });
                    }else{
                        layer.msg('删除失败！', {
                            icon: 2,
                            time: 2000 //2秒关闭（如果不配置，默认是3秒）
                        });
                    }
                }
            });
        });
    }
}

// 增加基类模板
function addMetatemplateclass() {
    if (node == null) {
        layer.alert('请选择市政设施组分类！', {icon: 7});
    }else if (node.children.length > 0 && node.iconCls == "icon-leaf") {
        layer.alert('该设施分类已存在基类模板，无法再添加！', {icon: 7});
    }else if (node.iconCls == "icon-root") {
        layer.alert('根节点无法添加，请选择市政设施分类节点！', {icon: 7});
    }else if(node.iconCls == 'icon-template'){
        layer.alert('已经是基类模板，无法再添加！', {icon: 7});
    } else {
        if(node.iconCls == "icon-group"){
            var nodeFlag = false;
            if(node.children.length >0){
                for(var i in node.children){
                    if(node.children[i].iconCls == "icon-template"){
                        nodeFlag = true;
                        break;
                    }
                }
            }
        }
        if(!nodeFlag){
            $(".tablefield-add").show();
            $(".tablefield-del").show();
            $("#getTableField").show();
            initTableFieldTitle();
            $('#metadatatable_nav a[href="#metadatatable_add_tab"]').tab('show');
        }else{
            layer.alert('该设施分类已存在基类模板，无法再添加！', {icon: 7});
        }

    }
}

//保存基类模板
function saveMetatemplateclass() {
    if (node == null) {
        layer.alert('请选择市政设施组分类！', {icon: 7});
        return;
    }else if (node.children.length > 0 && node.iconCls == "icon-leaf") {
        layer.alert('该设施分类已存在基类模板，无法再添加！', {icon: 7});
        return;
    }else if (node.iconCls == "icon-root") {
        layer.alert('请选择市政设施组分类叶子节点！', {icon: 7});
        return;
    }
    var tableFieldList = [];
    $('#editDetailTableField tr').each(function () {
        if (this.id.indexOf("field_") > -1) {
            var fieldName = this.id.replace("field_", "");
            var fieldInfo = {
                "id":$("#id_" + fieldName).val(),
                "classpropertyname": $("#fieldName_" + fieldName).val(),
                "displayname": $("#disName_" + fieldName).val(),
                "classpropertydesc": $("#fieldDesc_" + fieldName).val(),
                "fieldstatecode": $("#fieldstatecode_" + fieldName).val(),
                "nullflag": $("#nullFlag_" + fieldName)[0].checked==true?1:0,
                "querypropertyflag": $("#queryPropertyFlag_" + fieldName)[0].checked==true?1:0,
                "listpropertyflag": $("#listPropertyFlag_" + fieldName)[0].checked==true?1:0
            };
            tableFieldList.push(fieldInfo);
        }
    });
    var metatemplateclass = {
        tableFieldList: JSON.stringify(tableFieldList),
        metadatacategoryid: node.id
    };
    for (var i in Index.vm.metatemplateclass) {
        metatemplateclass[i] = Index.vm.metatemplateclass[i]();
    }
    if(metatemplateclass.templateclassname==""){
        layer.alert('请完善基类模板名称信息后再保存！', {icon: 7});
        return;
    }else if(metatemplateclass.displayname==""){
        layer.alert('请完善基类显示名称信息后再保存！', {icon: 7});
        return;
    } else if (metatemplateclass.tableFieldList == "[]") {
        layer.alert('请添加表字段信息后再保存！', {icon: 7});
        return;
    }
    var requestURL = "";
    requestURL = "/" + serverName + "/asi/municipalBuild/facilityLayout/metatemplateclass!saveMetatemplateclassData.action";
    $.ajax({
        type: "post",
        data: metatemplateclass,
        dataType: "json",
        url: requestURL,
        async: false,
        success: function (result) {
            if (result.success) {
                layer.msg('保存成功！', {
                    icon: 1,
                    time: 2000 //2秒关闭（如果不配置，默认是3秒）
                });
                $(".tablefield-add").show();
                $(".tablefield-del").show();
                $("#getTableField").show();
                Index.loadTreeData();
                initTableFieldTitle();
                $('#defaultForm').data('bootstrapValidator').resetForm(true);
                for (var i in Index.vm.metatemplateclass) {
                    Index.vm.metatemplateclass[i]("");
                }
                getMetatemplateclassData();
            }
        }
    });
}

//排序设施表模板字段
function sortMetatemplateclass() {
}

//删除设施表模板
function deleteMetatemplateclass() {
    if (node == null) {
        layer.alert('请选择对应设施表模板！', {icon: 7});
        return;
    }
    if (node.iconCls == 'icon-template') {
        //询问框
        layer.confirm('是否删除该基类模板及基类模板属性？', {
            btn: ['确定', '取消'] //按钮
        }, function () {
            var metatemplateclass = {
                id: Index.vm.metatemplateclass.id
            };
            for (var i in Index.vm.metatemplateclass) {
                metatemplateclass[i] = Index.vm.metatemplateclass[i]();
            }
            var requestURL = "";
            requestURL = "/" + serverName + "/asi/municipalBuild/facilityLayout/metatemplateclass!delMetatemplateclassData.action";
            $.ajax({
                type: "post",
                data: metatemplateclass,
                dataType: "json",
                url: requestURL,
                async: false,
                success: function (result) {
                    if (result.success) {
                        layer.msg('删除成功！', {
                            icon: 1,
                            time: 2000 //2秒关闭（如果不配置，默认是3秒）
                        });
                        $(".tablefield-add").show();
                        $(".tablefield-del").show();
                        $("#getTableField").show();
                        Index.loadTreeData();
                        initTableFieldTitle();
                        $('#defaultForm').data('bootstrapValidator').resetForm(true);
                        for (var i in Index.vm.metatemplateclass) {
                            Index.vm.metatemplateclass[i]("");
                        }
                    }
                }
            });
        }, function () {
            return;
        });
    } else {
        layer.alert('请重新选择对应设施表模板！', {icon: 7});
        return;
    }
}

//生成设施表模板字段
function getTableField() {
    initTableFieldTitle();
    var metatemplateclass = {};
    for (var i in Index.vm.metatemplateclass) {
        metatemplateclass[i] = Index.vm.metatemplateclass[i]();
    }
    var requestURL = "";
    requestURL = "/" + serverName + "/asi/municipalBuild/facilityLayout/metadatatable!getTableFieldListByName.action";
    $.ajax({
        type: "post",
        data: metatemplateclass,
        dataType: "json",
        url: requestURL,
        async: false,
        success: function (result) {
            var list = result.result;
            for (var item in list) {
                var value = list[item];
                var htmlText = [];
                htmlText.push("<tr id='field_" + value.fieldname + "'>");
                htmlText.push("<td><input    type='checkbox'  id='index_" + value.fieldname + "'>");
                htmlText.push("<td style='display:none'><input type='text' class='textbox' id='id_" + value.fieldname + "'/></td>");
                htmlText.push("<td><input type='text' class='textbox' id='fieldName_" + value.fieldname + "' value='" + value.fieldname + "'/></td>");
                htmlText.push("<td><input type='text' class='textbox' id='disName_" + value.fieldname + "' value='" + value.displayname +"' /></td>");
                htmlText.push("<td><input type='text' style='width: 100%' class='textbox' id='fieldDesc_" + value.fieldname + "' value='" + value.displayname +"' /></td>");
                htmlText.push("<td style='display: none'><input type='text' style='width: 100%' class='textbox' id='fieldstatecode_" + value.fieldname + "' value='" + value.displayname +"'/></td>");
                htmlText.push("<td><input checked   type='checkbox'  id='nullFlag_" + value.fieldname + "'>");
                htmlText.push("<td><input    type='checkbox'  id='queryPropertyFlag_" + value.fieldname + "'>");
                htmlText.push("<td><input checked   type='checkbox'  id='listPropertyFlag_" + value.fieldname + "'>");
                htmlText.push("</tr>");
                $("#editDetailTableField").append(htmlText.join(""));
            }
        }
    });
}
$(window).resize(function() {
    $('.full-height').each(function() {
        $(this).height($(window).height() - $(this).offset().top - 90);
    });
});
