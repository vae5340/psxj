var myChar,totalChart,option;
$(function(){
    //设置默认值为当天(默认有数据的时间)
    //$('#startTime').val(getZeroDate('day').pattern('yyyy-MM-dd'));
    $('#startTime').val(new Date(1522814400000).pattern('yyyy-MM-dd'));

	var tables = new Table();
	tables.Init();
	//初始化日期
	
	//初始化时间控件
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
			url:'/psxj/dailySign/getDailySignList',
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
				{field:'signerId',title:'签到人编号',visible:false,align:'center'},
				{field:'signerName',title:'签到人名称',visible:true,align:'center'},
                {field:'orgName',title:'所属区域',visible:true,align:'center'},
				{field:'signTime',title:'签到时间',visible:true,align:'center',formatter: format_date},
				{field:'road',title:'签到道路',visible:true,align:'center'},
				{field:'addr',title:'签到位置',visible:true,align:'center'},
                {field:'orgSeq',title:'机构编号',visible:false,align:'center'},
				{title:'操作',visible:true,align:'center',formatter: format_oper}]
		});
	},
	Table.queryParms=function(params){
		var temp = {
			pageSize:params.limit,
	        pageNo: params.offset/params.limit+1,
	        startTime : getElementTime("#startTime"),
			signerName: $("#signerName").val(),
			orgName: $('#orgName').val(),
            orderBy: 'signTime',
            orderDir:'desc'
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
		return getLocalTime(val);
	else
		return "";
}
//刷新 
function refreshTable(){
	$("#table").bootstrapTable('refresh');
    // $('#orgName').val('');
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
		title : "查询签到信息",
		btn:['确定','取消'],
		content: ['dailySignInput.html?id='+thisId, 'yes']
	});
}
//时间控件初始化
function searchBtn(){
	//刷新
	$("#startTime").datetimepicker({
		format: 'yyyy-mm-dd',
		autoclose:true,
   		pickerPosition:'bottom-right', // 样式
   		minView: 2,    // 显示到天
   		initialDate: new Date(),  // 初始化日期
   		todayBtn: true,  //默认显示今日按钮
		language:'zh-CN'//显示中文
  	}).on('changeDate',function(ev){
		if(ev.date){
            searchEarch();
            refreshTable();
            // var today=getZeroDate('day').pattern('yyyy-MM-dd');
            // var setDate=ev.date.pattern('yyyy-MM-dd');
            //今日按钮的样式调整
			replaceClass('allTimeBtn', 'btn-primary', 'btn-default');
		}
	});

	$("#allTimeBtn").click(function(){//今日
		replaceClass('allTimeBtn','btn-default','btn-primary');
		$("#startTime").val('');
		// option.title.text="今日签到统计";
		searchEarch();
		refreshTable();

	});
	// $("#last30DaysBtn").click(function(){//最近30天
	// 	var newDate = new Date();
	// 	var weekTime= newDate.getTime()-1000*60*60*24*30;
	// 	$("#startTime").val(new Date(weekTime).pattern('yyyy-MM-dd HH:mm:ss'));
	// 	$("#endTime").val(new Date().pattern('yyyy-MM-dd HH:mm:ss'));
	// 	option.title.text="最近30天日志统计";
	// 	searchEarch();
	// 	refreshTable();
	// });
}
function replaceClass(id,srcClass,destClass){
    $('#'+id).removeClass(srcClass);
    $('#'+id).addClass(destClass);
}


//初始化表格数据
function loadEcharts(){
	if(options){
		option = options;
		// myChar = echarts.init(document.getElementById('chartContainer'));
        myChar = echarts.init($('#chartContainer').get(0));
		myChar.setOption(option);
		//汇总表
		totalChart=echarts.init($('#totalChart').get(0));
		//加载统计图表数据
		loadDataEacha();
		window.onresize = myChar.resize; //自适应窗口大小
		myChar.on('click',echartsLoadDate);
        totalChart.on('click',echartsLoadDate);
	}
}
//图表的点击事件查询
function echartsLoadDate(params){
	var name = params.name;
	$("#orgName").val(name);
	search();
	//刷新图表
	// searchEarch();
}
//刷新图表
function searchEarch(){
	var temp = {
        startTime : getElementTime("#startTime"),
        endTime: getElementTime("#endTime")
		// layerName : $("#layerName").val()
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

//格式化日期
function formatLocalDate(formatDate){
	if(formatDate) {
        formatDate = parseInt(formatDate.substr(4, 2)) + '月' + parseInt(formatDate.substr(6, 2)) + '日';
        return formatDate;
    }
}
//获取到的数据动态生成图表
function loadDataEacha(temp){
	var data = loadEachr.loadData("/psxj/dailySign/getStatisticsInfo",temp? temp:null);
    var option_data= [],unsign_data=[];
    var xAxis_data=[];
    //处理返回数据
	if(data.data.length){
        var dataAttr;
        var legendData={};
		legendData.data=[];
		//处理子机构数据
		for(var n=0;n<data.data.length;n++) {
            var formatDate = formatLocalDate(data.data[n].signDate);
            legendData.data.push(formatDate);
            option_data = [];
            unsign_data = [];
            var orgs = data.data[n].childOrgs;
            //初始化横坐标
            if (n == 0) {
                for (var k in orgs) {
                    xAxis_data.push(orgs[k].orgName);
                }
                option.xAxis[n].data = xAxis_data;
                dataAttr = option.xAxis[n].data;
            }
            //匹配横坐标，填充表格数据
            for (var i in orgs) {
                var item = orgs[i];
                for (var k = 0; k < dataAttr.length; k++) {
                    if (item.orgName.indexOf(dataAttr[k]) != -1) {
                        option_data[k] = item.signNumber;
                        unsign_data[k] = item.total - item.signNumber;
                        break;
                    }
                }
            }
            //处理异常数据
            for (var i in dataAttr) {
                if (!option_data[i]) option_data[i] = 0;
            }
			option.series[n].data = option_data;
			option.series[n].name = formatDate;
            option.series[n+2].name = formatDate+'未签到';
			option.series[n+2].data=unsign_data;
        }
        option.legend=legendData;
		setOption();
		//处理统计数据
        for(var n=0;n<data.data.length;n++) {
            formatDate=formatLocalDate(data.data[n].signDate);
            pie_option.series[n].data[0].value=data.data[n].signNumber;
            pie_option.series[n].data[0].name=formatDate+'已签';
            pie_option.series[n].name=formatDate;
            pie_option.series[n].data[1].value=data.data[n].total-data.data[n].signNumber;
            pie_option.series[n].data[1].name=formatDate+'未签';
        }
        //统计表格式设置
        totalChart.setOption(pie_option);
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
//复制对象
function clone(myObj){
    if(typeof(myObj) != 'object') return myObj;
    if(myObj == null) return myObj;
    var myNewObj = new Object();
    for(var i in myObj)
        myNewObj[i] = clone(myObj[i]);
    return myNewObj;
}
