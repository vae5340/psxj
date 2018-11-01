var myChars,option,componentType,wtlx,reportInfo;
$(function(){
	$("#mapInfo_content").load("reportInfo.html");
	var tables = new Table();
	tables.Init();
	//初始化查询和日期
	searchBtn();
	//初始化图表
	//loadEcharts();
	
});
var TableReport =function(){
	TableReport = new Object();
	TableReport.Init=function(){
		$("#reportInfo").bootstrapTable({
			method: 'get',
			toggle:"tableCell",
			url:'/psxj/reportDelete/getToDay',
			rowStyle:"rowStyle",
			cache:false,
			pagination:true,
			dataType:'json',
			striped:true,
			sidePagination:"server",
			pageNumber: 1,
		    pageSize: 10,                       
		    pageList: [10, 25, 50, 100],
			queryParams: TableReport.queryParms,
			clickToSelect:true,
			columns:[
				{field:'deletePerson',title:'删除人',visible:true,align:'center'},
				{field:'deletePersonId',title:'联系方式',visible:true,align:'center',formatter:format_sslx},
				{field:'phoneBrand',title:'手机型号',visible:true,align:'center'}]
		});
	},
	TableReport.temp ={
			deleteTime: null,
   	        personUserId: null
	},
	TableReport.queryParms=function(params){
		var temp={
			pageSize:params.limit,
	        pageNo: params.offset/params.limit+1,
	        deleteTime: TableReport.temp.deleteTime,
   	        personUserId: TableReport.temp.personUserId
		}
	    	return temp;
	};
	return TableReport;
}
function refreshReportInfo(){
	$("#reportInfo").bootstrapTable('refresh');
}
//加载图表
var Table=function(){
	Table = new Object();
	Table.Init=function(){
		$("#table").bootstrapTable({
			method: 'get',
			toggle:"tableCell",
			url:'/psxj/reportDelete/getCountList',
			rowStyle:"rowStyle",
			cache:false,
			pagination:true,
			dataType:'json',
			striped:true,
			//sortable: true, 
			//sortName: 'TODAY',
			//sortOrder: "asc",
			sidePagination:"server",
			//showColums: true,
			//showRefresh: true,
			pageNumber: 1,
		    pageSize: 10,                       
		    pageList: [10, 25, 50, 100],
			queryParams:Table.queryParms,
			clickToSelect:true,
			columns:[
				{field:'USER_NAME',title:'上报人',visible:true},
				{field:'ORG_NAME',title:'所在单位',visible:true},
				{field:'LOGIN_NAME',title:'联系方式',visible:true,align:'center',formatter:format_sslx},
				{field:'PARENT_ORG_ID',title:'所在单位id',visible:false,align:'center'},
				{field:'REPORT_TYPE',title:'问题类型',visible:false,align:'center'},
				{field:'PERSON_USER_ID',title:'用户id',visible:false,align:'center'},
				{field:'TODAY',title:'当日删除数量',visible:true,align:'center',formatter:format_count},
				{field:'TOTAL',title:'删除总数',visible:true,align:'center'},
				{title:'操作',visible:true,align:'center',formatter: format_oper}]
		});
	},
	Table.queryParms=function(params){
		var temp = {
			pageSize:params.limit,
	        pageNo: params.offset/params.limit+1,
	        deletePerson : $("#deletePerson").val(),
	        parentOrgName : $("#parentOrgName").val(),
	        deleteTime: $("#startTime").val()
		};
		return temp;
	};
	return Table;
}
function toView(userid){
	if(userid){
		$("#myModalLabel_title").empty();
	    $("#myModalLabel_title").html("详情");
	    $("#mapInfo_list").modal('show');
	    if(!reportInfo){
	    	reportInfo = new TableReport();
	    	reportInfo.Init();
	    }
	    $("#reportInfo").bootstrapTable('load',[]);
	    if(reportInfo.temp){
			var star = $("#startTime").val();
			if(star)
				reportInfo.temp.deleteTime=$("#startTime").val();
			else
				reportInfo.temp.deleteTime = getLocalDate(new Date().getTime());
			reportInfo.temp.personUserId=userid;
		}
	    refreshReportInfo();
	}
}
//格式化设施类型
function format_sslx(val,row,index){
	if(val && val.length==11){
		return val;
	}else{
		return "";
	}
}
//操作
function format_oper(val,row,index){
	var b ='<button type="button" class="btn btn-primary btn-sm" onclick="toView('+row.PERSON_USER_ID+')">详细</button>';
	return b; 
}
//格式化时间
function format_date(val,rows,index){
	if(val)
		return getLocalTime(val.time);
	else
		return "";
}
//格式化状态
function format_count(val,rows,index){
	if(val && Number(val)>=10){
		return '<font color="red">'+val+'</font>';
	}else{
		return '<font color="read">'+val+'</font>';
	}
}
//刷新 
function refreshTable(){
	$("#table").bootstrapTable('refresh');
}
//搜索
function search(){
	refreshTable();
}
//时间查询
function searchBtn(){
	$("#startTime").datetimepicker({
		format: 'yyyy-mm-dd',
		autoclose:true, 
   		pickerPosition:'bottom-right', // 样式
   	    language: 'zh-CN',
   		minView: 2,    // 显示到小时 ,  0是小时
   		initialDate: new Date(),  // 初始化日期
   		todayBtn: true  //默认显示今日按钮
  	});
	$("#endTime").datetimepicker({
		format: 'yyyy-mm-dd hh:ii',
		autoclose:true, 
   		pickerPosition:'bottom-right', // 样式
   		minView: 0,    // 显示到小时
   		initialDate: new Date(),  // 初始化日期
   		todayBtn: true  //默认显示今日按钮
	});
}

//清除查询条件（清除input hidden框的查询条件）
function refreshContext(){
	$("input[type=hidden]").each(function(){
		$(this).val("");
	});
}
//清空
function resets(){
	$("div input").val("");
	refreshTable();
}
//跳回到map地图
function toMap(){
	var aTab = parent.$(".page-tabs-content a[data-id*='wrapper-map']");
    aTab.addClass("active").siblings(".J_menuTab").removeClass("active");
    var aContent = parent.$(".J_mainContent .J_iframe[data-id*='wrapper-map']");
    aContent.show().siblings(".J_iframe").hide();
}
