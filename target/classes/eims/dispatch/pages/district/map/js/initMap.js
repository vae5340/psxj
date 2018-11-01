define(['jquery'],function($){
	function init(_recordId,mapDivId,callback){
        recordId = _recordId;
		//地图初始化相关的脚本
		require([
		"esri/map",
		"custom/tdt/TDTLayer",
		"esri/dijit/Scalebar",
		"esri/symbols/SimpleLineSymbol",
		"esri/Color",
		"esri/InfoTemplate",
		"esri/layers/FeatureLayer",
		"esri/layers/ArcGISDynamicMapServiceLayer",
		"esri/layers/LabelLayer",
		"esri/symbols/TextSymbol",
		"esri/symbols/Font",
		"esri/symbols/SimpleFillSymbol",
		"esri/renderers/SimpleRenderer",
		"esri/layers/GraphicsLayer",
		"esri/graphic",
		"esri/geometry/Point",
		"esri/tasks/query"
		]);

		initMap(mapDivId,callback);
		
		refreshLayer();//添加并更新人员实时数据
		//intervalIndex=setInterval(refreshLayer,10000);
	}

    //成员单位预案编号
    var recordId;
    //刷新图层句柄
    var intervalIndex;
	var map;
	var sls;
	var outLineGraphic;
	var fl;
	var mapGlobe = {};

	var graphicsArr = new Array();
	var graphicLayerArr = new Array();
	//地图初始化
	function initMap(mapDivId,callback) {
		map = new esri.Map(mapDivId, {
			logo: false,
			center: [108.3113111601501,22.820486635299154], 
			extent: new esri.geometry.Extent({
				xmin: 107.23452588182978,
				ymin: 21.813379881292327,
				xmax: 110.3840906318817,
				ymax: 24.252829164596033,
				spatialReference:{wkid:4326}
			}),
			zoom: 10,
			minZoom:6
		});
		map.addLayer(createVECLayer()); //添加南宁底图
		map.addLayer(createCVALayer()); //添加南宁底图
		//map.addLayer(createTomcatLayer());
		//addPipeNetworkLayer();//添加地下管网数据
		//sls = new esri.symbol.SimpleLineSymbol().setWidth(2).setColor(new esri.Color([0,255,255])).setStyle(esri.symbol.SimpleLineSymbol.STYLE_SOLID);   
		sls = new esri.symbol.SimpleLineSymbol().setWidth(3).setColor(new esri.Color([0,255,255])).setStyle(esri.symbol.SimpleLineSymbol.STYLE_SHORTDOT);
		
		map.on("zoom-end", function (e) {
			if(outLineGraphic){   
				var radius = map.extent.getWidth() / 135;
				var centP=outLineGraphic.geometry.getCenter();
				var extent = new esri.geometry.Extent({
					"xmin":centP.x-radius,
					"ymin":centP.y-radius,
					"xmax":centP.x+radius,
					"ymax":centP.y+radius,
					"spatialReference":{wkid:4326}
				});
				outLineGraphic.setGeometry(extent);
			}
		});   
		
		if(callback)
			callback(map,graphicLayerArr);
	}

    //关闭刷新图层事件
    function stopInterval(){
        clearInterval(intervalIndex);
    }

	function createGTWMTSLayer(){
		var layer = new tdt.SuperMapLayer({id: "GTWMTS" });
		layer.setOpacity(.60);
		return layer;
	}
	function createGTBZWMTSLayer(){
		var layer = new tdt.SuperMapBZLayer({id: "GTBZWMTS" });
		layer.setOpacity(.60);
		return layer;
	}
	function createTomcatLayer() {
		var layer = new tdt.TomcatLayer({ url: "/map/Layers/_alllayers", id: "NNVectorLayer" });
		return layer;
	}

	function createVECLayer(){
		var layer = new tdt.TDTLayer("vec");
		layer.setOpacity(.60);
		return layer;
	}

	function createCVALayer(){
		var layer = new tdt.TDTLayer("cva");
		layer.setOpacity(.60);
		return layer;
	}

	function createDTLayer() {
		var url="http://192.1.1.224:8399/arcgis/rest/services/map2015/MapServer";
		var layer = new esri.layers.ArcGISTiledMapServiceLayer(url);
		return layer;
	}

	//添加比例尺
	function addScalebar() {
		var scalebar = new esri.dijit.Scalebar({
			map: map,
			attachTo: 'bottom-left',
			scalebarUnit: "dual"
		});
	}

	//添加HOME键
	function addHomeButton() {
		var home = new esri.dijit.HomeButton({
			map: map
		}, "HomeButton");
		home.startup();
	}

	//创建地图
	function createTomcatLayer(){
		var layer = new tdt.TomcatLayer({url: "/map/Layers/_alllayers", id: "NNVectorLayer" });
		return layer;
	}

	function centerAtJsd(x,y){
		var pt = new esri.geometry.Point(x,y,map.spatialReference);
		if(outLineGraphic!=null)
			map.graphics.remove(outLineGraphic);			
		var radius = map.extent.getWidth() / 100;
		var extent = new esri.geometry.Extent({"xmin":pt.x-radius,"ymin":pt.y-radius,"xmax":pt.x+radius,"ymax":pt.y+radius});
		outLineGraphic = new esri.Graphic(extent, sls);
		map.graphics.add(outLineGraphic);
		map.centerAt(pt);
		setTimeout(function(){
			map.graphics.remove(outLineGraphic);
			setTimeout(function(){
				map.graphics.add(outLineGraphic);
				setTimeout(function(){
					map.graphics.remove(outLineGraphic);
				},200);
			},300);
		},300);
	}

	//获取图层根据Id
	function getMapLayer(LayerId){
		var graphicsLayer=null;
		if(map.getLayer(LayerId)){
			graphicsLayer=map.getLayer(LayerId);
		} else {
			graphicsLayer = new esri.layers.GraphicsLayer({id: LayerId});
			map.addLayers([graphicsLayer]);
		}
		return graphicsLayer;
	}

	//添加并更新人员实时数据
	function refreshLayer(){
		var TeamLayer = getMapLayer("TeamLayer");
		TeamLayer.clear();
		var OPLayer = getMapLayer("OPLayer");
		OPLayer.clear();
		$.getJSON("/psemgy/yaTeamDispatch/nowRecordDispatchGps?modelId="+recordId,function(data){
			$.each(data.list,function(index,obj){
				if(obj.longitude&&obj.latitude&&obj.longitude!=""&&obj.latitude!=""){
					var pt = new esri.geometry.Point(obj.longitude,obj.latitude,map.spatialReference);
					var attr = {"team_id":obj.team_id,"name":obj.name,"contact":obj.contact};
					var symbol = new esri.symbol.PictureMarkerSymbol("/awater/fms/temp_icon/ico/user_suit.gif", 20, 20);
					var graphic = new esri.Graphic(pt,symbol,attr);
					TeamLayer.add(graphic);
					
					var textsymbol = new esri.symbol.TextSymbol(obj.contact).setOffset(0, 15).setColor(new esri.Color([255,0,0])).setHaloColor(new esri.Color([255,255,255])).setHaloSize(3);
					var textGraphic = new esri.Graphic(pt,textsymbol,attr);
					TeamLayer.add(textGraphic);
					
					if(obj.problem_report_total&&obj.problem_report_total>0){
						var imgUrl="";
						if(obj.problem_report_total<5)
							imgUrl="/awater/img/num_icon/"+obj.problem_report_total+".png";
						else 
							imgUrl="/awater/img/num_icon/5.png";
						var symbolReportNum = new esri.symbol.PictureMarkerSymbol(imgUrl, 20, 20).setOffset(25,5);
						var graphicReportNum = new esri.Graphic(pt,symbolReportNum,attr);
						var infoTemplate = new esri.InfoTemplate();
						
						infoTemplate.setTitle(getInfoTemplateTitle(obj.problem_report_total,obj.problem_report_row));
						infoTemplate.setContent(getInfoTemplateContent(obj.problem_report_total,obj.problem_report_row));
						graphicReportNum.setInfoTemplate(infoTemplate);
						TeamLayer.add(graphicReportNum);
					}
				}
			});
		});
	}

	function getInfoTemplateTitle(total,row){
		if(total==1)
			return row[0].PROBLEM_NAME;
		else
			return "已上报"+total+"个易涝隐患点问题";
	}
	function getInfoTemplateContent(total,row){
		var content;
		if(total==1){
			var openWay;
			if(row[0].PROBLEM_ACTION==5)
				openWay="showOProblem";
			else
				openWay="showProblem";
			content="事件名称：<a href=\"#\" onclick="+openWay+"("+row[0].ID+")\">"+row[0].PROBLEM_NAME+"</a><br/>"+
				"问题描述："+row[0].PROBLEM_DESCRIPTION+"<br/>"+
				"上报时间："+getCNLocalTime(row[0].PROBLEM_TIME.time)+"<br/>"+
				"问题状态："+(row[0].PROBLEM_STATUS==1?"已处理":"<font color='red'>未处理</font>");
				var imgHtml="";
				for(var i in row[0].img_Src){
					imgHtml+="<img src='/agsupport"+row[0].img_Src[i].FILE_PATH+"' onclick='changeBigger(this);' style='width:120px;height:120px;' />";
				}
				content = content+"<br />"+imgHtml;
		} else {
			content="";
			for(var num in row){
				var openWay;
				if(row[num].PROBLEM_ACTION==5)
					openWay="showOProblem";
				else
					openWay="showProblem";
				var index=parseInt(num)+1;
				content+=index+"、事件名称：<a href=\"#\" onclick="+openWay+"("+row[num].ID+")\">"+row[num].PROBLEM_NAME+"</a><br/>"+
					"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;问题状态："+(row[num].PROBLEM_STATUS==1?"已处理":"<font color='red'>未处理</font>")+"<br/>";
				var imgHtml="";
				for(var i in row[num].img_Src)
					imgHtml+="<img src='/agsupport"+row[num].img_Src[i].FILE_PATH+"' onclick='changeBigger(this);' style='width:120px;height:120px;' />";
				content = content+"<br />"+imgHtml+"<br />";
			}
		}
		return content;
	}

	//点击放大图片
	function changeBigger(o){
		var width = $(o).width()*4;
		var height = $(o).height()*4;
		var screenWidth = $(window).width();
		var screenHeight = $(window).height();
		if(width>=screenWidth )
			width = screenWidth;
		if(height>=screenHeight)
			height = screenHeight;
		var imgInfo = $(o).attr("src");
		var index = window.top.layer.open({
			type:1,
			title:false,
			shadeClose:true,
			area:[width,height],
			content:'<img id="closePic" src="'+imgInfo+'" style="width:'+width+'px;height:'+height+'"px></img>'
		});
		
		$(window.top.document).on("click","#closePic",function(){			
			window.top.layer.close(index); 
		});
	}


	function locatePerson(e){
        var id=$(e.target).data("id");
		var TeamLayer = getMapLayer("TeamLayer");
		var teamGraphics = TeamLayer.graphics;
		for (var i=0;i<teamGraphics.length;i++){
			if(teamGraphics[i].attributes.team_id==id){
				centerAtJsd(teamGraphics[i].geometry.x,teamGraphics[i].geometry.y);
				return ;
			}
		}
		layer.msg("该抢险队未出勤!");
	}


	function locationOP(e){
        var id=$(e.target).data("id");		
		var OPLayer = getMapLayer("OPLayer");
		OPLayer.clear();
		
		var item =$("#table_problem").bootstrapTable("getRowByUniqueId",id);
		if(item.longitude&&item.latitude){
			var pt=new esri.geometry.Point(Number(item.longitude),Number(item.latitude),map.spatialReference);
			
			var symbol = new esri.symbol.PictureMarkerSymbol("/awater/img/info.gif", 20, 20);
			var graphic = new esri.Graphic(pt,symbol);
			OPLayer.add(graphic);
			
			var infoTemplate = new esri.InfoTemplate();
					
			infoTemplate.setTitle(item.problemName);
			infoTemplate.setContent(item.problemDescription);
			graphic.setInfoTemplate(infoTemplate);
			
			map.centerAndZoom(pt,13);
		} else {
			layer.msg("获取坐标失败");
		}
	}

	return{
		init: init,
		initMap: initMap,
		locatePerson: locatePerson,	
		locationOP: locationOP,
		getMap:function(){
			return map;
		},
		centerAtJsd: centerAtJsd,
		stopInterval: stopInterval,
		graphicLayerArr: graphicLayerArr,
		changeBigger: changeBigger,
		refreshLayer: refreshLayer
	}
});