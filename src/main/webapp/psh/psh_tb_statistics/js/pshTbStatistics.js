var myChar1,myChar2,myChar3,option,openFlag;
$(function(){
	//初始化第一层图表
	loadEcharts('1');	
	//初始化数据列表
	var onetables = new oneTable();
	onetables.Init();
	var twotables = new twoTable();
	twotables.Init();
	var threetables = new threeTable();
	threetables.Init();
});
//第一层加载区统计的图表
function loadEcharts(flag){
	openFlag=flag;
	setStyle(flag);
	if(options1){
		option = options1;
		if(openFlag=='1'){
			myChar1 = echarts.init(document.getElementById('oneChartContainer'));
			myChar1.setOption(options1);
			myChar1.on('click',loadSecondEcharts);
			//加载统计图表数据
			loadDataEacha11();
			window.onresize = myChar1.resize; //自适应窗口大小
		}else if(openFlag=='2'){
			myChar2 = echarts.init(document.getElementById('twoChartContainer'));
			myChar2.setOption(options2);
			myChar2.on('click',loadSecondEcharts);
			//加载统计图表数据
			loadDataEacha21();
			window.onresize = myChar2.resize; //自适应窗口大小
		}else if(openFlag=='3'){
			myChar3 = echarts.init(document.getElementById('threeChartContainer'));
			myChar3.setOption(options3);
			myChar3.on('click',loadSecondEcharts);
			//加载统计图表数据
			loadDataEacha31();
			window.onresize = myChar3.resize; //自适应窗口大小
		}
		
//		window.onresize = myChar1.resize; //自适应窗口大小
	}
}
//第二层镇街统计报表,通过点击第一层图表触发
function loadSecondEcharts(param){
	setSecondStyle(openFlag);
	var name = param.name;//区
	$("#parentOrgName").val(name);
	if(options11){
		if(openFlag=='1'){
			options11.title.subtext=name;
			myChar1 = echarts.init(document.getElementById('oneChartContainer1'));
			myChar1.setOption(options11);
			myChar1.on('click',loadThirdEcharts);
			//加载统计图表数据
			loadDataEacha12(name);
		}else if(openFlag=='2'){
			options22.title.subtext=name;
			myChar2 = echarts.init(document.getElementById('twoChartContainer1'));
			myChar2.setOption(options22);
			myChar2.on('click',loadThirdEcharts);
			//加载统计图表数据
			loadDataEacha22(name);
		}else if(openFlag=='3'){
			options33.title.subtext=name;
			myChar3 = echarts.init(document.getElementById('threeChartContainer1'));
			myChar3.setOption(options33);
			myChar3.on('click',loadThirdEcharts);
			//加载统计图表数据
			loadDataEacha32(name);
		}
		//加载统计图表数据
//		loadDataEacha();
//		window.onresize = myChar1.resize; //自适应窗口大小
	}
}
//第三层列表统计
function loadThirdEcharts(param){
	setThirdStyle(openFlag);
	var name = param.name;//镇街
	$("#teamOrgName").val(name);
	if(openFlag=='2'){
		search2();
	}else if(openFlag=='3'){
		search3();
	}else{
		search1();
	}
//	$("#parentOrgName").val();
	//刷新图表
//	searchEarch();
}
//显示和隐藏
function setStyle(flag){
	if(flag=='2'){
		$("#one_li").removeClass("active");
		$("#two_li").addClass("active");
		$("#three_li").removeClass("active");
		
		$("#one_Tab").removeClass("tab-pane fade in active");
		$("#one_Tab").addClass("tab-pane");
		$("#two_Tab").addClass("tab-pane fade in active");
		$("#three_Tab").removeClass("tab-pane fade in active");
		$("#three_Tab").addClass("tab-pane");
	}else if(flag=='3'){
		$("#two_li").removeClass("active");
		$("#three_li").addClass("active");
		$("#one_li").removeClass("active");
		
		$("#one_Tab").removeClass("tab-pane fade in active");
		$("#one_Tab").addClass("tab-pane");
		$("#three_Tab").addClass("tab-pane fade in active");
		$("#two_Tab").removeClass("tab-pane fade in active");
		$("#two_Tab").addClass("tab-pane");
	}else{
		$("#two_li").removeClass("active");
		$("#one_li").addClass("active");
		$("#three_li").removeClass("active");
		
		$("#two_Tab").removeClass("tab-pane fade in active");
		$("#two_Tab").addClass("tab-pane");
		$("#one_Tab").addClass("tab-pane fade in active");
		$("#three_Tab").removeClass("tab-pane fade in active");
		$("#three_Tab").addClass("tab-pane");
	}
}

//显示和隐藏第二层
function setSecondStyle(flag){
	if(flag=='2'){
		$("#two_Tab1").addClass("tab-pane fade in active");
	}else if(flag=='3'){
		$("#three_Tab1").addClass("tab-pane fade in active");
	}else{
		$("#one_Tab1").addClass("tab-pane fade in active");
	}
}

//显示和隐藏第三层
function setThirdStyle(flag){
	if(flag=='2'){
		$("#two_Tab2").show()
		$("#two_Tab2").addClass("tab-pane fade in active");
	}else if(flag=='3'){
		$("#three_Tab2").show()
		$("#three_Tab2").addClass("tab-pane fade in active");
	}else{
		$("#one_Tab2").show()
		$("#one_Tab2").addClass("tab-pane fade in active");
	}
}

var oneTable=function(){
	oneTable = new Object();
	oneTable.Init=function(){
		$("#oneTable").bootstrapTable({
			method: 'get',
			toggle:"tableCell",
			url:'/psxj/statistics/getSbedInf',
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
			queryParams:oneTable.queryParms,
			clickToSelect:true,
			onLoadSuccess: function(data){ //加载成功时执行
				appendTable(data);
			},
			columns:[
				{field:'id',title:'编号',visible:false,algin:'center'},
				{field:'markPerson',title:'上报人',visible:true,align:'center'},
				{field:'loginName',title:'联系方式',visible:true,align:'center'},
				{field:'addr',title:'地址',visible:true,align:'center'},
				{field:'dischargerType1',title:'行业大类',visible:true,align:'center'},
				{field:'dischargerType2',title:'行业小类',visible:true,align:'center'},
				{field:'markTime',title:'上报时间',visible:true,align:'center',formatter: format_date},
				{field:'parentOrgName',title:'上报单位',visible:true,align:'center'},
				{field:'teamOrgName',title:'所属镇街',visible:true,align:'center'},
				{field:'state',title:'审核状态',visible:true,align:'center',formatter: format_checkState}
				]
		});
	},
	oneTable.queryParms=function(params){
		var temp = {
			pageSize:params.limit,
	        pageNo: params.offset/params.limit+1,
	        orgName : $("#parentOrgName").val(),
	        teamName: $("#teamOrgName").val()
	    };
		return temp;
	}
	return oneTable;
}

var twoTable=function(){
	twoTable = new Object();
	twoTable.Init=function(){
		$("#twoTable").bootstrapTable({
			method: 'get',
			toggle:"tableCell",
			url:'/psxj/statistics/getInstalledInf',
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
			queryParams:twoTable.queryParms,
			clickToSelect:true,
			onLoadSuccess: function(data){ //加载成功时执行
				appendTable(data);
			},
			columns:[
				{field:'id',title:'编号',visible:false,algin:'center'},
				{field:'loginName',title:'联系方式',visible:true,align:'center'},
				{field:'userName',title:'上报人',visible:true,align:'center'},
				{field:'installTime',title:'安装时间',visible:true,align:'center',formatter: format_date},
				{field:'parentOrgName',title:'上报单位',visible:true,align:'center'},
				{field:'teamOrgName',title:'所属镇街',visible:true,align:'center'}
				]
		});
	},
	twoTable.queryParms=function(params){
		var temp = {
			pageSize:params.limit,
	        pageNo: params.offset/params.limit+1,
	        orgName : $("#parentOrgName").val(),
	        teamName: $("#teamOrgName").val()
	    };
		return temp;
	}
	return twoTable;
}

var threeTable=function(){
	threeTable = new Object();
	threeTable.Init=function(){
		$("#threeTable").bootstrapTable({
			method: 'get',
			toggle:"tableCell",
			url:'/psxj/statistics/pshRyStatistics',
			method: 'get',
			rowStyle:"rowStyle",
			cache:false,
			pagination:true,
			dataType:'json',
			striped:true,
			sidePagination:"client",
			pageNumber: 1,
		    pageSize: 10,                       
		    pageList: [10, 25, 50, 100],
			queryParams:threeTable.queryParms,
			clickToSelect:true,
			onLoadSuccess: function(data){ //加载成功时执行
				appendTable(data);
			},
			columns:[
				{field:'userId',title:'id',visible:false,algin:'center'},
				{field:'userCode',title:'用户编号',visible:true,align:'center'},
				{field:'userName',title:'用户姓名',visible:true,align:'center'},
				{field:'title',title:'职位',visible:true,align:'center'},
				{field:'mobile',title:'电话',visible:true,align:'center'}]
		});
	},
	threeTable.queryParms=function(params){
		var temp = {
			pageSize:params.limit,
	        pageNo: params.offset/params.limit+1,
	        orgName : $("#parentOrgName").val(),
	        teamName: $("#teamOrgName").val()
	    };
		return temp;
	}
	return threeTable;
}
//操作
function format_oper(val,row,index){
	var a="",b ='<button type="button" class="btn btn-primary btn-sm" onclick="toInfor('+row.id +',\''+row.reportType+'\')">查看</button>';
	if(row.layerId && row.objectId){
		a+='&nbsp;<button type="button" class="btn btn-primary btn-sm" onclick="toPoint('+row.layerId+','+row.objectId+')">定位</button>';
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
//刷新 
function refreshTable(){
	$("#oneTable").bootstrapTable('refresh');
	$("#twoTable").bootstrapTable('refresh');
	$("#threeTable").bootstrapTable('refresh');
}
//搜索
function search1(){
	$("#oneTable").bootstrapTable('refresh');
}
function search2(){
	$("#twoTable").bootstrapTable('refresh');
}
function search3(){
	$("#threeTable").bootstrapTable('refresh');
}
//刷新图表
function searchEarch(){
	var temp = {
		startTime: getElementTime("#startTime"),
		endTime: getElementTime("#endTime"),
		layerName : $("#layerName").val()
	};
	loadDataEacha(temp);
}
//清除查询条件（清除input hidden框的查询条件）
function refreshContext(){
	$("input[type=hidden]").each(function(){
		$(this).val("");
	});
}
function toPoint(layerId,objectId){
	toMap();
	window.parent.openQuerys(objectId,layerId);
}
//第一个tab第一层
function loadDataEacha11(temp){
	var data = loadEachr.loadData("/psxj/pshDischarger/getSbedByArea",temp? temp:null);
	var dataAttr=options1.xAxis[0].data;
	var option_data= [];
	if(data){
		for(var i in data){
			var item = data[i];
			for(var k=0;k<dataAttr.length;k++){
				if((item.name).indexOf(dataAttr[k]) != -1){
					option_data[k]=item.count;
//					option_data0[k]=item.countAll;
				}
			}
		}
		for(var i in dataAttr){
			if(!option_data[i]) option_data[i]=0;
		}
//		options1.series[1].data=option_data1;
		options1.series[0].data=option_data;
		myChar1.setOption(options1);
	}
}
//第一个tab第二层
function loadDataEacha12(orgName){
	var temp = {
			orgName: orgName
		};
	var data = loadEachr.loadData("/psxj/statistics/getSbedByUnit",temp? temp:null);
	var dataAttr=options11.xAxis[0].data;
	var option_data= [];
	var option_x= [];
	if(data){
		for(var i in data){
			var item = data[i];
			option_data[i]=item.count;
			option_x[i]=item.name;
//			option_data1[i]=item.countAll;
		}
		options11.xAxis[0].data=option_x;//给X轴赋值
		options11.series[0].data=option_data;//给Y轴第一柱子赋值
		options11.series[1].data=option_data1;//给Y轴第二柱子赋值
		myChar1.setOption(options11);
	}
}
//第二个tab第一层
function loadDataEacha21(temp){
	var data = loadEachr.loadData("/psxj/pshDischarger/getInstalledByArea",temp? temp:null);
	var dataAttr=options2.xAxis[0].data;
	var option_data= [];
	var option_data0= [];
	if(data){
		for(var i in data){
			var item = data[i];
			for(var k=0;k<dataAttr.length;k++){
				if((item.name).indexOf(dataAttr[k]) != -1){
					option_data[k]=item.count;
					option_data0[k]=item.countAll;
				}
			}
		}
		for(var i in dataAttr){
			if(!option_data[i]) option_data[i]=0;
		}
        options22.xAxis[0].data=option_x;//给X轴赋值
		options2.series[0].data=option_data0;
		options2.series[1].data=option_data;
		myChar2.setOption(options22);
	}
}
//第二个tab第二层
function loadDataEacha22(orgName){
	var temp = {
			orgName: orgName
		};
	var data = loadEachr.loadData("/psxj/statistics/getInstalledByUnit",temp? temp:null);
	var option_data= [];
	var option_x= [];
	var option_data0= [];
	if(data){
		for(var i in data){
			var item = data[i];
			option_data[i]=item.count;
			option_x[i]=item.name;
			option_data0[i]=item.countAll;
		}
		//options2.xAxis[0].data=option_x;//给X轴赋值
		options2.series[1].data=option_data0;//给Y轴第一柱子赋值
		//options22.series[1].data=option_data;//给Y轴第二柱子赋值
		myChar2.setOption(options2);
	}
}
//第三个tab第一层
function loadDataEacha31(temp){
	var data = loadEachr.loadData("/psxj/statistics/pshQuStatistics",temp? temp:null);
	var dataAttr=options3.xAxis[0].data;
	var option_data= [];
	if(data){
		for(var i in data.rows){
			var item = data.rows[i];
			for(var k=0;k<dataAttr.length;k++){
				if(item[0].indexOf(dataAttr[k]) != -1){
					option_data[k]=item[1];
				}
			}
		}
		for(var i in dataAttr){
			if(!option_data[i]) option_data[i]=0;
		}
//		options3.series[0].data=option_data;
		options3.series[1].data=option_data;
		myChar3.setOption(options3);
	}
}
//第三个tab第二层
function loadDataEacha32(orgName){
	var temp = {
			orgName: orgName
		};
	var data = loadEachr.loadData("/psxj/statistics/pshZjStatistics",temp? temp:null);
	var option_data= [];
	var option_x= [];
	if(data){
		for(var i in data.rows){
			var item = data.rows[i];
			option_x[i]=item[0];
			option_data[i]=item[1];
		}
		options33.xAxis[0].data=option_x;
		options33.series[0].data=option_data;
		myChar3.clear();
		myChar3.setOption(options33);
	}
}
//从新加载图表数据
function setOption(){
	if(openFlag=='2'){
		myChar2.setOption(option);
	}else if(openFlag=='3'){
		myChar3.setOption(option);
	}else{
		myChar1.setOption(option);
	}
}
//拼接表头table
function appendTable(data){
	var dateStr= $("#parentOrgName").val()+' '+ $("#teamOrgName").val();
	if(openFlag=='2'){
		$('tr.Head2').remove();
		$("#twoTable thead").prepend('<tr class="Head2"><th style="text-align: center;" colspan="5">'+dateStr+' 已安装详细列表</th></tr>');	
	}else if(openFlag=='3'){
		$('tr.Head3').remove();
		$("#threeTable thead").prepend('<tr class="Head3"><th style="text-align: center;" colspan="4">'+dateStr+' 详细列表</th></tr>');	
	}else{
		$('tr.Head1').remove();
		$("#oneTable thead").prepend('<tr class="Head1"><th style="text-align: center;" colspan="19">'+dateStr+' 详细列表</th></tr>');	
	}
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