define(['jquery','awaterui','ssjk-map','psemgy/eims/dispatch/pages/district/map/js/initMap','psemgy/eims/analysis/floodReview/js/jquery.easyui.slider.jk',
		'psemgy/eims/analysis/floodReview/js/jkJxss','psemgy/eims/analysis/floodReview/js/jkCsk','highcharts','mousewheel','customScrollbar'],
function($,awaterui,ssjkMap,initMap,sliderJk,jkCsk,jkJxss){
	//积水点编号
	var jsdId;
	//成员单位应急响应编号
	var yaId;
	//市级应急响应编号
	var yaCityId;
	//成员单位编号
	var districtUnitId;
	//地图页面window
	var controlMap;
	//视频播放对象
	var player;
	var districtYaObj;
	
	function init(_jsdId,_yaId){
		jsdId=_jsdId;
		yaId=_yaId;
		Highcharts.setOptions({ global: { useUTC: false } }); 

		initMap.init(yaId,"jsdHistoryMapDiv",function(){
			addOneJsdToMap(initMap.getMap(),jsdId);
		});

		jkCsk.init();
		jkJxss.init();

		//$("#jsdHistoryMapDiv").attr("src","map/map.html?jsdId="+jsdId);
		//controlMap=window.frames['mapDiv'];
		//$("#videoMoniter").append("<embed name=\"ply\" width=\"100%\" height=\"176\" id=\"ply\" src=\"/awater/nnwaterSystem/popup/ply/player.swf\" type=\"application/x-shockwave-flash\" flashvars=\"file=/awater/nnwaterSystem/popup/ply/a1.flv&amp;image=img/preview.gif&amp;autostart=true\" allowscriptaccess=\"always\" allowfullscreen=\"false\" quality=\"high\" bgcolor=\"red\">");
		//$("#videoMoniter").append("<embed name=\"ply\" width=\"100%\" height=\"176\" id=\"ply\" src=\"/awater/nnwaterSystem/popup/ply/player.swf\" type=\"application/x-shockwave-flash\" flashvars=\"file=/awater/nnwaterSystem/popup/ply/a3.flv&amp;image=img/preview.gif&amp;autostart=true\" allowscriptaccess=\"always\" allowfullscreen=\"false\" quality=\"high\" bgcolor=\"red\">");
				
		$.ajax({
			url: "/psemgy/yaRecordDistrict/inputJsonNoL?id="+yaId,
			dataType:'json',
			async: false,
			success: function(data){
				yaCityId=data.form.yaCityId;
				districtUnitId=data.form.districtUnitId;
				districtYaObj = data.form;
				$("#districtJsdRecord").html(data.form.templateName);
				$("#districtJsdA").on("click",function(){
					awaterui.createNewtab('/psemgy/eims/dispatch/pages/district/record/recordAlarmInput.html','成员单位应急预案详细',function(){
						require(["psemgy/eims/dispatch/pages/district/record/js/recordAlarmInput"],function(recordAlarmInput){
							recordAlarmInput.init("",data.form.id,1,districtUnitId,yaCityId);
						});
					});
				});
				//$("#superviseIframe").attr("src","/psemgy/eims/dispatch/pages/district/supervise/superviseNewsReviewWide.html?yaId="+yaCityId+"&districtUnitId="+districtUnitId);
				var startDateTime = new Date(data.form.recordCreateTime).format('yyyy-MM-dd hh:mm:ss');
				var endDateTime = new Date(data.form.recordCloseTime).format('yyyy-MM-dd hh:mm:ss');
				getRainData(startDateTime,endDateTime);
				getTeamData(startDateTime,endDateTime,yaId);
			},
			error:function(){
				alert("error");
			}
		});
		$.ajax({
			url: "/psemgy/yaRecordCity/inputJson?id="+yaCityId,
			dataType:'json',
			async: false,
			success: function(data){
				$("#cityJsdRecord").html(data.form.templateName);
				$("#cityJsdA").on("click",function(){
					awaterui.createNewtab('/psemgy/eims/dispatch/pages/municipal/record/recordInput.html','市级应急预案详细',function(){
						require(["psemgy/eims/dispatch/pages/municipal/record/js/recordInput"],function(recordInput){
							recordInput.init(data.form.id,0);
							
						});
					});
				});
			},
			error:function(){
				alert("error");
			}
		});
		var table_team_height=$("#ya_team").height()-$("#ya_team .panel-header").height();
		
		$("#table_jsd_team").bootstrapTable({
			height: table_team_height,
			toggle:"table",
			url :'/psemgy/yjTeam/listAllByModelId?modelId='+yaId,
			rowStyle:"rowStyle",
			search:false,
			columns: [
				{field:'id',visible: false,title: 'id'},
				//{field:'icon',visible: true,title: '操作',align:'center',formatter:operateFormatterPsn},
				{field:'contact',visible: true,title: '姓名',align:'center'},
				{field:'name',visible: true,title: '隶属部门',align:'center'}]
		});
		$("#table_jsd_team").on('post-body.bs.table', function (row,obj) {
			$(".fixed-table-body").mCustomScrollbar();
		});

		$("#waterLevelMoniter").mCustomScrollbar();
		
		$("#videoMoniter").mCustomScrollbar({mouseWheelPixels:100});
		
		$("#ya_title").mCustomScrollbar();
		
		$("#startJsdReviewButton").on("click",function(){
			sliderJk.playbackBtnOnClick();
		});
		$("#endJsdReviewButton").on("click",function(){
			sliderJk.stopbackBtnOnClick();
		});
	}

	function addOneJsdToMap(map,jsdId){
		$.ajax({
			type: 'get',
			url : '/agsupport/rest/pscomb/GetCombWithRadius',
			data:{"combId":jsdId,"radius":0.0000457763671875},
			dataType : 'json',  
			success : function(data) {
				var pt=new esri.geometry.Point(data.form.xcoor,data.form.ycoor,map.spatialReference);
				var graph  = new esri.Graphic(pt, new esri.symbol.PictureMarkerSymbol("/awater/monitoring/ssjk/img/legend_15x15/png/point_15px_jsd.png",15,15));
				map.graphics.add(graph);
				map.centerAndZoom(pt,15);
			},
			error : function (){
				alert("error");
			}
		});
	}


	//积水点
	var datasJSD=Array();
	datasJSD.push([
		[{typename:"积水点",y:0.10}],
		[{typename:"积水点",y:0.12}],
		[{typename:"积水点",y:0.16}],
		[{typename:"积水点",y:0.15}],
		[{typename:"积水点",y:0.30}],
		
		[{typename:"积水点",y:0.70}],
		[{typename:"积水点",y:0.90}],
		[{typename:"积水点",y:1.20}],
		[{typename:"积水点",y:1.40}],
		[{typename:"积水点",y:1.70}],
		
		[{typename:"积水点",y:1.70}],
		[{typename:"积水点",y:1.60}],
		[{typename:"积水点",y:1.40}],
		[{typename:"积水点",y:1.20}],
		[{typename:"积水点",y:0.90}],
		
		[{typename:"积水点",y:0.60}],
		[{typename:"积水点",y:0.40}],
		[{typename:"积水点",y:0.30}],
		[{typename:"积水点",y:0.20}],
		[{typename:"积水点",y:0.10}],
		[{typename:"积水点",y:0.10}]
	]);
	/**
	 * 日期转换
	 */
	Date.prototype.format =function(format){
		var o = {
			"M+" : this.getMonth()+1, //month
			"d+" : this.getDate(),    //day
			"h+" : this.getHours(),   //hour
			"m+" : this.getMinutes(), //minute
			"s+" : this.getSeconds(), //second
			"q+" : Math.floor((this.getMonth()+3)/3),  //quarter
			"S" : this.getMilliseconds() //millisecond
		}
		if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
				(this.getFullYear()+"").substr(4- RegExp.$1.length));
		for(var k in o)if(new RegExp("("+ k +")").test(format))
			format = format.replace(RegExp.$1,
					RegExp.$1.length==1? o[k] :
							("00"+ o[k]).substr((""+ o[k]).length));
		return format;
	}
	/**
	 * 获取降雨量数据
	 */
	function getRainData(stratTime,endTime){
		var param={
			s:stratTime,
			e:endTime
		}
		$.ajax({
			url: "/agsupport/rest/swmmTimeseriesRest/getForTime/?d="+new Date(), 
			data:param,
			dataType:'json',
			async: false,
			success: function(results){
				var datasYQ = new Array();
				$(results).each(function(index,item){
					datasYQ.push([item.dataMillisecond,item.value]);
				});
				loadYQData(datasYQ);
			},
			error:function(){
				
			}
		});	
	}

	function getRainData(startTime,endTime){
		var param={s:startTime,e:endTime}
		$.ajax({
			url: "/agsupport/rest/swmmTimeseriesRest/getForTime/?d="+new Date(), 
			data:param,
			dataType:'json',
			async: false,
			success: function(results){
				var datasYQ = new Array();
				$(results).each(function(index,item){
					datasYQ.push([item.dataMillisecond,item.value]);
				});
				loadYQData(datasYQ);
			},
			error:function(){
				
			}
		});	
	}
	var teamData;
	function getTeamData(startTime,endTime,yaId){
		$.ajax({
			url: "/psemgy/yjGpsRecord/loadFloodReviewTeamGps",
			data:{startTime:startTime,endTime:endTime,yaId:yaId},
			dataType:'json',
			cache: false,
			success: function(data){
				teamData = data;
			},
			error:function(){
				
			}
		});	
	}
	//地图定位调度物资位置
	function operateFormatterPsn(value, row, index) {
		return "<a onclick=\"javascript:controlMap.contentWindow.locatePerson("+row.id+")\"><img src=\"/awater/img/blue-gislocate.png\"></img></a>";
	}
	//格式化物资数量
	function operateFormatterNum(value, row, index) {     
		return value+row.unit;
	}
	//地图定位调度人员位置
	function locationGood(value, row, index) {
		return "<a onclick=\"javascript:controlMap.locateGood("+row.id+")\"><img src=\"/awater/img/blue-gislocate.png\"></img></a>";
	}

	function loadYQData(datasYQ){
		$('#containerYQ').highcharts({
			chart: {
				zoomType: 'x',
				spacingLeft:0,
				spacingBottom:0,
				spacingTop:20
			},
			title: {text: ''},
			subtitle:{
				text: '<span style="color:red;font-size:16px;">气象站雨量监测</span',
				align:'center',
				y:-8,
				useHTML:true,
				floating:true
			},
			xAxis: {
				type: 'datetime',
				labels: {  
					step: 3,   
					formatter: function () {  
						return Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.value);  
					}  
				}
			},
			yAxis: {
				title: {text: '降雨量(mm)'},
				min:0,
				reversed:true
			},
			legend: {enabled: false},
			plotOptions: {
				area: {
					fillColor: {
						linearGradient: {
							x1: 0,
							y1: 0,
							x2: 0,
							y2: 1
						},
						stops: [
							[0, Highcharts.getOptions().colors[0]],
							[1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
						]
					},
					marker: {radius: 2},
					lineWidth: 1,
					states: {
						hover: {lineWidth: 1}
					},
					threshold: null
				}
			},
			tooltip: {
				formatter: function () {
					var time = new Date(this.x);
					return  time.format('yyyy-MM-dd hh:mm:ss') + '<br /><span style="color:red;font-size:16px;">' + this.y + '</span>毫米';
				}
			},
			series: [{
				type: 'area',
				name: '降雨量',
				data: datasYQ
			}]
		});
	}

	return{ 
		init: init
	}
});