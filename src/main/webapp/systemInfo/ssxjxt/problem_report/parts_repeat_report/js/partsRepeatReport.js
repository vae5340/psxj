var myChars,option,componentType,wtlx;
var usid_="";
var layerName_="";
$(function(){
	//初始化设施类型数据字典
	initComponentType();
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
function initComponentType(){
	$.ajax({
        type:'post',
        url:'/psxj/rest/report/listWtsbTree',
        data:{},
        dataType:'json',
        success:function(result){
        	if(result){
        		componentType=result.facility_type;
        		wtlx=result.wtlx3;
        		for(var i in result.facility_type){//设施类型
        			item = result.facility_type[i];
        			$("#componentType").append("<option value='"+item.code+"'>"+item.name+"</option>");
        		}
        		for(var i in result.yzdw){//上报单位
        			item = result.yzdw[i];
        			$("#parentOrgId").append("<option value='"+item.orgId+"'>"+item.orgName+"</option>");
        		}
        		//审核状态
        		$("#shzt").append("<option value='1'>未审核</option>");
        		$("#shzt").append("<option value='2'>已审核</option>");
        		$("#shzt").append("<option value='3'>存在疑问</option>");
        		var Tables = new Table();
        		Tables.Init();
        		var DetailTables = new DetailTable();
        		DetailTables.Init();
        	}
        }
    });
}

//加载重复上报图表
var Table=function(){
	Table = new Object();
	Table.Init=function(){
		$("#table").bootstrapTable({
			method: 'get',
			toggle:"tableCell",
			url:'/psxj/correctMark/getRepeatReport',
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
				{field:'usid',title:'设施编号',visible:false,align:'center'},
				{field:'layerName',title:'设施类型',visible:true,align:'center'},
				{field:'road',title:'所在道路',visible:true,align:'center'},
				{field:'attrFour',title:'权属单位',visible:true,align:'center'},
				{field:'sbcs',title:'上报次数',visible:true,align:'center'},
				{title:'操作',visible:true,align:'center',formatter: format_oper}]
		});
	},
	Table.queryParms=function(params){
		var temp = {
			pageSize:params.limit,
	        pageNo: params.offset/params.limit+1,
	        layerName : $("#componentType").find("option:selected").text(),
	        road : $("#szdl").val(),
	        attrFour : $("#qsdw").val()
		};
		return temp;
	}
	return Table;
}
//加载上报明细图表
var DetailTable=function(){
	DetailTable = new Object();
	DetailTable.Init=function(){
		$("#detailTable").bootstrapTable({
			method: 'get',
			toggle:"tableCell",
			url:'/psxj/correctMark/getRepeatReportDetail',
			rowStyle:"rowStyle",
			cache:false,
			pagination:true,
			dataType:'json',
			striped:true,
			sidePagination:"server",
			pageNumber: 1,
		    pageSize: 10,                       
		    pageList: [10, 25, 50, 100],
			queryParams:DetailTable.queryParms,
			clickToSelect:true,
			columns:[
				{field:'id',title:'编号',visible:false,algin:'center'},
				{field:'layerId',title:'图层id',visible:false,align:'center'},
				{field:'markPerson',title:'上报人',visible:true,align:'center'},
				{field:'parentOrgName',title:'上报单位',visible:true,align:'center'},
				{field:'road',title:'所在道路',visible:true,align:'center'},
				{field:'layerName',title:'设施类型',visible:true,align:'center'},
				{field:'correctType',title:'核准类型',visible:true,align:'center'},
				{field:'markTime',title:'上报时间',visible:true,align:'center',formatter: format_date},
				{title:'操作',visible:true,align:'center',formatter: format_oper_view}
			]
		});
	},
	DetailTable.queryParms=function(params){
		var temp = {
			pageSize:params.limit,
	        pageNo: params.offset/params.limit+1,
	        layerName : layerName_,
	        usid : usid_
		};
		return temp;
	}
	return DetailTable;
}
//格式化设施类型
function format_sslx(val,row,index){
	if(val){
		for(var i in componentType){
			if(val==componentType[i].code){
				return componentType[i].name;
			}
		}
		return val;
	}else{
		return "";
	}
}
//格式化审核状态
function format_checkState(val,row,index){
	if(val){
		if("1"==val){
			return "未审核";
		}else if("2"==val){
			return "已审核";
		}else if("3"==val){
			return "存在疑问";
		}else{
			return "未同步";
		}
			
	}else{
		return "未同步";
	}
}
function format_isBinding(val,row,index){
	if(val){
		if("0"==val)
			return "数据新增";
		else
			return "";
	}else{
		return "";
	}
}


//操作
function format_oper(val,row,index){
	var b ='<button type="button" class="btn btn-primary btn-sm" onclick="toDetail(\''+row.usid +'\',\''+row.layerName+'\')">上报明细</button>';
	
	return b; 
}
function format_oper_view(val,row,index){
	var b ='<button type="button" class="btn btn-primary btn-sm" onclick="toCorrectInfor('+row.id +')">查看</button>';
	
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
function format_state(val,rows,index){
	if(val){
		if(rows.isbyself=="true"){
			return "自行处理";
		}else if("active"==val){
			return "办理中";
		}else if("ended"==val){
			return "已办结";
		}else{
			return "";
		}
	}
	else
		return "自行处理";
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
//上报明细
function toDetail(usid,layerName){
	layerName_=layerName;
	usid_=usid;
	$("#detailTable").bootstrapTable('refresh');
	layer.open({
		type: 1,
		area: ['1150px', '550px'],
		maxmin: true,
		title : "查看上报明细",	
		btn:['确定','取消'],
		content: $('#detailPanel')
	});
}

//数据纠错详情页面
function toCorrectInfor(thisId){
	layer.open({
		type: 2,
		area: ['1050px', '550px'],
		title : "查看详情信息",	
		maxmin: true,
		btn:['确定','取消'],
		content: ['/psxj/systemInfo/ssxjxt/problem_report/parts_correct/correctInput.html?id='+thisId+'&type=view', 'yes']
	});
}

//2清除查询条件（清除input hidden框的查询条件）
function refreshContext(){
	$("input[type=hidden]").each(function(){
		$(this).val("");
	});
}

//定位
function toPoint(x,y){
	if(x && y){
		toMap();
		window.parent.positPoint(x,y);
	}
}
//跳回到map地图
function toMap(){
	var aTab = parent.$(".page-tabs-content a[data-id*='wrapper-map']");
    aTab.addClass("active").siblings(".J_menuTab").removeClass("active");
    var aContent = parent.$(".J_mainContent .J_iframe[data-id*='wrapper-map']");
    aContent.show().siblings(".J_iframe").hide();
}
