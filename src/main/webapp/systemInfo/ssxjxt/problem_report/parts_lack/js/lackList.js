var myChars,option;
$(function(){
	//初始化设施类型数据字典
	initComponentType();
	//初始化查询和日期
	searchBtn();
	//初始化图表
	loadEcharts();
});
function initComponentType(){
	$.ajax({
        type:'post',
        //url:'/psxj/asi/municipalBuild/facilityLayout/metacodeitem!getItemList.action',
        url:'/psxj/rest/report/listWtsbTree',
        data:{},
        dataType:'json',
        success:function(result){
        	if(result){
        		componentType=result.facility_type;
        		wtlx=result.wtlx3;
        		for(var i in result.facility_type){
        			item = result.facility_type[i];
        			$("#componentType").append("<option value='"+item.name+"'>"+item.name+"</option>");
        		}
        		var tables = new Table();
        		tables.Init();
        	}
        }
    });
}
//加载图表

var Table=function(){
	Table = new Object();
	Table.Init=function(){
		$("#table").bootstrapTable({
			method: 'get',
			toggle:"tableCell",
			url:'/psxj/lackMark/getLackMarks',
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
				{field:'markPersonId',title:'上报人编号',visible:false,align:'center'},
				{field:'markPerson',title:'上报人',visible:true,align:'center'},
				{field:'componentType',title:'设施类型',visible:true,align:'center'},
				{field:'markTime',title:'上报时间',visible:true,align:'center',formatter: format_date},
				{field:'updateTime',title:'更新时间',visible:false,align:'center',formatter: format_date},
				{field:'isBinding',title:'上报类型',visible:true,align:'center',formatter: format_isBinding},
				{field:'road',title:'所在道路',visible:true,align:'center'},
				{field:'teamOrgName',title:'队伍',visible:false,align:'center'},
				{field:'directOrgName',title:'直属单位',visible:false,align:'center'},
				{field:'parentOrgName',title:'上报单位',visible:true,align:'center'},
				{field:'checkState',title:'审核状态',visible:true,align:'center',formatter: format_checkState},
				{title:'操作',visible:true,align:'center',formatter: format_oper}]
		});
	},
	Table.queryParms=function(params){
		var temp = {
			pageSize:params.limit,
	        pageNo: params.offset/params.limit+1,
	        //markPerson : $("#markPerson").val(),
	        //directOrgName : $("#directOrgName").val(),
	        //parentOrgName : $("#parentOrgName").val()
	        startTime : getElementTime("#startTime"),
            endTime :  getElementTime("#endTime"),
	        parentOrgName: $("#parentOrgName").val(),
	        componentType : $("#componentType").val()
		};
		return temp;
	}
	return Table;
}
//操作
function format_oper(val,row,index){
	var a="",b ='<button type="button" class="btn btn-primary btn-sm" onclick="toInfor('+row.id +')">查看</button>';
	if(row.x && row.y){
		a+='&nbsp;<button type="button" class="btn btn-primary btn-sm" onclick="toPoint('+row.x+','+row.y+')">定位</button>';
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
		title : "查看新增信息",	
		btn:['确定','取消'],
		content: ['lackInput.html?id='+thisId+'&type=view', 'yes']
	});
}
//时间查询
function searchBtn(){
	//刷新
	$("#all-table").click(function(){
		option.title.text="全部新增统计";
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
		option.title.text="今日新增统计";
		searchEarch();
		refreshTable();
	});
	$("#thiWeek").click(function(){//本周
		var start = getZeroDate('week');
		$("#startTime").val(start.pattern('yyyy-MM-dd HH:mm:ss'));
		$("#endTime").val(new Date().pattern('yyyy-MM-dd HH:mm:ss'));
		option.title.text="本周新增统计";
		searchEarch();
		refreshTable();
	});
	$("#thisMonthBtn").click(function(){//本月
		$("#startTime").val(getZeroDate('month').pattern('yyyy-MM-dd HH:mm:ss'));
		$("#endTime").val(new Date().pattern('yyyy-MM-dd HH:mm:ss'));
		option.title.text="本月新增统计";
		searchEarch();
		refreshTable();
	});
	$("#thisYearBtn").click(function(){//本年
		$("#startTime").val(getZeroDate('year').pattern('yyyy-MM-dd HH:mm:ss'));
		$("#endTime").val(new Date().pattern('yyyy-MM-dd HH:mm:ss'));
		option.title.text="年度新增统计";
		searchEarch();
		refreshTable();
	});
	$("#last30DaysBtn").click(function(){//最近30天
		var newDate = new Date();
		var weekTime= newDate.getTime()-1000*60*60*24*30;
		$("#startTime").val(new Date(weekTime).pattern('yyyy-MM-dd HH:mm:ss'));
		$("#endTime").val(new Date().pattern('yyyy-MM-dd HH:mm:ss'));
		option.title.text="最近30天新增统计";
		searchEarch();
		refreshTable();
	});
}

function loadEcharts(){
	if(options){
		option = options;
		options.title.text="全部新增统计";
		options.series[0].name="新增统计";
		myChar = echarts.init(document.getElementById('chartContainer'));
		myChar.setOption(options);
		//加载统计图表数据
		loadDataEacha();
		window.onresize = myChar.resize; //自适应窗口大小
		myChar.on('click',echartsLoadDate);
	}
}
//获取到的数据动态生成图表
function loadDataEacha(temp){
	var data = loadEachr.loadData("/psxj/lackMark/searchEachts",temp? temp:null);
	var dataAttr=option.xAxis[0].data;
	var option_data= [];
	if(data){
		for(var i in data.rows){
			var item = data.rows[i];
			for(var k=0;k<dataAttr.length;k++){
				if(item[0] && dataAttr[k] && item[0].indexOf(dataAttr[k]) != -1){
					option_data[k]=item[1];
				}
			}
		}
		option.series[0].data=option_data;
		setOption();
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
        endTime :  getElementTime("#endTime"),
		componentType : $("#componentType").val()
	};
	loadDataEacha(temp);
}
//清除查询条件（清除input hidden框的查询条件）
function refreshContext(){
	$("input[type=hidden]").each(function(){
		$(this).val("");
	});
}
//重新加载图表数据
function setOption(){
	myChar.setOption(option);
}
//获取到的数据动态生成图表
function loadDataEacha(temp){
	var data = loadEachr.loadData("/psxj/lackMark/searchEachts",temp? temp:null);
	var dataAttr=option.xAxis[0].data;
	var option_data= [];
	if(data){
		for(var i in data.rows){
			var item = data.rows[i];
			for(var k=0;k<dataAttr.length;k++){
				if(item[0] && dataAttr[k] && item[0].indexOf(dataAttr[k]) != -1){
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
