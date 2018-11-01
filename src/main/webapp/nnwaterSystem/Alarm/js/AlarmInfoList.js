
//数据填充	    
function getQueryStr(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = decodeURI(window.location.search).substr(1).match(reg);
	if (r != null) 
		return unescape(r[2]);
	return "";
}
$(function () {
	$("#table").bootstrapTable({
	    toggle:"table", 
	    url:"/agsupport/meteo-hydrolog-alarm!infoJson.action", 
		rowStyle:"rowStyle",
		cache:false, 
		pagination:true, 
		striped:true, 
		pageNumber:1,
		pageSize:10, 
		pageList:[10, 25, 50, 100], 
		queryParams:queryParams, 
		sidePagination:"server", 
		columns:[
			{field:"alarmTitle", title:"预警标题", align:"center"},
			{field:"alarmGrade", title:"预警级别", align:"center",formatter:alarmGrade_formatter}, 
			{field:"alarmTime", title:"预警时间", align:"center",formatter:createDate_formatter},
			{field:"alarmStatus", title:"预案状态", align:"center",formatter:alarmStatus_formatter}, 
			{title:"详情", align:"center",formatter:option_formatter}]
	});
		$("#startTime").datetimepicker({
      	language: 'zh-CN',
		format: 'yyyy-mm-dd',
		autoclose:true,
		minView:4,
		pickerPosition:'bottom-right'
	});
	$("#endTime").datetimepicker({
      	language: 'zh-CN',
		format: 'yyyy-mm-dd',
		autoclose:true,
		minView:4,
		pickerPosition:'bottom-right'
	});
})
function alarmGrade_formatter(value, row, index){
	if(value=='1')
		return '红色报警';
	else if(value=='2')
		return '橙色报警';
	else if(value=='3')
		return '黄色报警';	
	else  
		return '蓝色报警';
}

function alarmStatus_formatter(value, row, index){
	if(value=='1')return '未启动';
	else if(value=='2') return '已启动';
	else return '已关闭';
}
function createDate_formatter(value, row, index){
	if(value){
		return getLocalTime(value.time);
	}
	return '';
}

function queryParams(params) {
	return {
		pageSize:params.limit, 
		pageNo:params.offset / params.limit + 1,
		alarmTitle:$("#alarmTitle").val(),
		alarmTime:$("#startTime").val(),
		alarmTime:$("#endTime").val(),
	};
}

function option_formatter(value, row, index) {
	return "<button class='btn btn-primary' onclick='detailWindow(" + row.id + ")'>详细</button>";
}

function detailWindow(id) {
	layer.open({
		type:2, 
		shade:0.1,
		title:"气象水文预警详细", 
		area:["700px", "600px"], 
		content:"/awater/nnwaterSystem/Alarm/AlarmInput.html?Id=" + id
	});
}
function reloadData(){
	var query=new Object();
	query.alarmTitle=encodeURIComponent($("#alarmTitle").val());
	query.alarmSubtype=encodeURIComponent(getQueryStr("subtype"));
	
	if($("#startTime").val()!="")
		query.startTime=getTimeLong($("#startTime").val());
	if($("#endTime").val()!="")
		query.endTime=getTimeLong($("#endTime").val());
	
	$('#table').bootstrapTable('removeAll');
	$("#table").bootstrapTable('refresh', {
		url:"/agsupport/meteo-hydrolog-alarm!infoJson.action",
		query:query
	});
}
