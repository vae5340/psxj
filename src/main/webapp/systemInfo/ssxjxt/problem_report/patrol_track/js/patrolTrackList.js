$(function(){
	initDatetimepicker();
	//初始化设施类型数据字典
	initComponentType();
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
function initComponentType(){
	$.ajax({
        type:'post',
        url:'/psxj/rest/report/listWtsbTree',
        data:{},
        dataType:'json',
        success:function(result){
        	if(result){
        		for(var i in result.yzdw){//上报单位
        			item = result.yzdw[i];
        			$("#parentOrgId").append("<option value='"+item.orgId+"'>"+item.orgName+"</option>");
        		}
        		var Tables = new Table();
        		Tables.Init();
        	}
        }
    });
}
//加载列表
var Table=function(){
	Table = new Object();
	Table.Init=function(){
		$("#table").bootstrapTable({
			method: 'get',
			toggle:"tableCell",
			url:'/psxj/trackLine/getPageList',//
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
				{field:'parentOrgName',title:'巡检单位',visible:true,align:'center'},
				{field:'markPerson',title:'巡检人',visible:true,align:'center'},
				{field:'recordLength',title:'巡检距离(m)',visible:true,align:'center'},
				{field:'startTime',title:'巡检开始时间',visible:true,align:'center',formatter: format_date},
				{field:'endTime',title:'巡检结束时间',visible:true,align:'center',formatter: format_date},
				{title:'操作',visible:true,align:'center',formatter: format_oper}]
		});
	},
	Table.queryParms=function(params){
		var temp = {
			pageSize:params.limit,
	        pageNo: params.offset/params.limit+1,
	        startTime : $("#startTime").val(),
	        endTime :  $("#endTime").val(),
	        parentOrgId : $("#parentOrgId").val(),
	        markPerson : $("#sbr").val(),
	     };
		return temp;
	}
	return Table;
}
//操作
function format_oper(val,row,index){
	var a="";
	a+='<button type="button" class="btn btn-primary btn-sm" onclick="trackPlayback('+row.id+')">轨迹回放</button>';
	return a;
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
//人员实时分布
function peopleLocate(){
	$.ajax({
		method : 'get',
		url:'/psxj/trackPoint/getFormByParentOrgId',
		data:{"parentOrgId":$("#parentOrgId").val()},
		dataType: 'json',
		success : function(data){
			if(data.code=="200" && data.data && data.data.length>0){
				toMap();
				window.parent.peopleLocate(data.data);
			}else{
				layer.msg('暂无人员实时分布信息！', {icon: 7});
			}
		}
	});
}
//接驳井定位
function trackPlayback(id){
	var trackPlayback = new window.top.TrackPlayback()
	toMap();
	var timeout = function(){
        trackPlayback.go();
        if (trackPlayback.inum <trackPlayback.icount) {
            window.setTimeout(function(){
                timeout();
			}, "100");
        }else{
        	window.top.layer.msg('轨迹回放完成!',{icon:1});
		}
    };
    trackPlayback.init(id,timeout);
	//window.parent.trackPlayback(id);
}
//跳回到map地图
function toMap(){
	var aTab = parent.$(".page-tabs-content a[data-id*='wrapper-map']");
    aTab.addClass("active").siblings(".J_menuTab").removeClass("active");
    var aContent = parent.$(".J_mainContent .J_iframe[data-id*='wrapper-map']");
    aContent.show().siblings(".J_iframe").hide();
}

