
var FileList = null;
$(function () {
	$("#table").bootstrapTable({toggle:"table", url:"/agsupport/sz-hiddenpoint!listJson.action", 
	rowStyle:"rowStyle", cache:false, pagination:true, striped:true, pageNumber:1, pageSize:10, clickToSelect:true,
	pageList:[10, 25, 50, 100], queryParams:queryParams, sidePagination:"server", singleSelect:true,
	columns:[
	{visible:true,checkbox:true},
	{field:"hiddenPointDescription", title:"\u9690\u60a3\u70b9\u63cf\u8ff0", align:"center"}, 
	{field:"recordTime", title:"\u8bb0\u5f55\u65f6\u95f4", align:"center",formatter:createDate_formatter},
 	{field:"recorder", title:"\u8bb0\u5f55\u4eba", align:"center"},
 	{field:"status", title:"状态", align:"center",formatter:status_formatter},
 	{title:"操作", align:"center",formatter:option_formatter}]});
});

function createDate_formatter(value, row, index){
	//console.log(value)
	if(value){
		return getLocalTime(value.time);
	}
	return '';
}
function status_formatter(value, row, index){
	if(value==2){
		return "处理中";
	} else if(value==3){
		return "处理完成";
	} else 
		return '未处理';
}

function queryParams(params) {
	return {pageSize:params.limit, pageNo:params.offset / params.limit + 1};
}

function reloadData(){
	var query=new Object();
	//getTimeLong($("#hiddenPointLocation").val());
	if($("#hiddenPointLocation").val()!="")
		query.hiddenPointLocation=$("#hiddenPointLocation").val();
	if($("#hiddenPointDescription").val()!="")
		query.hiddenPointDescription=$("#hiddenPointDescription").val();
	$("#table").bootstrapTable(
	'refresh', {
		url:"/agsupport/sz-hiddenpoint!listJson.action",query:query
	});
     
}
function GetQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) {
		return unescape(r[2]);
	}
	return null;
}

function option_formatter(value, row, index) {
	return "<button class='btn btn-primary' onclick='modifiedHiddenPoint(" + row.id + ")'>修改</button> <button class='btn btn-danger' onclick='delHiddenPoint(" + row.id + ")'>\u5220\u9664</button>";
}
function delHiddenPoint(id) {
	$.ajax({url:"/agsupport/sz-hiddenpoint!delete.action?id=" + id, success:function () {
		window.location.reload();
	}});
}

//档案'详细'点击事件
function addHiddenPoint(id) {
	layer.open({type:2, title:"添加隐患点", area:["70%", "45%"], 
	content:"/awater/nnwaterSystem/szwh/dlxc/hiddenPoint/hidden-point-edit.html?Id=" + id});
}

//'改'事件
function modifiedHiddenPoint(id){
	layer.open({
		type: 2, 
		title: '修改隐患点',
		area: ['700px','350px'],
		content: '/awater/nnwaterSystem/szwh/dlxc/hiddenPoint/hidden-point-edit.html?id=' + id
	})
}
function getHidePoint(){
	var selects = $("#table").bootstrapTable('getSelections');
	if(selects.length==0)
		layer.msg('请选择隐患点');
	else{
		window.opener.getSelHidePoint(selects[0]);
		window.close();
	}
}
