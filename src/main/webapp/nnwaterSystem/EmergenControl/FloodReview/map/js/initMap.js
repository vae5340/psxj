function getQueryStr(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = decodeURI(window.location.search).substr(1).match(reg);
	if (r != null) 
		return unescape(r[2]);
	return "";
}
var jsdId=getQueryStr("jsdId");
//地图初始化相关的脚本
mapOptions = {
    extent: { center: [108.40669180908202,22.815586677246095], zoom: 4 }, //设置地图的初始范围
    baseMap: {},
    featureLayers: {},
    service: {}

}
//地图初始化相关的脚本
require([
"esri/map",
"custom/tdt/TDTLayer", 
"custom/tdt/TomcatLayer",
"custom/tdt/SuperMapLayer",
"custom/tdt/SuperMapBZLayer",
"esri/dijit/LocateButton",
"esri/dijit/Scalebar",
"esri/dijit/HomeButton",
"esri/symbols/SimpleLineSymbol",
"esri/Color",
"esri/layers/FeatureLayer",
"esri/layers/ArcGISDynamicMapServiceLayer",
"esri/layers/ArcGISTiledMapServiceLayer",
"esri/layers/ArcGISImageServiceLayer",
"esri/layers/LabelLayer",
"esri/symbols/TextSymbol",
"esri/symbols/Font",
"esri/symbols/SimpleFillSymbol",
"esri/symbols/PictureMarkerSymbol",
"esri/renderers/SimpleRenderer",
"esri/layers/GraphicsLayer",
"esri/graphic",
"esri/geometry/Point",
"esri/tasks/query"
]);
require(["dojo/ready"], function (ready) {
    ready(function () {
        initMap();
    });
});

var map;
var sls;
var outLineGraphic;
var graphicsLayer;
var graphicsNNArr =new Array();
var mapGlobe = {};

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
		zoom: 11
  	});
  	
    //map.addLayer(createVECLayer()); //添加底图
    //map.addLayer(createCVALayer()); //添加底图
    map.addLayer(createTomcatLayer());
  	addcloud(); //为页面添加遮罩
    //map.addLayer(createPipeNewworkLayer());//添加地下管网数据
    
	$.ajax({
		type: 'get',
		url : '/agsupport/rest/pscomb/GetCombWithRadius',
		data:{"combId":jsdId,"radius":0.0000457763671875},
		dataType : 'json',  
		success : function(data) {
			addAllMonitorStation(data);
			var ssType=ssTypes[data.form.est_type];
			var pt=new esri.geometry.Point(data.form.xcoor,data.form.ycoor,map.spatialReference);
			map.centerAndZoom(pt,15);
			
			var radius = map.extent.getWidth() / 165;
		    var extent = new esri.geometry.Extent({
		    	"xmin":data.form.xcoor-radius,
		    	"ymin":data.form.ycoor-radius,
		    	"xmax":data.form.xcoor+radius,
		    	"ymax":data.form.ycoor+radius,
		    	"spatialReference":{wkid:2433}
		    });
		    sls = new esri.symbol.SimpleLineSymbol().setWidth(3).setColor(new esri.Color([0,255,255])).setStyle(esri.symbol.SimpleLineSymbol.STYLE_SHORTDOT);   
			outLineGraphic = new esri.Graphic(extent, sls);
		    map.graphics.add(outLineGraphic);
	        
			refreshTeamLayer();
			$("#loadingDiv").remove();
	    	$("#bgDiv").remove();
		},
		error : function (){
			alert("error");
		}
	});
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
    var layer = new tdt.TomcatLayer({ url: "/nnmap/Layers/_alllayers", id: "NNVectorLayer" });
    return layer;
}
//创建地图
function createVECLayer(){
    var layer = new tdt.TDTLayer("vec");
    layer.setOpacity(.60);
    return layer;
}
//创建地图
function createCVALayer(){
    var layer = new tdt.TDTLayer("cva");
    layer.setOpacity(.60);
    return layer;
}
function createPipeNewworkLayer() {
	var url="http://192.168.30.147:6080/arcgis/rest/services/nnpsfacility/MapServer";
	var layer = new esri.layers.ArcGISTiledMapServiceLayer(url);
	return layer;
}
function createDTLayer() {
	var url="http://10.17.86.241:8399/arcgis/rest/services/map2015/MapServer";
	var layer = new esri.layers.ArcGISTiledMapServiceLayer(url,{id:"DT"});
	return layer;
}

//获取图层根据Id
function getMapLayer(LayerId){
	var graphicsLayer=null;
	require(["esri/layers/GraphicsLayer"], function( GraphicsLayer) {
		if(map.getLayer(LayerId)){
			graphicsLayer=map.getLayer(LayerId);
		} else {
			graphicsLayer = new esri.layers.GraphicsLayer({id: LayerId});
			map.addLayers([graphicsLayer]);
		}
	});
	return graphicsLayer;
}

function addcloud() {
    var bodyWidth = document.documentElement.clientWidth;
    var bodyHeight = Math.max(document.documentElement.clientHeight, document.body.scrollHeight);
    var bgObj = document.createElement("div" );
    bgObj.setAttribute( 'id', 'bgDiv' );
    bgObj.style.position = "absolute";
    bgObj.style.top = "0";
    bgObj.style.background = "#000000";
    bgObj.style.filter = "progid:DXImageTransform.Microsoft.Alpha(style=3,opacity=25,finishOpacity=75" ;
    bgObj.style.opacity = "0.5";
    bgObj.style.left = "0";
    bgObj.style.width = bodyWidth + "px";
    bgObj.style.height = bodyHeight + "px";
    bgObj.style.zIndex = "10000"; //设置它的zindex属性，让这个div在z轴最大，用户点击页面任何东西都不会有反应|
    document.body.appendChild(bgObj); //添加遮罩
    var loadingObj = document.createElement("div");
    loadingObj.setAttribute( 'id', 'loadingDiv' );
    loadingObj.style.position = "absolute";
    loadingObj.style.top = bodyHeight / 2 - 62 + "px";
    loadingObj.style.left = bodyWidth / 2 -62 + "px";
    loadingObj.style.background = "url(../../../PipeNetwork/img/loading.gif)" ;
    loadingObj.style.width = "124px";
    loadingObj.style.height = "124px";
    loadingObj.style.zIndex = "10000"; 
    document.body.appendChild(loadingObj); //添加loading动画
}

//添加并更新人员实时数据
function refreshTeamLayer(){
	var graphicsLayer = getMapLayer("person");
	$(parent.teamData.result).each(function(index,item){
		if(item.gps.length>0){
			//展示队伍要素
			var person = new esri.geometry.Point(item.gps[0].longitude,item.gps[0].latitude,map.spatialReference);
			var attr = {"id":item.team.id,"teamName":item.team.name,"contact":item.team.contact};
			var symbol = new esri.symbol.PictureMarkerSymbol("/awater/nnwaterSystem/temp_icon/ico/user_suit.gif", 20, 20);
			var graphic = new esri.Graphic(person,symbol,attr);
			graphicsLayer.add(graphic);
			//展示队伍名称要素
			var textsymbol = new esri.symbol.TextSymbol(item.team.contact).setOffset(0, 10).setColor(new esri.Color([255,0,0]));	
			var textGraphic = new esri.Graphic(person,textsymbol);		
			graphicsLayer.add(textGraphic);
		}
	});
}

function changeTeam(sliderIndex){
	var graphicsLayer = getMapLayer("person");
	//graphicsLayer.hide();
	$(graphicsLayer.graphics).each(function(index,item){
		if(item.attributes){
			var gps = getGpsByIndex(item.attributes.id,sliderIndex);
			if(gps){
				item.geometry.setX(gps.longitude);
				item.geometry.setY(gps.latitude);
			}
		}
	});
	graphicsLayer.redraw();
}

function getGpsByIndex(id,sliderIndex){
	var gps;
	$(parent.teamData.result).each(function(index,item){
		if(id==item.team.id){
			gps = item.gps[sliderIndex];
		}
	});
	return gps;
}

function locatePerson(id){
	var TeamLayer = getMapLayer("person");
	var graphic = TeamLayer.graphics;
	for (var i in graphic){
		if(graphic[i].attributes&&graphic[i].attributes.id==id){
			centerAt(graphic[i].geometry.x,graphic[i].geometry.y);
			return ;
		}
	}
	parent.parent.layer.msg("当前时间无该抢险队无出勤信息!");
}

function centerAt(x,y){
	var pt = new esri.geometry.Point(x,y,map.spatialReference);
	if(outLineGraphic!=null)
		map.graphics.remove(outLineGraphic);			
	var radius = map.extent.getWidth() / 100;
    var extent = new esri.geometry.Extent({"xmin":pt.x-radius,"ymin":pt.y-radius,"xmax":pt.x+radius,"ymax":pt.y+radius});
    outLineGraphic = new esri.Graphic(extent, sls);
    map.graphics.add(outLineGraphic);
	map.centerAt(pt);
}
