var loginName = getQueryStr("loginName");
$(function(){
	var Tables = new Table();
	Tables.Init();
	initDatetimepicker();
});

function initDatetimepicker(){
	$(".form_datetime").datetimepicker({
		 format: "yyyy-mm-dd",
		 autoclose: true,
		 todayBtn: true,
		 todayHighlight: true,
		 showMeridian: true,
		 pickerPosition: "bottom-left",
		 language: 'zh-CN',//中文，需要引用zh-CN.js包
		 startView: 2,//月视图
		 minView: 2//日期时间选择器所能够提供的最精确的时间选择视图
	 });
}	
//加载列表
var Table=function(){
	Table = new Object();
	Table.Init=function(){
		$("#table").bootstrapTable({
			method: 'get',
			toggle:"tableCell",
			url:'/psxj/swj-assign!getAssignList.action',
			rowStyle:"rowStyle",
			cache:false,
			pagination:true,
			dataType:'json',
			striped:true,
			sidePagination:"server",
			pageNumber: 1,
		    pageSize: 10,                       
		    pageList: [10, 25, 50, 100],
			queryParams:Table.queryParms,
			clickToSelect:true,
			columns:[
				{field:'id',title:'主键',visible:false,align:'center'},
				{field:'assignId',title:'清单编号',visible:false,align:'center'},
				{field:'assignName',title:'清单名称',visible:true,align:'center'},
				{field:'assignPerson',title:'交办人',visible:true,align:'center'},
				{field:'assignDate',title:'交办时间',visible:true,align:'center',formatter: format_date},
				{title:'操作',visible:true,align:'center',formatter: format_oper}]
		});
	},
	Table.queryParms=function(params){
		var temp = {
			pageSize:params.limit,
	        pageNo: params.offset/params.limit+1,
	        assignName : $("#assignName").val(),
	        startTime : $("#startTime").val(),
	        endTime :  $("#endTime").val()
	   };
		return temp;
	}
	return Table;
}
//刷新 
function refreshTable(){
	$("#table").bootstrapTable('refresh');
}
//搜索
function search(){
	refreshTable();
}
//清空
function resets(){
	$('#myform')[0].reset();
	refreshTable();
}
//弹出图层initMap.js
function format_oper(val,rows,index){
	var a="";
	if(rows.assignId){
		a+='<button type="button" class="btn btn-primary btn-sm" onclick="parent.showFeedBackTc(\''+rows.assignId+'\')">查看地图</button>';
	}
	return a;
}

//格式化时间
function format_date(val,rows,index){
	if(val)
		return getLocalTime(val);
	else
		return "";
}