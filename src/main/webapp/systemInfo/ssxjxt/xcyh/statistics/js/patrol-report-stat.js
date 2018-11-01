var serverName = GetQueryString("serverName");
var myChart;
var regionID;
var regionLevel;
var countArr;
var titleText;
var colorArr = [[135, 195, 251, 224], [66, 152, 232, 224], [19, 114, 202, 224], [20, 88, 151, 224]];
var colorArrForEc = ['rgba(135,195,251,0.86)', 'rgba(66,152,232,0.86)', 'rgba(19,114,202,0.86)', 'rgba(20,88,151,0.86)'];
var selectedList;
var typeArr = [];
var gridDataSource={};//统计表格数据源
var columns;
var beginDate;
var endDate;
var whereSql ="";
var startPage = 1;
var pageNum=10;

var heatmap=null;
var prevGraphic;//被点击的定位图标对应的graphic
var graphicsLayerPoint;//地图定位点图层
var featureList = new Dictionary();
var isListItemClick = false;//列表项点击状态
var gisObject;
var infoTip;

var Index = {
    	init: function(){
    		var that = this;
    		this.vm = new ViewModel();
            ko.applyBindings(this.vm);
    		that.reset();
    		that.bindUI();
    		that.renderUI();
    	},
    	reset: function() {
		    var defaultOpts = {
		            totalPages: 10
		        };
		    $('#pagination').twbsPagination(defaultOpts);
	        var cellclass = function (row, columnfield, value) {
                return 'stat-cursor';
            };
    		columns = [
    					{id: "UploadUsernameStr",text: "巡查员",datafield: "uploadUsername",width: ($(window).width()-20)/5+"px",align: "center",cellsalign: "center"},
    					{id: "ProblemTypeStr",text: "问题类型",datafield: "problemType",width: ($(window).width()-20)/5+"px",align: "center",cellsalign: "center",resizable: false}, 
    					{id: "ReportEffectiveNumStr",text: "有效案件数",datafield: "reportEffectiveNum",width: ($(window).width()-20)/5+"px",align: "center",cellsalign: "center",resizable: false,cellclassname: cellclass}, 
    					{id: "ReportInvalidNumStr",text: "无效案件数",datafield: "reportInvalidNum",width: ($(window).width()-20)/5+"px",align: "center",cellsalign: "center",resizable: false,cellclassname: cellclass}, 
    					{id: "ReportTotalNumStr",text: "合计",datafield: "reportTotalNum",width: ($(window).width()-20)/5-5+"px",align: "center",cellsalign: "center",resizable: false,cellclassname: cellclass}
    				];
    		var date = new Date();
    		var now = date.getFullYear() + "-" + 
    				((date.getMonth()+1)<10 ? "0"+(date.getMonth()+1):(date.getMonth()+1)) + 
    				"-" +  (date.getDate()<10 ? ("0"+date.getDate()):(date.getDate()));
    		beginDate = now;
    		endDate = now;
    	},
    	renderUI: function(){
    		$("#dateFrom").val(beginDate);
    		$("#dateTo").val(endDate);
    		regionID = null;
    		regionLevel = Number(window.regionType);
    		countArr = 0;
    		titleText = window.regionName;
    		selectedList = new Array(3);
    		prevGraphic = null;
    	//	gisObject = window.parent.getGisObject();
    		
    		initGrid();
    		loadBacsicData();
    	},

    	bindUI: function(){
    		var that = this;
    		$("#dateFrom").click(function() {
    			WdatePicker({readOnly:true,maxDate:"#F{$dp.$D('dateTo')}"});
    		});
    		$("#dateTo").click(function() {
    			WdatePicker({readOnly:true, minDate:"#F{$dp.$D('dateFrom')}"});
    		});
    		$(".stat-search").click(function() {
    			loadBacsicData();
    		});
    		$(".stat-view").click(function() {
				$(".stat-panel").show();
				$(".stat-view").hide();
				$(".list-panel").hide();
				$(".search-tip").hide();
				prevGraphic = null;
				// window.parent.removeAllFeatures();
				loadHeatMapData();
    		});
    		$(".stat-table").on("cellclick", function (event){
    			startPage=1;
    			var args = event.args;
    			var columnIndex=args.columnindex;
    	    	whereSql="";
    	    	if(columnIndex<2){
    	    		return ;
    	    	}else if(columnIndex==2){
    	        	var uploadUsername = args.row.bounddata.uploadUsername;
    	        	var problemType = args.row.bounddata.problemType;
    	        	if(uploadUsername == '总计'){
    	        		whereSql = " and gxProblemReport5_.state not in (13)";   
    	        	}else{
    	        		if(problemType=='合计'){
    	        			whereSql = " and gxProblemReport5_.sbr = '"+uploadUsername+"' and gxProblemReport5_.state not in (13)";   
    	        		}else{
    	        			whereSql = " and gxProblemReport5_.sbr = '"+uploadUsername+"' and gxProblemReport5_.bhlx = '"+problemType+"' and gxProblemReport5_.state not in (13)";   
    	        		}            	
    	        	}     	
    	    	}else if(columnIndex==3){
    	         	var uploadUsername = args.row.bounddata.uploadUsername;
    	        	var problemType = args.row.bounddata.problemType;
    	        	
    	        	if(uploadUsername == '总计'){
    	        		whereSql = " and gxProblemReport5_.state = 13";   
    	        	}else{
    	        		if(problemType=='合计'){
    	        			whereSql = " and gxProblemReport5_.sbr = '"+uploadUsername+"' and gxProblemReport5_.state = 13";   
    	        		}else{
    	        			whereSql = " and gxProblemReport5_.sbr = '"+uploadUsername+"' and gxProblemReport5_.bhlx = '"+problemType+"' and gxProblemReport5_.state = 13";   
    	        		}            	
    	        	}
    	    	}else{
    	         	var uploadUsername = args.row.bounddata.uploadUsername;
    	        	var problemType = args.row.bounddata.problemType;
    	        	
    	        	if(uploadUsername == '总计'){
    	        		whereSql = "";   
    	        	}else{
    	        		if(problemType=='合计'){
    	        			whereSql = " and gxProblemReport5_.sbr = '"+uploadUsername+"'";   
    	        		}else{
    	        			whereSql = " and gxProblemReport5_.sbr = '"+uploadUsername+"' and gxProblemReport5_.bhlx = '"+problemType+"'";
    	        		}            	
    	        	}
    	        	
    	    	}
    	    	if(heatmap){
    	    		window.parent.removeHeatmap();
    	    	}
    	    	serchRecList(whereSql);
				$(".stat-panel").hide();
				$(".stat-view").show();
				$(".list-panel").show();
    		});
    		
    	},
		/* 列表点击事件处理 */
		listItemClickHandler: function(data) {
			var that = this;
			isListItemClick = true;
			var className = data.className;
			if (prevGraphic && args.className != prevGraphic ) {
				$("." + prevGraphic).css("background-color","");
				$("." + prevGraphic + " div").css("color","#1d1d1d");
				$("." + prevGraphic + " .listItemImg").css("background-position-y","-40px");
			}

			$("." + className).css("background-color", "#5FADF9");
			$("." + className + " div").css("color", "#fff");
			$("." + className + " .listItemImg").css("background-position-y", "0px");
			prevGraphic = className;
			// var AgcomWindow = window.parent.getAgcomWindow();
			var param = {
				    x : parseFloat(data.gpslongitude),
				    y : parseFloat(data.gpslatitude),
				    title : '',
				    "labelAlign": 'rb',
				    context : "<table><tr><td><span>上报时间：" +data.procStartdate+ "</span></td></tr>" +
				              "<tr><td><span>问题类型：" +data.busMemo4+ "</span></td></tr>" +
				              "<tr><td><span>问题描述：" +data.busMemo6+ "</span></td></tr>" +
				    		  "<tr><td><a href='javascript:clickItem(\'"+data.objectid+"\')'>详细信息</a></td></tr></table>",
				    allShow : false
				}
				// var infowindow = gisObject.mapcontrol.showInfowindow(param);
				// infowindow.setTitle('巡查上报案件信息');
		},
		projectInfo: function(item) {
			clickItem(item.objectid);
		}
}

Index.init();

// 弹出详细信息
function clickItem(id){
	var masterEntityKey=id;
	var serverName="psxj";
	var templateCode="GX_XCYH";
	var taskInstDbid="";
	$.ajax({
		type:"post",
		url: '/' + serverName + '/asi/xcyh/businessAccepted/ccproblem!getTaskInstDb.action',
		data:{"MASTER_ENTITY_KEY":id,"MASTER_ENTITY":"GX_PROBLEM_REPORT"},
		dataType:"json",
		async:false,
		cache:false,
		success:function(result){
			if(result.success==true){
				if(result.result!=null&&result.result.length>0){
					taskInstDbid=result.result[0][0];
				}
			}
		}
	});
	
	
	layer.open({
		type: 2,
		title: "详细信息",
		shadeClose: false,
		//closeBtn : [0 , true],
		shade: 0.5,
		maxmin: false, //开启最大化最小化按钮
		area: ['700px', '550px'],
		offset: ['120px', $(window).width()/2-400+'px'],
		content: "/psxj/systemInfo/ssxjxt/xcyh/xcyh/detail.html?serverName="+serverName+"&templateCode="+templateCode+"&taskInstDbid="+taskInstDbid+"&masterEntityKey="+masterEntityKey,
		cancel: function(){
		},
		end : function(){

		}

	});
}

//创建一个View对象
function ViewModel() {
	var self = this;
	self.listDataArray=ko.observableArray();
	self.listItemClick=$.proxy(Index.listItemClickHandler, Index);
	self.projectInfo=$.proxy(Index.projectInfo, Index);
	self.listItemImageClick=function(args) {
//		//定位前先判断坐标是否在地图范围内
//		if (args.x > 0 && args.y > 0) {
//			if (eUrban.global.mapUtil.map.initExtent) {
//				var mapExtent = eUrban.global.mapUtil.map.initExtent;
//				if (args.x >= mapExtent.xmin && args.x <= mapExtent.xmax &&
//					args.y >= mapExtent.ymin && args.y <= mapExtent.ymax) {
//					eUrban.global.mapUtil.zoomToExtent(Number(args.x), Number(args.y));
//				}
//			} else {
//				eUrban.global.mapUtil.zoomToExtent(Number(args.x), Number(args.y));
//			}
//		}
	};
	self.listItemImageHover=function(args) {
		if (args.className == prevGraphic) {
			isListItemClick = true;
			return;
		} else {
			isListItemClick = false;

			$("." + args.className).css("background-color","#E7EEF8");
			$("." + args.className + " .listItemImg").css("background-position-y","0px");
			var strs = args.className.split("-");
			var str = strs[strs.length-1];
			var index = str.substring(5,str.length);
			
			
			if (featureList.get(index)) {
				args.className = "list-group-item-image-index"+index;//用于给列表项增加序号图标
				var item = {};
				item["recID"] = args.busMemo1;
				item["procStartdate"] = args.procStartdate;
				item["busMemo4"] = args.busMemo4;
				item["busMemo6"] = args.busMemo6;
				item["className"] = args.className;
				item["x"] = Number(args.gpslongitude);
				item["y"] = Number(args.gpslatitude);
				item["symbolUrl"] = "image/recLoc"+index+".png";
				/*
    			gisObject.toolbar._drawVectors.removeFeatures(featureList.get(index));
    		    var AgcomWindow = window.parent.getAgcomWindow();
    			var geometry = new AgcomWindow.AG.MicMap.Geometry.Point(Number(args.gpslongitude),Number(args.gpslatitude));
    			var style = {
    			    url : 'com/augurit/resources/images/list/locBar_select'+index+'.png',
    			    "labelAlign": 'rb'
    			}
    			var feature = new AgcomWindow.AG.MicMap.Feature(geometry,item,style);
    			featureList.put(index, feature);
    			gisObject.toolbar._drawVectors.addFeatures(feature);
    			*/
			}
		}
	};
	self.listItemImageOut=function(args) {
		if (args.className == prevGraphic) {
			return;
		}
		$("." + args.className).css("background-color","");
		$("." + args.className + " div").css("color","#1d1d1d");
		$("." + args.className + " .listItemImg").css("background-position-y","-40px");
		var strs = args.className.split("-");
		var str = strs[strs.length-1];
		var index = str.substring(5,str.length);
		
		if (featureList.get(index)) {
			args.className = "list-group-item-image-index"+index;//用于给列表项增加序号图标
			var item = {};
			item["recID"] = args.busMemo1;
			item["procStartdate"] = args.procStartdate;
			item["busMemo4"] = args.busMemo4;
			item["busMemo6"] = args.busMemo6;
			item["className"] = args.className;
			item["x"] = Number(args.gpslongitude);
			item["y"] = Number(args.gpslatitude);
			item["symbolUrl"] = "image/recLoc"+index+".png";
			/*
			gisObject.toolbar._drawVectors.removeFeatures(featureList.get(index));
		    var AgcomWindow = window.parent.getAgcomWindow();
			var geometry = new AgcomWindow.AG.MicMap.Geometry.Point(Number(args.gpslongitude),Number(args.gpslatitude));
			var style = {
			    url : 'com/augurit/resources/images/list/locBar'+index+'.png',
			    "labelAlign": 'rb'
			}
			var feature = new AgcomWindow.AG.MicMap.Feature(geometry,item,style);
			featureList.put(index, feature);
			gisObject.toolbar._drawVectors.addFeatures(feature);
			*/
		}
	}
}

//$(function(){ 
//	reset();
//	bindUI();
//	renderUI();
//});

function initGrid() {
	var datadatafields = [];
	for(var i=0;i<columns.length;i++){
		datadatafields.push({name:columns[i].datafield,type:'string'});
	}
	gridDataSource ={
		localdata: [],
		datadatafields:datadatafields,
		datatype: "array"
	};
	var columnsDisplay = [];
	columnsDisplay = columns;
//	columnsDisplay.splice(0,2);
//	for (var i=0;i<3;i++) {
//		columnsDisplay.pop();
//	}
	var dataAdapter = new $.jqx.dataAdapter(gridDataSource);
	$(".stat-table").jqxGrid(
	{
		width: ($(window).width()-20),
		height: "40%",
		source: dataAdapter,
		theme: 'energyblue',
		rowsheight: 25,
		altrows: true,
		groupsheaderheight: 25,
		columnsheight: 25,
		selectionmode: 'singlecell',
		columns: columnsDisplay
	});
}

function serchRecList(whereSql){
	beginDate = $("#dateFrom").val();
	endDate = $("#dateTo").val();
	if(beginDate != null){
		var uploadStartTime =beginDate;  
		whereSql += " and gxProblemReport5_.sbsj >= to_date('"+uploadStartTime+"','yyyy-mm-dd HH24:mi:ss')";
	}
	if(endDate != null){
		var uploadEndTime =endDate;  
		whereSql += " and gxProblemReport5_.sbsj <= to_date('"+uploadEndTime+"','yyyy-mm-dd HH24:mi:ss')";
	}
//	if(uploadUsername != null && uploadUsername!=""){
//		whereSql += " and gxProblemReport5_.sbr like '%"+uploadUsername+"%'";
//	}
	var that = this;
	var requestURL = "";
	requestURL = "/"+serverName+"/asi/xcyh/statistics/patrol-report-stat!recList.action";
	$.ajax({
		type : "post" ,
		data : {
			whereSql: whereSql,
			searchFag:"zb",
			startPage:startPage,
			pageNum:pageNum
		},
		dataType : "json",
		url : requestURL,
		async : false,
		success :function(result){
			if (result.result[1]==null) {
				$(".list-datagroup-pager").hide();
				return;
			}
			var infoList = result.result[1];
			if (result.result[0].total > pageNum) {
				$(".list-datagroup-pager").show();
			}else{
				$(".list-datagroup-pager").hide();
			}
			if (infoList.length > 0) {
				$(".search-tip").hide();
			    $('#pagination').twbsPagination('destroy');
	            $('#pagination').twbsPagination({
	            	startPage:result.result[0].startPage,
	                totalPages: Math.ceil(result.result[0].total/pageNum),
	                visiblePages: 8,
	                first:"首页",
	                prev:"上一页",
	                next:"下一页",
	                last:"末页",
	                onPageClick: function (event, page) {
	                }
	            }).on('page', function (event, page) {
	            	startPage=page;         
	            	serchRecList(whereSql);
	            });
			} else {
				$(".search-tip").show();
			}
			setListData(infoList);
		}
	});
}

function loadBacsicData(){
	beginDate = $("#dateFrom").val();
	endDate = $("#dateTo").val();
	var that = this;
	var requestURL = "";
	requestURL = "/"+serverName+"/asi/xcyh/statistics/patrol-report-stat!listData.action";
	$.ajax({
		type : "post" ,
		data : {
			uploadStartTime: beginDate,
			uploadEndTime: endDate
		},
		dataType : "json",
		url : requestURL,
		async : false,
		success :function(result){
			var length = result.result.length;
			var list = result.result;
			var seriesData = [];
			var categories = [];
			var typeName = ['上报案卷数'];
			var pieSeriesData = [];
			var geoCoordObj = {};
			for (var i = 0; i < length ;i++){
				if (list[i].uploadUsername != "合计") {
					//生成地图上的饼图数据
					var coordX = Number(list[i].coordX);
					var coordY = Number(list[i].coordY);
					var uploadUsername = list[i].uploadUsername;
					var seriesItem = [];
					seriesItem.push({
						name: '上报案卷数',
						value: list[i].reportNum
					});
					pieSeriesData.push({
						name: uploadUsername,
						series: seriesItem
					});
					
					//生成柱状图数据
					var ar = list[i].reportEffectiveNum;
//								ar = Number(ar.substring(0,ar.length-1));
					seriesData.push(ar);
					categories.push(list[i].uploadUsername);
				}
			}
			gridDataSource.localdata=list;
			$(".stat-table").jqxGrid({
				source: gridDataSource              
			});
			if (length > 0) {
				$(".stat-chart-tip").hide();
				$(".stat-chart").show();
				that.drawStatBar(categories, seriesData);
				that.loadHeatMapData();
			} else {
				$(".stat-chart").hide();
				$(".stat-chart-tip").show();
			}
		}
	});
}

function loadHeatMapData(){
	if(heatmap){
		window.parent.removeHeatmap();
	}
	beginDate = $("#dateFrom").val();
	endDate = $("#dateTo").val();
	var that = this;
	var requestURL = "";
	requestURL = "/"+serverName+"/asi/xcyh/statistics/patrol-report-stat!chartData.action";
	$.ajax({
		type : "post" ,
		data : {
			uploadStartTime: beginDate,
			uploadEndTime: endDate
		},
		dataType : "json",
		url : requestURL,
		async : false,
		success :function(result){
			var length = result.result.length;
			var heatData = result.result;
			var heatMapData={
				    	max: length,
				    	data: heatData
				};
		//	heatmap=window.parent.addheatmap(heatMapData);
		}
	});
	// window.parent.moveAgcomWindowByWidth(1);
}

function drawStatBar(categories, seriesData) {
//	var that = this;
//	require(
//		[
//			'echarts',
//			'echarts/macarons'
//		],
//		function(ec, macarons) {
//		}
//	);
	// 基于准备好的dom，初始化echarts图表
	if (myChart) {
		myChart.clear();
	}
	myChart = echarts.init($(".stat-chart")[0]);
	option = {
		color: ['#ffd700'],
		tooltip: {
			trigger: 'axis',
			formatter: "{a} <br/> {b}: {c}" + "件"
		},
		calculable: false,
		grid: {
			x: 40,
			y: 30,
			x2: 10,
			y2: 65
		},
		xAxis: [
			{
				type: 'category',
				axisLabel: {
					interval: 0,
					rotate: 45
				},
				data: categories
			}
		],
		yAxis: [
			{
				type: 'value',
				name: '有效案件数(件)'
			}
		],
		series: [
			{
				name: '有效案件数',
				type: 'bar',
				barWidth: 20,
				data: seriesData
			}
		]
	};
	myChart.setOption(option);
}


function setListData(infoList) {
	var listData = infoList;
	//
	if(gisObject){
		window.parent.removeAllFeatures();
	}
	//更新列表数据
	var itemlist = [];
	for(var i=0;i<listData.length;i++){
		listData[i].className = "list-group-item-image-index"+(i+1);//用于给列表项增加序号图标
		var item = {};
		item["recID"] = listData[i].busMemo1;
		item["procStartdate"] = listData[i].procStartdate;
		item["busMemo4"] = listData[i].busMemo4;
		item["busMemo6"] = listData[i].busMemo6;
		item["className"] = listData[i].className;
		item["x"] = Number(listData[i].gpslongitude);
		item["y"] = Number(listData[i].gpslatitude);
		item["symbolUrl"] = "image/recLoc"+(i+1)+".png";
		itemlist.push(item);
		
    	if (listData[i].gpslongitude != null && listData[i].gpslongitude != '' && listData[i].gpslongitude !=0 
    			&& listData[i].gpslatitude != null && listData[i].gpslatitude != '' && listData[i].gpslatitude !=0) {
    			/*
    		    var AgcomWindow = window.parent.getAgcomWindow();
    			var geometry = new AgcomWindow.AG.MicMap.Geometry.Point(listData[i].gpslongitude,listData[i].gpslatitude);
    			var style = {
    			    url : 'com/augurit/resources/images/list/locBar'+(i+1)+'.png',
    			    "labelAlign": 'rb'
    			}
    			var feature = new AgcomWindow.AG.MicMap.Feature(geometry,item,style);
    			featureList.put(i+1, feature);
    			gisObject.toolbar._drawVectors.addFeatures(feature);
    			*/
    	}
	}
	/*
	gisObject.toolbar._drawVectors.events.on({
		    'featureselected' : featureselectedHandler,
		    'featuredblclick' : featuredblclickHandler,
		    'featuremousedown' : featuremousedownHandler,
		    'featurerightselected' : featurerightselectedHandler,
		    scope : this
		});
	*/	
	Index.vm.listDataArray(listData);
}


function featureselectedHandler(o){//要素选中时处理函数
	var param = {
		    x : parseFloat(o.attributes.x),
		    y : parseFloat(o.attributes.y),
		    title : '',
		    context : "<table><tr><td><span>上报时间：" +o.attributes.procStartdate+ "</span></td></tr>" +
		              "<tr><td><span>问题类型：" +o.attributes.busMemo4+ "</span></td></tr>" +
		              "<tr><td><span>问题描述：" +o.attributes.busMemo6+ "</span></td></tr>" +
		    		  "<tr><td><a href='javascript:window.parent.parent.clickItem()'>详细信息</a></td></tr></table>",
		    allShow : true
		}
		var infowindow = gisObject.mapcontrol.showInfowindow(param);
		infowindow.setTitle('巡查上报案件信息');
}
function featuredblclickHandler(o){//双击要素时处理函数
}
function featuremousedownHandler(o){//鼠标按下要素时处理函数
}
function featurerightselectedHandler(o){//右键点击要素处理函数
}



function Dictionary(){
	this.data = new Array();

	this.put = function(key,value){
	 this.data[key] = value;
	};

	this.get = function(key){
	 return this.data[key];
	};

	this.remove = function(key){
	 this.data[key] = null;
	};

	this.isEmpty = function(){
	 return this.data.length == 0;
	};

	this.size = function(){
	 return this.data.length;
	};
}