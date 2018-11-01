define([
    'dojo/_base/array',
    "esri/map",
    "esri/dijit/InfoWindowLite",
    "esri/InfoTemplate",
    "esri/dijit/Scalebar",
    "esri/geometry/Circle",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/TextSymbol",
    "esri/symbols/Font",
    "esri/symbols/SimpleFillSymbol",
    "esri/Color",
    "esri/layers/FeatureLayer",
    "esri/layers/ArcGISDynamicMapServiceLayer",
    "esri/layers/ArcGISTiledMapServiceLayer",
    "esri/layers/LabelLayer",
    "esri/renderers/SimpleRenderer",
    "esri/layers/GraphicsLayer",
    "esri/graphic",
    "esri/geometry/Point",
    "esri/tasks/query",
    "esri/geometry/Extent",
    "esri/SpatialReference",
	"esri/renderers/HeatmapRenderer",
    'esri/symbols/SimpleMarkerSymbol',
    'esri/geometry/screenUtils'
], function(
    array,
    Map,
    InfoWindowLite,
	InfoTemplate,
    Scalebar,
    Circle,
    SimpleLineSymbol,
    SimpleMarkerSymbol,
    TextSymbol,
    Font,
    SimpleFillSymbol,
    Color,
    FeatureLayer,
    ArcGISDynamicMapServiceLayer,
    ArcGISTiledMapServiceLayer,
    LabelLayer,
    SimpleRenderer,
    GraphicsLayer,
    Graphic,
    Point,
    Query,
    Extent,
    SpatialReference,
    pipeIdentify,
    zdmAnalysis,
    hdmAnalysis,
    upDownStreamAnalysis,
	SimpleMarkerSymbol,
    screenUtils
){
    var map;
	var graphicLayer;
	var allMarkers = [];//标记数组
	var infoTemplate;
	//初始化地图
	function init(_map){//外部初始化调用接口
        map = _map;
		//创建图层
		graphicLayer = new GraphicsLayer();
		//把图层添加到地图上
		map.addLayer(graphicLayer);
    }
	
    function initMarker(){//初始化地图操作模块
        map.on("click", function(e) {
			addMarker(e.mapPoint.x, e.mapPoint.y);
		});
		map.showZoomSlider();
    }

	function addMarker(xx,yy){
		//设置标注的经纬度
		var pt = new esri.geometry.Point(xx,yy,map.spatialReference);
		//设置标注显示的图标
		var symbol = new esri.symbol.PictureMarkerSymbol("/awater/waterSystem/ssjk/img/gdgc.png",25,25);
		
		//创建模板
		infoTemplate = new esri.InfoTemplate();
		//设置模板标题
		infoTemplate.setTitle("添加标注");

		var str = "<label>标题：</label><input type='text' id='title' value='我的标记' style='width:180px;' onfocus='if(value == \"我的标记\"){value=\"\"}' onblur='if (value == \"\"){value=\"我的标记\"}'/></br></br>"+
		"<label style='vertical-align:top'>备注：</label><textarea rows='5' id='content' style='resize:none;width:180px;' onfocus='if(value == \"我的备注\"){value=\"\"}' onblur='if (value == \"\"){value=\"我的备注\"}'>我的备注</textarea></br></br>"+
		"<div style='float:right'><input style='margin-right:10px;' type='button' value='保存' id='save' onclick='delgraph()'/>"+
		"<input type='button' value='删除' onclick='delete()'/></div>";
		
		var attr = {"id":1,"str":str};
		
		//设置模板内容
		infoTemplate.setContent(str);
		
		//创建图像
		var graphic = new esri.Graphic(pt,symbol,attr,infoTemplate);
		
		//把图像添加到刚才创建的图层上
		graphicLayer.add(graphic);
		
		setMapCenter(xx,yy,8);
	}
	
	function setMapCenter(xx,yy,level){
		var point = new esri.geometry.Point(xx,yy,map.spatialReference);
		map.centerAndZoom(point,level);
	}
    return {
        'init': init,
		'initMarker':initMarker
    };

});
