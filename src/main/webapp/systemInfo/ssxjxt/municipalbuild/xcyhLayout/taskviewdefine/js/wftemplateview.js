var serverName = GetQueryString("serverName");
var node;
var curId;
var state;
var templateid;
var getcomponentidlist = {};
var dicmap;
var Index = {
    init: function () {
        var that = this;
        this.vm = new ViewModel();
        ko.applyBindings(this.vm);
        that.getWfBusTemplateData();
        that.renderUI();
        that.bindUI();
        dateInit(".mydate");
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

//创建一个View对象
function ViewModel() {
    var self = this;
    self.wftemplateview = {};
    self.wftemplateview.id = ko.observable();
    self.wftemplateview.displayorder = ko.observable();
    self.wftemplateview.templateid = ko.observable();
    self.wftemplateview.viewdisplayname = ko.observable();
    self.wftemplateview.viewname = ko.observable();
    self.wftemplateview.viewtype = ko.observable();
    self.wftemplateview.filterconditionssql = ko.observable();
    self.addWftemplateview = addWftemplateview;
    self.saveWftemplateview = saveWftemplateview;
    self.deleteWftemplateview = deleteWftemplateview;
};

function zTreeOnClick(event, treeId, treeNode) {
    node = treeNode;
    var treeObj = $.fn.zTree.getZTreeObj("Wftemplateview_tree");
    var nodes = treeObj.getSelectedNodes();
    if (nodes.length>0) {
        treeObj.expandNode(nodes[0], true, false, true);
    }
    $('#wftemplateview_nav a[href="#wftemplateview_add_tab"]').tab('show');
    if (curId == node.id) {

    } else {
        curId = node.id;
        getWftemplateviewData();
        getfilterFidls();

    }
};

function addWftemplateview() {
    if (node == null) {
        layer.alert('请选择根节点！！');
    } else if (node.isParent || node.id == 0) {
        $('#wftemplateview_nav a[href="#wftemplateview_add_tab"]').tab('show');
        cleanForm();
    } else {
        layer.alert('请选择根节点！！');
    }
}

function saveWftemplateview() {
     templateid = $("#wfbustemplate").val();
    if (node == null) {
        layer.alert('请选择市政设施！！');
    } else {
        var flag = $("#myform").valid();
        if (flag) {
            var wftemplateview = {
                wftemplateviewid: node.id
            };
            for (var i in Index.vm.wftemplateview) {
                wftemplateview[i] = Index.vm.wftemplateview[i]();
            }
            var requestURL = "";
            wftemplateview.templateid = templateid;
            requestURL = "/" + serverName + "/asi/municipalBuild/xcyhLayout/wf-template-view!saveWfTemplateViewData.action";
            $.ajax({
                type: "post",
                data: wftemplateview,
                dataType: "json",
                url: requestURL,
                async: false,
                success: function (result) {
                    if (result.success) {
                        layer.alert('保存成功！！');
                       cleanForm();
                        Index.loadTreeData();
                    }
                }
            });
        }
    }
}
function cleanForm() {
    curId = "";
    Index.vm.wftemplateview.id("");
    Index.vm.wftemplateview.viewdisplayname("");
    Index.vm.wftemplateview.viewname("");
    Index.vm.wftemplateview.viewtype("");
    Index.vm.wftemplateview.templateid("");
    Index.vm.wftemplateview.filterconditionssql("");
    //Index.vm.wftemplateview.state("");
    //$("#state").attr("disabled",false);
}

/*Index.vm.wftemplateview.id(value.id);
 Index.vm.wftemplateview.viewdisplayname(value.viewdisplayname);
 Index.vm.wftemplateview.viewname(value.viewname);
 Index.vm.wftemplateview.viewtype(value.viewtype);
 Index.vm.wftemplateview.templateid(value.templateid);
 Index.vm.wftemplateview.filterconditionssql(value.filterconditionssql);*/
function getWftemplateviewData() {

    var wftemplateview = {
        wftemplateviewid: node.id
    };
    for (var i in Index.vm.wftemplateviewid) {
        wftemplateview[i] = Index.vm.wftemplateview[i]();
    }
    var requestURL = "";
    requestURL = "/" + serverName + "/asi/municipalBuild/xcyhLayout/wf-template-view!getWfTemplateViewData.action";
    $.ajax({
        type: "post",
        data: wftemplateview,
        dataType: "json",
        url: requestURL,
        async: false,
        success: function (result) {
            var list = result.result;
            for (var item in list) {
                var value = list[item];
                Index.vm.wftemplateview.id(value.id);
                Index.vm.wftemplateview.viewdisplayname(value.viewdisplayname);
                Index.vm.wftemplateview.viewname(value.viewname);
                Index.vm.wftemplateview.viewtype(value.viewtype);
                Index.vm.wftemplateview.templateid(value.templateid);
                Index.vm.wftemplateview.filterconditionssql(value.filterconditionssql);
                state = value.state;

            }
        }
    });
    $("#filtersymbol").empty();
    $("#filtersymbol").append("<option value=''>"+ "---请选择---"+" </option>");
    $("#filtervalue").val("");
    $("#dicfield").empty();
    $("#dicfield").append("<option value=''>"+ "---请选择---"+" </option>");
    $("#datevalue").val("");
}
function deleteWftemplateview() {
    if (node == null) {
        layer.alert('请选择子节点删除！！');
    } else if(node.isParent || node.id == 0){
       layer.alert('请选择子节点删除！！')
    }else{
        layer.confirm('确定要删除该节点吗？', {
            btn: ['确定', '取消'] //按钮
        }, function () {
            var wftemplateview = {
                wftemplateviewid: node.id
            };
            for (var i in Index.vm.wftemplateview) {
                wftemplateview[i] = Index.vm.wftemplateview[i]();
            }
            var requestURL = "";
            requestURL = "/" + serverName + "/asi/municipalBuild/xcyhLayout/wf-template-view!delWftemplateviewData.action";
            $.ajax({
                type: "post",
                data: wftemplateview,
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
function startloadtree(){
    cleanForm();
    Index.loadTreeData();
}

/*
根据任务视图获取展示字段作为下拉框选择字段
 */
function getfilterFidls(){
    var idparams = {
        viewid: node.id,
        templateid:templateid
    };
    requestURL = "/" + serverName + "/asi/municipalBuild/xcyhLayout/wf-template-view!getFields.action";
    $.ajax({
        type: "post",
        data: idparams,
        dataType: "json",
        url: requestURL,
        async: false,
        success: function (result) {
            result = result.result;
            if(result.length>=2){
                $("#filterfields").html("");
                var selectfieldslist = result[0];
                dicmap = result[1];
                for(var i = 0;i<selectfieldslist.length;i++){
                    var fieldname = selectfieldslist[i].fieldname.toLocaleLowerCase();
                    getcomponentidlist[fieldname] = selectfieldslist[i];
                    if(selectfieldslist[i].id != undefined) {
                        $("#filterfields").append("<option value='" + 'entity.' + fieldname + "'>" + selectfieldslist[i].displayname + "</option>");
                    }else{
                        $("#filterfields").append("<option value='" + fieldname + "'>" + selectfieldslist[i].displayname + "</option>");
                    }
                }
            }
        }
    });
}
/*
将过滤条件加入到文本域
 */
function pushvalue2filter(){
    var filterfields = $("#filterfields").val();
    var filtersymbol = $("#filtersymbol").val();
    var filtervalue = $("#filtervalue").val();
    var datevalue = "'"+$("#datevalue").val()+"'";
    var dicvalue = $("#dicfield").val();
        datevalue =  "to_date("+datevalue+",'"+"yyyy-mm-dd"+"')";
    var filterval;
    if(datevalue!=null && datevalue !="" && filterfields!=null && filterfields!="" && filtersymbol!=null && filtersymbol!="" ){
        filterval = filterfields + filtersymbol + datevalue;
    }
    if(dicvalue!=null && dicvalue!="" && filterfields!=null && filterfields!="" && filtersymbol!=null && filtersymbol!=""){
        filterval = filterfields + filtersymbol + "'"+dicvalue+"'";
    }
    if(filtervalue!=null && filtervalue!=""&&filterfields!=null && filterfields!="" && filtersymbol!=null && filtersymbol!=""){
            if(filtersymbol == "like"){
                filterval  =  filterfields +" "+ filtersymbol + " '%" + filtervalue +"%'";
            }else{
                filterval = filterfields + filtersymbol + "'"+filtervalue+"'";
            }
    }
     $("#filterfields").val("");
     $("#filtersymbol").val("");
     $("#filtervalue").val("");
     $("#datevalue").val("");
     $("#datevalue").val("");
     $("#dicfield").val("");
    var textareaValue = $("#textareaValue").val();
    if(textareaValue==""||textareaValue==null){
        Index.vm.wftemplateview.filterconditionssql(filterval);
    }else{
        filterval = textareaValue +" and "+filterval;
        Index.vm.wftemplateview.filterconditionssql(filterval);
    }
}
/*
控制时间框，文本框，下拉框交换显示
 */
function showValueArea(){
    $("#dicfield").empty();
    $("#filtersymbol").empty();
    $("#dicfield").append("<option value=''>"+ "---请选择---"+" </option>");
    $("#filtersymbol").append("<option value=''>"+ "---请选择---"+" </option>");
    var selectvalue = $("#filterfields").val();
    var getcomponmentvalue = selectvalue.substr(selectvalue.indexOf('.') + 1);
    if(selectvalue == "proc.start_" || selectvalue == "task.create_" || selectvalue == "task.end_" || (getcomponentidlist[getcomponmentvalue]!=undefined&&getcomponentidlist[getcomponmentvalue].componentid==2)){
        $("#filtersymbol").append("<option value='>'>" + '大于' + "</option>").append("<option value='<'>" + '小于' + "</option>");
        $("#filtervalue").hide();
        $("#datearea").show();
        $("#dicfield").hide();
    }else if(getcomponentidlist[getcomponmentvalue]!=undefined&&getcomponentidlist[getcomponmentvalue].componentid==0){
        var dicitems = dicmap[0][getcomponmentvalue];
        for (var item in dicitems) {
            var value = dicitems[item];
            $("#dicfield").append("<option value='" +value.code + "'>" + value.name + "</option>");
        }
        $("#filtersymbol").append("<option value='='>" + '等于' + "</option>").append("<option value='!='>" + '不等于' + "</option>");
        $("#filtervalue").hide();
        $("#datearea").hide();
        $("#dicfield").show();
    }else{
        $("#filtersymbol").append("<option value='='>" + '等于' + "</option>").append("<option value='!='>" + '不等于' + "</option>")
            .append("<option value='>'>" + '大于' + "</option>").append("<option value='<'>" + '小于' + "</option>").append("<option value='like'>" + '包含' + "</option>");
        $("#filtervalue").show();
        $("#datearea").hide();
        $("#dicfield").hide();
    }
}
function cleanfiltervalue(){
    Index.vm.wftemplateview.filterconditionssql("");
}