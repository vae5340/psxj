var serverName = GetQueryString("serverName");
var node = null;
var index = 0;
var dicData = [];

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
        $('#metadatatable_nav a[href="#metadatatable_add_tab"]').tab('show');
        initTableFieldTitle();
    },
    bindUI: function () {
        $("#paneltable").css('height', $("#tab-content-panel").height() / 2 + 'px');//
        $(".tablefield-add").on("click", function (evt) {
            addTableFieldEdit();
        });
        $(".tablefield-del").on("click", function (evt) {
            delTableFieldEdit();
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
                typecode:{
                    validators: {
                        notEmpty: {
                            message: '字段不能为空'
                        }
                    }
                },
                name: {
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
        requestURL = "/" + serverName + "/asi/municipalBuild/facilityLayout/metacodetype!getMetadictionaryTree.action";
        $.ajax({
            type: "post",
            data: {},
            dataType: "json",
            url: requestURL,
            async: false,
            success: function (result) {
                var list = result.result;
                zTree = $.fn.zTree.init($("#metadictionary_tree"), setting, list);
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

$(function(){
    Index.init();
})
//创建一个View对象
function ViewModel() {
    var self = this;
    self.metacodetypelist = ko.observable();
    self.metacodetype = {};
    self.metacodetype.id = ko.observable();
    self.metacodetype.typecode = ko.observable();
    self.metacodetype.name = ko.observable();
    self.metacodetype.memo = ko.observable();
    self.addMetacodetype = addMetacodetype;
    self.saveMetacodetype = saveMetacodetype;
    self.deleteMetacodetype = deleteMetacodetype;
};

function zTreeOnClick(event, treeId, treeNode) {
    dicData = [];
    node = treeNode;
    if (node.seniorid != -1) {
        $('#metadatatable_nav a[href="#metadatatable_add_tab"]').tab('show');
        getParentDicData(node.seniorid);
        getMetacodetypeData();

    }else{
        initTableFieldTitle();
        $('#defaultForm').data('bootstrapValidator').resetForm(true);
    }
}

function getParentDicData(parentId){
    if(parentId) {
        $.ajax({
            type: 'post',
            url: '/' + serverName + "/metacodetype!getMetadictionaryData.action",
            data: {id: parentId},
            dataType: 'json',
            async: false,
            success: function (result) {
                var data = result.result;
                if (data != undefined && data.length == 2) {
                    dicData = data[1];
                }
            }
        })
    }
}

function getMetacodetypeData() {
    initTableFieldTitle();
    $('#defaultForm').data('bootstrapValidator').resetForm(true);
    var requestURL = "";
    var metacodetype = {
        id: node.id
    };
    requestURL = "/" + serverName + "/asi/municipalBuild/facilityLayout/metacodetype!getMetadictionaryData.action";
    $.ajax({
        type: "post",
        data: metacodetype,
        dataType: "json",
        url: requestURL,
        async: false,
        success: function (result) {
            if (result != null) {
                var value = result.result[0];
                if(null != value){
                    Index.vm.metacodetype.id(value.id);
                    Index.vm.metacodetype.typecode(value.typecode);
                    Index.vm.metacodetype.name(value.name);
                    Index.vm.metacodetype.memo(value.memo);
                }
                var tableFieldList = result.result[1];
                //字段信息
                if (null != tableFieldList && tableFieldList.length > 0) {
                    for (var i = 0; i < tableFieldList.length; i++) {
                        index++;
                        var htmlText = [];
                        htmlText.push("<tr id='field_" + index + "'>");
                        htmlText.push("<td><input    type='checkbox'  id='index_" + index + "'>");
                        htmlText.push("<td style='display:none'><input type='text' class='textbox' id='id_" + index + "' value='" + tableFieldList[i].id + "'  /></td>");
                        htmlText.push("<td><input type='text' class='textbox' id='code_" + index + "' value='" + (tableFieldList[i].code==undefined?"":tableFieldList[i].code) + "'  /></td>");
                        htmlText.push("<td><input type='text' class='textbox' id='name_" + index + "' value='" + (tableFieldList[i].name==undefined?"":tableFieldList[i].name)+ "' /></td>");
                        htmlText.push("<td><input type='text' class='textbox' id='sortno_" + index + "' value='" + (tableFieldList[i].sortno==undefined?"":tableFieldList[i].sortno)+ "' /></td>");

                        if(dicData && dicData.length>0) {
                            htmlText.push("<td><select style='width: 100%' type='text' class='textbox' id='parenttypecode_" + index + "'>");
                            for (var j in dicData) {
                                htmlText.push("<option value='" + dicData[j].code + "'" + (dicData[j].code == tableFieldList[i].parenttypecode ? " selected" : " ") + ">" + dicData[j].name + "</option>");
                            }
                            htmlText.push("</select></td>");
                        }else{
                            htmlText.push("<td><input    type='text' id='parenttypecode_" + index + "' disabled>");
                        }

                        htmlText.push("<td><input type='text' style='width: 100%' class='textbox' id='memo_" + index + "' value='" + (tableFieldList[i].memo==undefined?"":tableFieldList[i].memo) + "' /></td>");
                        if (0 == tableFieldList[i].status) {
                            htmlText.push("<td><input    type='checkbox'  id='statusFlag_" + index + "'>");
                        } else {
                            htmlText.push("<td><input  checked type='checkbox'  id='statusFlag_" + index + "'>");
                        }
                        htmlText.push("</tr>");
                        $("#editDetailTableField").append(htmlText.join(""));
                    }
                }
            }
        }
    });
}

//初始化基类属性字段表头
function initTableFieldTitle() {
    $("#editDetailTableField").empty();
    index = 0;
    var htmlText = [];
    htmlText.push("<tr>");
    htmlText.push("<td style='display:none'>ID</td>");
    htmlText.push("<td class=' col-xs-1'><input type='checkbox'  id='allIndexCheck'>序号</td>");
    htmlText.push("<td class=' col-xs-1'>字典项编码</td>");
    htmlText.push("<td class=' col-xs-1'>字典项名称</td>");
    htmlText.push("<td class=' col-xs-1'>排序编号</td>");
    htmlText.push("<td class=' col-xs-1'>父类编码</td>");
    htmlText.push("<td class=' col-xs-2'>字典项描述</td>");
    htmlText.push("<td class=' col-xs-1'>是否启用<input type='checkbox'  id='statusCheck'></td>");
    htmlText.push("</tr>");
    $("#editDetailTableField").append(htmlText.join(""));

    $("#allIndexCheck").on("click",function(evt){
        var checked = $("#allIndexCheck")[0].checked;
        $('#editDetailTableField input[type="checkbox"]').each(function() {
            if ((this.id).indexOf("index_") > -1) {
                this.checked=checked;
            }
        });
    });

    $("#statusCheck").on("click", function (evt) {
        var checked = $("#statusCheck")[0].checked;
        $('#editDetailTableField input[type="checkbox"]').each(function () {
            if ((this.id).indexOf("statusFlag_") > -1) {
                this.checked = checked;
            }
        });
    });
    for (var i in Index.vm.metacodetype) {
        Index.vm.metacodetype[i]("");
    }

}

//增加字段信息
function addTableFieldEdit() {
    index++;
    var htmlText = [];
    htmlText.push("<tr id='field_" + index + "'>");
    htmlText.push("<td><input    type='checkbox'  id='index_" + index + "'>");
    htmlText.push("<td style='display:none'><input type='text' class='textbox' id='id_" + index + "'/></td>");
    htmlText.push("<td><input type='text' class='textbox' id='code_" + index + "' value=''/></td>");
    htmlText.push("<td><input type='text' class='textbox' id='name_" + index + "' /></td>");
    htmlText.push("<td><input type='text' class='textbox' id='sortno_" + index + "' /></td>");
    if(dicData && dicData.length>0) {
        htmlText.push("<td><select style='width: 100%' type='text' class='textbox' id='parenttypecode_" + index + "'>");
        for (var j in dicData) {
            htmlText.push("<option value='" + dicData[j].code + "'>" + dicData[j].name + "</option>");
        }
        htmlText.push("</select></td>");
    }else{
        htmlText.push("<td><input    type='text' id='parenttypecode_" + index + "' disabled>");
    }
    htmlText.push("<td><input style='width: 100%' type='text' class='textbox' id='memo_" + index + "' /></td>");
    htmlText.push("<td><input checked   type='checkbox'  id='statusFlag_" + index + "'>");
    htmlText.push("</tr>");
    $("#editDetailTableField").append(htmlText.join(""));
}

//删除字段信息
function delTableFieldEdit() {
    var ids = "";
    var trs = [];
    var requestURL = "/" + serverName + "/asi/facility/facilityLayout/metacodetype!delMetaCodeitemData.action";

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
            layer.confirm('是否删除选中的字典项信息？', {
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
                    }
                }
            });
            });
        }

}

// 增加字典
function addMetacodetype() {
    if (node == null) {
        layer.alert('请选择数据字典节点！', {icon: 7});
    }else {
        initTableFieldTitle();
        getParentDicData(node.id);
        $('#defaultForm').data('bootstrapValidator').resetForm(true);
        $('#metadatatable_nav a[href="#metadatatable_add_tab"]').tab('show');
    }
}

//保存数据字典信息
function saveMetacodetype() {
    if (node == null) {
        layer.alert('请选择数据字典节点！', {icon: 7});
        return;
    }
    var tableFieldList = [];
    $('#editDetailTableField tr').each(function () {
        if (this.id.indexOf("field_") > -1) {
            var fieldName = this.id.replace("field_", "");
            var fieldInfo = {
                "id":$("#id_" + fieldName).val(),
                "code": $("#code_" + fieldName).val(),
                "name": $("#name_" + fieldName).val(),
                "sortno": $("#sortno_" + fieldName).val(),
                "parenttypecode": $("#parenttypecode_" + fieldName).val(),
                "memo": $("#memo_" + fieldName).val(),
                "status": $("#statusFlag_" + fieldName)[0].checked==true?1:0
            };
            tableFieldList.push(fieldInfo);
        }
    });
    var metacodetype = {
        tableFieldList: JSON.stringify(tableFieldList),
    };
    for (var i in Index.vm.metacodetype) {
        metacodetype[i] = Index.vm.metacodetype[i]();
    }
    metacodetype.seniorid = metacodetype.id == ""?node.id:node.seniorid;
    if(metacodetype.code==""){
        layer.alert('请完善字典类型编号信息后再保存！', {icon: 7});
        return;
    }else if(metacodetype.name==""){
        layer.alert('请完善字典类型显示名称信息后再保存！', {icon: 7});
        return;
    }else if(metacodetype.tableFieldList == "[]"){
        layer.alert('请完善字典项信息后再保存！', {icon: 7});
        return;
    }
    var requestURL = "";
    requestURL = "/" + serverName + "/asi/municipalBuild/facilityLayout/metacodetype!saveMetadictionaryData.action";
    $.ajax({
        type: "post",
        data: metacodetype,
        dataType: "json",
        url: requestURL,
        async: false,
        success: function (result) {
            if (result.success) {
                layer.msg('保存成功！', {
                    icon: 1,
                    time: 2000 //2秒关闭（如果不配置，默认是3秒）
                });
                Index.loadTreeData();
                initTableFieldTitle();
                $('#defaultForm').data('bootstrapValidator').resetForm(true);
                getMetacodetypeData();
            }
        }
    });
}

//删除数据字典
function deleteMetacodetype() {
    if (node == null) {
        layer.alert('请选择对应数据字典！', {icon: 7});
        return;
    }
    if (node.seniorid != -1) {
        //询问框
        layer.confirm('是否删除该数据字典及其字段信息？', {
            btn: ['确定', '取消'] //按钮
        }, function () {
            var metacodetype = {
                id: Index.vm.metacodetype.id
            };
            for (var i in Index.vm.metacodetype) {
                metacodetype[i] = Index.vm.metacodetype[i]();
            }
            var requestURL = "";
            requestURL = "/" + serverName + "/asi/municipalBuild/facilityLayout/metacodetype!delMetadictionaryData.action";
            $.ajax({
                type: "post",
                data: metacodetype,
                dataType: "json",
                url: requestURL,
                async: false,
                success: function (result) {
                    if (result.success) {
                        layer.msg('删除成功！', {
                            icon: 1,
                            time: 2000 //2秒关闭（如果不配置，默认是3秒）
                        });
                        Index.loadTreeData();
                        initTableFieldTitle();
                        $('#defaultForm').data('bootstrapValidator').resetForm(true);
                    }
                }
            });
        }, function () {
            return;
        });
    } else {
        layer.alert('根节点不能删除！', {icon: 7});
        return;
    }
}
$(window).resize(function() {
    $('.full-height').each(function() {
        $(this).height($(window).height() - $(this).offset().top - 90);
    });
});

