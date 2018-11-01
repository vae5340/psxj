var myChars,option;
$(function(){
	var tables = new Table();
	tables.Init();
	//初始化日期
	
	//查询点击事件
	searchBtn();
	//加载图表
	loadEcharts();
});

var Table=function(){
	Table = new Object();
	Table.Init=function(){
		$("#table").bootstrapTable({
			method: 'post',
			toggle:"tableCell",
			url:'/psxj/diary/getDiary',
			method: 'get',
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
				{field:'id',title:'编号',visible:false,algin:'center'},
				{field:'writerId',title:'标识人编号',visible:false,align:'center'},
				{field:'objectId',title:'设施编号',visible:false,align:'center'},
				{field:'writerName',title:'巡查人',visible:true,align:'center'},
				{field:'layerName',title:'上报类型',visible:true,align:'center'},
				{field:'recordTime',title:'记录时间',visible:true,align:'center',formatter: format_date},
				{field:'updateTime',title:'更新时间',visible:true,align:'center',formatter: format_date},
				{field:'road',title:'所属道路',visible:true,align:'center'},
				{field:'teamOrgName',title:'队伍',visible:true,align:'center'},
				{field:'directOrgName',title:'直属单位',visible:true,align:'center'},
				{field:'parentOrgName',title:'业主单位',visible:true,align:'center'},
				{title:'操作',visible:true,align:'center',formatter: format_oper}]
		});
	},
	Table.queryParms=function(params){
		var temp = {
			pageSize:params.limit,
	        pageNo: params.offset/params.limit+1,
	        //writerName : $("#writerName").val(),
	        //directOrgName : $("#directOrgName").val(),
	        startTime : getElementTime("#startTime"),
	        endTime: getElementTime("#endTime"),
	        parentOrgName : $("#parentOrgName").val(),
	        layerName : $("#layerName").val()
	       
		};
		return temp;
	}
	return Table;
}
//操作
function format_oper(val,row,index){
	var a="",b ='<button type="button" class="btn btn-primary btn-sm" onclick="toInfor('+row.id +')">查看</button>';
	if(row.objectId && row.layerName){
		var layerId = getLayerIdForLayerName(row.layerName);
		a+='&nbsp;<button type="button" class="btn btn-primary btn-sm" onclick="toPoint('+layerId+','+row.objectId+')">定位</button>';
	}
	return b+a; 
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
//详情页面
function toInfor(thisId){
	layer.open({
		type: 2,
		area: ['850px', '450px'],
		maxmin: true,
		title : "查看日志信息",	
		btn:['确定','取消'],
		content: ['diaryInput.html?id='+thisId, 'yes']
	});
}
//时间查询
function searchBtn(){
	//刷新
	$("#all-table").click(function(){
		option.title.text="全部日志统计";
		refreshContext();
		searchEarch();
		refreshTable();
	});
	$("#startTime").datetimepicker({
		format: 'yyyy-mm-dd hh:ii',
		autoclose:true, 
   		pickerPosition:'bottom-right', // 样式
   		minView: 0,    // 显示到小时
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
	$("#thisDayBtn").click(function(){//今日
		$("#startTime").val(getZeroDate('day').pattern('yyyy-MM-dd HH:mm:ss'));
		$("#endTime").val(new Date().pattern('yyyy-MM-dd HH:mm:ss'));
		option.title.text="今日日志统计";
		searchEarch();
		refreshTable();
	});
	$("#thiWeek").click(function(){//本周
		var start = getZeroDate('week');
		$("#startTime").val(start.pattern('yyyy-MM-dd HH:mm:ss'));
		$("#endTime").val(new Date().pattern('yyyy-MM-dd HH:mm:ss'));
		option.title.text="本周日志统计";
		searchEarch();
		refreshTable();
	});
	$("#thisMonthBtn").click(function(){//本月
		$("#startTime").val(getZeroDate('month').pattern('yyyy-MM-dd HH:mm:ss'));
		$("#endTime").val(new Date().pattern('yyyy-MM-dd HH:mm:ss'));
		option.title.text="本月日志统计";
		searchEarch();
		refreshTable();
	});
	$("#thisYearBtn").click(function(){//本年
		$("#startTime").val(getZeroDate('year').pattern('yyyy-MM-dd HH:mm:ss'));
		$("#endTime").val(new Date().pattern('yyyy-MM-dd HH:mm:ss'));
		option.title.text="年度日志统计";
		searchEarch();
		refreshTable();
	});
	$("#last30DaysBtn").click(function(){//最近30天
		var newDate = new Date();
		var weekTime= newDate.getTime()-1000*60*60*24*30;
		$("#startTime").val(new Date(weekTime).pattern('yyyy-MM-dd HH:mm:ss'));
		$("#endTime").val(new Date().pattern('yyyy-MM-dd HH:mm:ss'));
		option.title.text="最近30天日志统计";
		searchEarch();
		refreshTable();
	});
}

function loadEcharts(){
	if(options){
		option = options;
		option.title.text="全部日志统计";
		option.series[0].name="日志统计";
		myChar = echarts.init(document.getElementById('chartContainer'));
		myChar.setOption(option);
		//加载统计图表数据
		loadDataEacha();
		window.onresize = myChar.resize; //自适应窗口大小
		myChar.on('click',echartsLoadDate);
	}
}
//图表的点击事件查询
function echartsLoadDate(params){
	var name = params.name;
	$("#parentOrgName").val(name);
	search();
	//刷新图表
	searchEarch();
}
//刷新图表
function searchEarch(){
	var temp = {
        startTime : getElementTime("#startTime"),
        endTime: getElementTime("#endTime"),
		layerName : $("#layerName").val()
	};
	loadDataEacha(temp);
}
//清除查询条件（清除input框的查询条件）
function refreshContext(){
	$("input[type=hidden]").each(function(){
		$(this).val("");
	});
}
//定位
/*function toPoint(x,y){
	if(x && y){
		toMap();
		window.parent.positPoint(x,y);
	}
}*/
function toPoint(layerId,objectId){
	toMap();
	window.parent.openQuerys(objectId,layerId);
}
//跳回到map地图
function toMap(){
	var aTab = parent.$(".page-tabs-content a[data-id*='wrapper-map']");
    aTab.addClass("active").siblings(".J_menuTab").removeClass("active");
    var aContent = parent.$(".J_mainContent .J_iframe[data-id*='wrapper-map']");
    aContent.show().siblings(".J_iframe").hide();
}
//获取到的数据动态生成图表
function loadDataEacha(temp){
	var data = loadEachr.loadData("/psxj/diary/searchEachts",temp? temp:null);
	var dataAttr=option.xAxis[0].data;
	var option_data= [];
	if(data){
		for(var i in data.rows){
			var item = data.rows[i];
			for(var k=0;k<dataAttr.length;k++){
				if(item[0] && item[0].indexOf(dataAttr[k]) != -1){
					option_data[k]=item[1];
				}
			}
		}
		for(var i in dataAttr){
			if(!option_data[i]) option_data[i]=0;
		}
		option.series[0].data=option_data;
		setOption();
	}
}
//从新加载图表数据
function setOption(){
	myChar.setOption(option);
}
function getLayerIdForLayerName(layerName){
	var layerId;
	if(layerName){
		switch(layerName){
		case "阀门":
			layerId=0;
			break;
		case "泵站":
			layerId=1;
			break;
		case "溢流堰":
			layerId=2;
			break;
		case "排放口":
			layerId=3;
			break;
		case "拍门":
			layerId=4;
			break;
		case "雨水口":
			layerId=5;
			break;
		case "窨井":
			layerId=6;
			break;
		case "排水管道":
			layerId=7;
			break;
		case "排水沟渠":
			layerId=8;
			break;
		default:
			break;
		}
	}
	return layerId;
}
