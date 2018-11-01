var serverName = GetQueryString("serverName");
var templateData;
var flag = "false";
$(function () {
    $("#exampleTableEvents").bootstrapTable({
        pagination: true,//显示分页
        clickToSelect: true,//点击选中行
        pageNumber: 1,//初始化加载第一页，默认第一页
        pageSize: 10,//每页记录的行数
        pageList: [5, 10, 20, 50, 100, 200],//分页可选页数
        paginationPreText: "上一页",
        paginationNextText: "下一页",
        queryParamsType: '',//默认为limit，默认情况传给服务端的参数为offset，limit，sort
        sidePagination: "sever",//分页方式：client客户端分页，server服务端分页
        iconSize: "outline",//图标尺寸
        toolbar: "#exampleTableEventsToolbar",//工具按钮容器
        columns: [{
            field: 'state',
            checkbox: 'true',
            events: 'actionEvents'
        }, {
            field: 'id',
            events: 'actionEvents',
            visible: false
        },
            {
                field: 'templateNum',
                title: '编号',
                sortable: 'true'
            }, {
                field: 'templatename',
                title: '模板名称',
                sortable: 'true'
            }, {
                field: 'displayname',
                title: '模板显示名称',
                sortable: 'true',
                //editable:'true',
                align: 'center'
            }, {
                field: 'isinused',
                title: '是否正在使用',
                sortable: 'true',
                align: 'center'
            }, {
                field: 'remark',
                title: '备注',
                sortable: 'true',
                align: 'center'
            }],
        pagination: true,
        rowStyle: function (row, index) {
            return {
                //css:{"color":"blue"}
            }
        }
    });
//bootstrap列表类添加表单
    $("#addForm").click(function () {
        cleanForm();
    });
    $("#edit").click(function () {
        editFormData();
    });
    refreshData();
});
function refreshData() {
    var url = "/" + serverName + "/asi/municipalBuild/facilityLayout/template!getTemplateData.action";
    $.ajax({
        type: "post",
        data:  $("#searchForm").serialize(),
        dataType: "json",
        url: url,
        async: false,
        success: function (result) {
            if (result.success) {
                var results = result.result;
                for (var i = 0; i < results.length; i++) {
                    var res = results[i].isinused;
                    if (res == 1) {
                        results[i].isinused = "是";
                    } else {
                        results[i].isinused = "否";
                    }
                    results[i].templateNum = i+1;
                }
                $('#exampleTableEvents').bootstrapTable('load', result.result);
            }
            templateData = result.result;
        }
    });
}
function deleteData() {
    //询问框
    var rowData = $('#exampleTableEvents').bootstrapTable('getSelections');
    if (rowData.length > 0){
        layer.confirm('是否确定删除模板数据及其相关数据？', {
            btn: ['确定', '取消'] //按钮
        }, function () {
            var rows = $('#exampleTableEvents').bootstrapTable('getSelections');
            var ids = "";
            for (var i in rows) {
                ids += rows[i].id + ",";
            }
            ids = ids.substring(0, ids.length - 1);
            url = "/" + serverName + "/asi/municipalBuild/facilityLayout/template!deleteTemplateData.action";
            $.ajax({
                type: "post",
                data: {ids: ids},
                dataType: "json",
                url: url,
                async: false,
                success: function (result) {
                    if (result.success) {
                        refreshData();
                        layer.msg('删除成功！', {
                            icon: 1,
                            time: 2000
                        });
                    } else {
                        layer.msg('删除失败！', {
                            icon: 2,
                            time: 2000
                        });
                    }
                }
            });
        }, function () {
            return;
        });
    }else{
        layer.alert("请选中要删除的数据！");
        return;
    }
}
function saveTemplateData() {
    url = "/" + serverName + "/asi/municipalBuild/facilityLayout/template!save.action";
    var flag = $("#myform").valid();
    //$('#myModal').modal('hide');
    if(flag){
        var inuseValue = $("#IsInUsed").val();
        var tmpname = $("#TemplateName").val();
        if (inuseValue == 1) {
            layer.confirm('使用该模板会导致其它正在使用的模板停用，确定使用？', {
                btn: ['确定', '取消'] //按钮
            }, function () {
                $.ajax({
                    type: "post",
                    data: $("#myform").serialize(),
                    dataType: "json",
                    url: url,
                    async: false,
                    success: function (result) {

                        if (result.success) {
                            refreshData();
                            $('#myModal').modal('hide');
                            layer.alert('保存成功！！');
                        }else{
                            layer.alert(result.msg);
                        }
                    }
                });
            }, function () {
                return;
            });
        } else {
            $.ajax({
                type: "post",
                data: $("#myform").serialize(),
                dataType: "json",
                url: url,
                async: false,
                success: function (result) {
                    if (result.success) {
                        refreshData();
                        $('#myModal').modal('hide');
                        layer.alert('保存成功！！');
                    }else{
                        layer.alert(result.msg);
                    }
                }
            });
        }
    }
}
function cleanForm() {
    $(':input','#myform')
        .not(':button, :submit, :reset')
        .val('');
    $("#IsInUsed").val("0");
    $("#myModal").modal();
}
function editFormData() {
    var rowData = $('#exampleTableEvents').bootstrapTable('getSelections');
    if (rowData.length == 1) {
        var row1 = rowData[0];
        $("input#id").val(row1.id);
        $("input#TemplateName").val(row1.templatename);
        $("input#DisplayName").val(row1.displayname);
        var A = row1.isinused;
        if (row1.isinused == "是") {
            $("#IsInUsed").val("1");
        } else {
            $("#IsInUsed").val("0");
        }
        $("input#Remark").val(row1.remark);
        $("#myModal").modal();
    } else {
        layer.alert("请选中一行作为修改数据！");
    }
}
function cleanwaring(){
    $(".waring").remove();
    $("#TemplateName").removeClass("error");
    $("#DisplayName").removeClass("error");
}
$('#myModal').on('hidden.bs.modal', function () {
    $(".waring").remove();
    $("#TemplateName").removeClass("error");
    $("#DisplayName").removeClass("error");
})
function cleanSearchData(){
    $("#tname").val("");
    $("#dname").val("");
}