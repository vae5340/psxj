define(['jquery','appFunc'],function($,appFunc){
    function init(divId,callback){
		//地图初始化相关的脚本
		require([
		"dojo/ready",
		"esri/map",
		"custom/tdt/TDTLayer",
		"esri/geometry/Extent",
		"esri/dijit/Scalebar",
		"esri/symbols/SimpleLineSymbol",
		"esri/Color",
		"custom/InfoPanel/InfoPanel",
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
		], function (ready) {
			ready(function () {
				initMap(divId,callback);
				//ssjkData.ssjkInit();//在线监控
			});
		});
	}

	var map;
	var sls;
	var outLineGraphic;
	var fl;
	var mapGlobe = {};
	var graphicsArr = new Array();
	var graphicLayerArr = new Array();
	//地图初始化
	function initMap(divId,callback) {
		map = new esri.Map(divId, {
			logo: false,
			center: [108.3113111601501,22.820486635299154], 
			extent: new esri.geometry.Extent({
				xmin: 107.23452588182978,
				ymin: 21.813379881292327,
				xmax: 110.3840906318817,
				ymax: 24.252829164596033,
				spatialReference:{wkid:4326}
			}),
			zoom: 9
		});
		dojo.connect(map, "onLayerAdd", function() {
			AutoClickLenged(17);
		});
		map.addLayer(createVECLayer()); //添加在线底图
		map.addLayer(createCVALayer()); //添加在线底图
		//map.addLayer(createTomcatLayer()); // 加载离线地图
		sls = new esri.symbol.SimpleLineSymbol().setWidth(3).setColor(new esri.Color([0,255,255])).setStyle(esri.symbol.SimpleLineSymbol.STYLE_SHORTDOT);   
        if(callback)
			 callback(map,graphicLayerArr);
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

	//创建地图
	function createVECLayer(){
		var layer = new tdt.TDTLayer("vec");
		// layer.setOpacity(.60);
		return layer;
	}
	//创建地图
	function createCVALayer(){
		var layer = new tdt.TDTLayer("cva");
		// layer.setOpacity(.60);
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
	function AutoClickLenged(est_type){
		if(graphicLayerArr.length>0){
			if(!$("#ssjk_"+est_type+"Li").hasClass("hover")){
				$("#ssjk_"+est_type+"Li").addClass("hover");
			}
			appFunc.showLayer(true,"ssjk_"+est_type);
		}
	}
	function getMap(){
		return map;
	}

	return{
		init: init,
		getMap: getMap,
		graphicLayerArr: graphicLayerArr
	}
});