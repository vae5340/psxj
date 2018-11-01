//地图初始化相关的脚本
mapOptions = {
    extent: { center: [108.40669180908202,22.815586677246095], zoom: 3 }, //设置地图的初始范围
    baseMap: {},
    featureLayers: {},
    service: {}
}

require([
	"esri/map", 
	"esri/graphic",
	"esri/toolbars/draw",
	"custom/tdt/TDTLayer", 
	"custom/tdt/TomcatLayer", 
	"custom/tdt/SuperMapLayer",
	"custom/tdt/SuperMapBZLayer",
	"esri/geometry/Polygon",
	"esri/dijit/LocateButton", 
	"esri/dijit/Scalebar", 
	"esri/dijit/HomeButton",
	"esri/symbols/SimpleLineSymbol", 
	"esri/symbols/SimpleMarkerSymbol",
	"esri/symbols/SimpleFillSymbol",
	"esri/Color",
	"custom/popup/PopupWin",
	"custom/InfoPanel/InfoPanel", 
	"esri/layers/FeatureLayer"
]);
require(["dojo/ready"], function (ready) {
    ready(function () {
        initMap();
        var btn = dojo.byId("drawButton");
		dojo.connect(btn, "click", activateTool);
    });
});

var map;
var mapGlobe = {};
var toolbar;
var graphicsArr = new Array();
var graphicsNNArr = new Array();

//创建地图工具
function createToolbar(themap) {
	toolbar = new esri.toolbars.Draw(map);
	toolbar.on("draw-end", addToMap);
}
//地图初始化
function initMap() {
    map = new esri.Map("mapDiv", {
    	logo: false,
		center: [108.3113111601501,22.820486635299154], 
		extent: new esri.geometry.Extent({
			xmin: 107.23452588182978,
			ymin: 21.813379881292327,
		    xmax: 110.3840906318817,
			ymax: 24.252829164596033,
			spatialReference:{wkid:4326}
		}),
		zoom: 13,
		minZoom:9
  	});
  	map.on("load", createToolbar);
	if(location.hostname.indexOf("180.140.190.209")==-1){
		map.addLayer(createGTWMTSLayer()); //添加国土局wmts
    	map.addLayer(createGTBZWMTSLayer()); //添加国土局wmts标注
    } else {
    	map.addLayer(createVECLayer()); //添加南宁底图
    	map.addLayer(createCVALayer()); //添加南宁底图
    }
	setFormWkt();
}
//设置表单已绘制信息
function setFormWkt(){
	var wkt="";
	if(parent.window.$("#wkt").val()!=null)
		wkt=parent.window.$("#wkt").val();
	else if(parent.parent.window.Ext.getDom("form_applyIframe").contentDocument.getElementById("wkt")!=null)
		wkt=parent.parent.window.Ext.getDom("form_applyIframe").contentDocument.getElementById("wkt").value;
	if(wkt!=""){
		var array=wkt.split(",");
		var coorArray=new Array();
		for (i = 0; i < array.length; i++){
			var pointArray=new Array(array[i],array[++i]);
			 coorArray.push(pointArray);
		}
		var polygonJson  = {"rings":[coorArray],"spatialReference":{"wkid":4326 }};
		var polygon = new esri.geometry.Polygon(polygonJson);
		var graphic = new esri.Graphic(polygon, new esri.symbol.SimpleFillSymbol());
		map.graphics.add(graphic);
		map.centerAndZoom(polygon.getExtent().getCenter(),15);
		$("#drawStatus").css("color","black");
		$("#drawStatus").html("项目已定位");
		$("#drawButton").html("重新定位");
	}
	if(parent.parent.window.WF_CONFIG.activityName=="task1")
		$("#drawTb").show();
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
//创建南宁地图
function createVECLayer(){
    var layer = new tdt.TDTLayer("vec");
    layer.setOpacity(.60);
    return layer;
}
//创建南宁地图
function createCVALayer(){
    var layer = new tdt.TDTLayer("cva");
    layer.setOpacity(.60);
    return layer;
}
//激活绘制地图事件
function activateTool() {
	//var tool = this.label.toUpperCase().replace(/ /g, "_");
	var tool="POLYGON";
	toolbar.activate(esri.toolbars.Draw[tool]);
	map.hideZoomSlider();
	map.graphics.clear();
	$("#drawStatus").css("color","red");
	$("#drawStatus").html("项目未定位");
}

function addToMap(evt) {
	var symbol;
	toolbar.deactivate();
	map.showZoomSlider();
	switch (evt.geometry.type) {
		case "point":
		case "multipoint":
			symbol = new SimpleMarkerSymbol();
			break;
		case "polyline":
			symbol = new SimpleLineSymbol();
 			break;
		default:
			symbol = new esri.symbol.SimpleFillSymbol();
			break;
	}
	var graphic = new esri.Graphic(evt.geometry, symbol);
	map.graphics.add(graphic);
	parent.window.$("#wkt").val(graphic.geometry.rings);
	$("#drawStatus").css("color","black");
	$("#drawStatus").html("项目已定位");
	$("#drawButton").html("重新定位");
}
//添加比例尺
function addScalebar() {
    var scalebar = new esri.dijit.Scalebar({
        map: map,
        attachTo: 'bottom-left', //top-right, bottom-right, top-center, bottom-center, bottom-left, top-left.
        scalebarUnit: "dual"
    });
}