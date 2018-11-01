var myChars,option,componentType,wtlx;
var usid_="";
var layerName_="";
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


//加载表单
var Table=function(){
	Table = new Object();
	Table.Init=function(){
		$("#table").bootstrapTable({
			method: 'get',
			toggle:"tableCell",
			url:'/psxj/map-print-mark!getList.action',
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
				{field:'userName',title:'用户名称',visible:true,align:'center'},
				{field:'ip',title:'ip地址',visible:true,align:'center'},
				{field:'area',title:'打印面积（平方公里）',visible:true,align:'center'},
				{field:'createTime',title:'打印时间',visible:true,align:'center',formatter: format_date},
				{title:'操作',visible:true,align:'center',formatter: format_oper}]
		});
	},
	Table.queryParms=function(params){
		var temp = {
			pageSize:params.limit,
	        pageNo: params.offset/params.limit+1,
	        userName : $("#userName").val(),
	        startTime : $("#startTime").val(),
	        endTime :  $("#endTime").val(),
		};
		return temp;
	}
	return Table;
}

//操作
function format_oper(val,row,index){
	var a ='<button type="button" class="btn btn-primary btn-sm" onclick="viewArea('+row.xMin+','+row.xMax+','+row.yMin+','+row.yMax+')">查看范围</button>';
	if(row.xMin && row.xMax && row.yMin && row.yMax){
		return a;
	}else{
		return '';
	}
	 
}
//格式化时间
function format_date(val,rows,index){
	if(val)
		return getLocalTime(val.time);
	else
		return "";
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
//接驳井定位
function viewArea(xMin , xMax , yMin , yMax){
	toMap();
	window.parent.positionArea(xMin , xMax , yMin , yMax);
}
//跳回到map地图
function toMap(){
	var aTab = parent.$(".page-tabs-content a[data-id*='wrapper-map']");
    aTab.addClass("active").siblings(".J_menuTab").removeClass("active");
    var aContent = parent.$(".J_mainContent .J_iframe[data-id*='wrapper-map']");
    aContent.show().siblings(".J_iframe").hide();
}
