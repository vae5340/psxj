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
"esri/geometry/Geometry",
"esri/geometry/Circle",
"esri/geometry/Extent",
"esri/geometry/mathUtils",
"esri/symbols/SimpleLineSymbol",
"esri/symbols/TextSymbol",
"esri/symbols/Font",
"esri/symbols/SimpleMarkerSymbol",  
"esri/symbols/SimpleFillSymbol",
"esri/symbols/PictureMarkerSymbol",
"esri/Color",
"esri/InfoTemplate",
"esri/dijit/InfoWindow",
"custom/popup/PopupWin",
"custom/NewPopup/NewPopupWin",
"custom/InfoPanel/InfoPanel",
"esri/layers/FeatureLayer",
"esri/layers/ArcGISDynamicMapServiceLayer",
"esri/layers/ArcGISTiledMapServiceLayer",
"esri/layers/ArcGISImageServiceLayer",
"esri/layers/LabelLayer",
"esri/renderers/SimpleRenderer",
"esri/layers/GraphicsLayer",
"esri/graphic",
"esri/geometry/Point",
"esri/tasks/query",
"esri/tasks/GeometryService",
"esri/tasks/AreasAndLengthsParameters",
"esri/tasks/LengthsParameters",
"esri/tasks/BufferParameters",
"esri/tasks/QueryTask",   
"esri/tasks/FindTask",
"esri/tasks/FindParameters",  
"esri/tasks/IdentifyTask",  
"esri/tasks/IdentifyParameters",  
"esri/tasks/StatisticDefinition",
"esri/toolbars/draw",  
"esri/tasks/FeatureSet",
"esri/SpatialReference"
]);
require(["dojo/ready"], function (ready) {
    ready(function () {
        initMap();
	 });
});

var map;
var sls;
var outLineGraphic;
var fl;
var baseUrl=location.protocol+"//"+location.hostname;
//正式服务器
//var arcgisBaseUrl="http://10.17.86.241:6080";
//var arcgisMapBaseUrl="http://10.17.86.241:8399";

//本地服务器
var arcgisBaseUrl="http://192.168.30.147:6080";
var arcgisMapBaseUrl="http://192.168.30.147:6080";

//var pipeLayer=arcgisBaseUrl+"/arcgis/rest/services/NanNing/MapServer";
var pipeMapService=arcgisBaseUrl+"/arcgis/rest/services/nnpsfacility/MapServer";
var baseMapService=arcgisMapBaseUrl+"/arcgis/rest/services/map2015/MapServer";

var mapGlobe = {
};

var graphicsArr = new Array();
var graphicsNNArr = new Array();
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
    		    
	map.on("click", function (g) {
        map.infoWindow.hide();
    }); 
    map.on("extent-change", function () {
        // TODO
        /*map.extent.xmin
        map.extent.ymin
        map.extent.xmax
        map.extent.ymax*/
    }); 
    
    sls = new esri.symbol.SimpleLineSymbol().setWidth(3).setColor(new esri.Color([0,255,255])).setStyle(esri.symbol.SimpleLineSymbol.STYLE_SHORTDOT);   
    if(location.hostname.indexOf("180.140.190.209")==-1){
		map.addLayer(createGTWMTSLayer()); //添加国土局wmts
    	map.addLayer(createGTBZWMTSLayer()); //添加国土局wmts标注
    } else {
    	map.addLayer(createVECLayer()); //添加南宁底图
    	map.addLayer(createCVALayer()); //添加南宁底图
    }
    map.addLayer(createDTLayer()); //添加本地MapServer底图
    addPipeNetworkLayer();//添加地下管网数据
    addScalebar();
	//在线监控
	ssjkInit();
    //map.fadeOnZoom(false);
}

//增加地下管网图层
function addPipeNetworkLayer(){
	$.ajax({
        'url': '/agsupport/om-user!checkUserPipeNetwork.action',
        'type': 'get',
        'data': {},
        'success': function(response){
            if(response == 'true' || response === true){
				pipeNetValid=true;
	            mapGlobe.pipeNetworkLayer = createPipeNewworkLayer();
                map.addLayer(mapGlobe.pipeNetworkLayer);//添加地下管网数据
				initPipeNetworkFunctions(map);
            }
        },
        'error': function(a, b, c){
            console.error(a);
            console.error(b);
            console.error(c);
        }
    });
}

//添加定位按钮
function addLocationButton() {
    var geoLocate = new esri.dijit.LocateButton({
        map: map
    }, "LocateButton");
    geoLocate.startup();
}

//添加比例尺
function addScalebar() {
    var scalebar = new esri.dijit.Scalebar({
        map: map,
        attachTo: 'bottom-left', //top-right, bottom-right, top-center, bottom-center, bottom-left, top-left.
        // "dual" displays both miles and kilmometers
        // "english" is the default, which displays miles
        // use "metric" for kilometers
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
function createPipeNewworkLayer() {
	var url=arcgisBaseUrl+"/arcgis/rest/services/nnpsfacility/MapServer";
	//url = arcgisBaseUrl+"/arcgis/rest/services/NanNing/MapServer";
	var layer = new esri.layers.ArcGISDynamicMapServiceLayer(url);
	return layer;
}
function createDTLayer() {
	//var url = arcgisMapBaseUrl+"/arcgis/rest/services/map2015/MapServer";
	var layer = new esri.layers.ArcGISTiledMapServiceLayer(baseMapService);
	return layer;
}
function createYXLayer() {
	var url=arcgisBaseUrl+"/arcgis/rest/services/map_cg/MapServer";
    var layer = new esri.layers.ArcGISImageServiceLayer(url);
    layer.hide();
    return layer;
}

function createPipeLayer() {
    var url = baseUrl+":6080/arcgis/rest/services/HangZhouPipe/MapServer/1";
    var fl = new esri.layers.FeatureLayer(url, {
        id: "pipe",
        mode: esri.layers.FeatureLayer.MODE_ONDEMAND,
        outFields: ["*"],
        showLabels:true,
        minScale: 3000,
        maxScale: 150
    });
    fl.on("click", pipeClickHandler);
    fl.on("mouse-move", pipeOverHandler);
    fl.on("mouse-out", pipeOutHandler);
    return fl;
}

function pipeClickHandler(g) {
    var pt = g.graphic.geometry.getExtent().getCenter();
    var content = "";
    var attr = g.graphic.attributes;
    for (var key in attr) {
        var cnKey = getFeatureLayerAlias(g.graphic.getLayer(),key);
        content += cnKey + ":" + attr[key] + "<br/>";
    }
    map.infoWindow.setTitle(attr.AA);
    map.infoWindow.setContent(content);
    map.infoWindow.show(pt);
}

function getFeatureLayerAlias(fl,name) { 
    var fields=fl.fields;
    for (var i = 0; i < fields.length; i++) {
        if (fields[i].name == name) 
        return fields[i].alias;
    }
}

function pipeOverHandler(g) {
    var graphic = g.graphic;
    var sls = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new esri.Color([0, 0, 255]), 3);
    graphic.setSymbol(sls);
}

function pipeOutHandler(g) {
    var graphic = g.graphic;
    var sls = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new esri.Color([0, 0, 255]), 3);
    graphic.setSymbol(null);
}

function setbjdemo(){
	for (i in graphicsNNArr){
		var graphic = graphicsNNArr[i].graphics;
		if(graphicsNNArr[i].id=="nh") {
			var symbol = new esri.symbol.PictureMarkerSymbol("nnwaterSystem/temp_icon/ico/swz.png", 12, 12);
			graphic[0].setSymbol(symbol);
				graphicsNNArr[i].refresh();
		}
		if(graphicsNNArr[i].id=="yl") {
			var symbol = new esri.symbol.PictureMarkerSymbol("nnwaterSystem/temp_icon/ico/ylz.png", 12, 12);
			if(graphic.length>0){
				graphic[0].setSymbol(symbol);
				graphicsNNArr[i].refresh();
			}
		}
		if(graphicsNNArr[i].id=="sw") {
			var symbol = new esri.symbol.PictureMarkerSymbol("nnwaterSystem/temp_icon/ico/swz.png", 12, 12);
			if(graphic.length>0){
				graphic[0].setSymbol(symbol);
				graphicsNNArr[i].refresh();
			}
		}
		if(graphicsNNArr[i].id=="bz") {
			var symbol = new esri.symbol.PictureMarkerSymbol("nnwaterSystem/temp_icon/ico/bz2.png", 12, 12);
			if(graphic.length>0){
				graphic[0].setSymbol(symbol);
				graphicsNNArr[i].refresh();
			}
		}
	}
}

function AddFeatureHandler(a,b) {
	if(a.graphic._graphicsLayer.id=="nh"||a.graphic._graphicsLayer.id=="yl"||a.graphic._graphicsLayer.id=="sw"||a.graphic._graphicsLayer.id=="bz")   
	{
		a.graphic.attributes.d_value=toDecimal2(Math.random()*100);
		a.graphic.setAttributes(a.graphic.attributes);
	}
	//a.graphic.attributes.d_value=toDecimal2(Math.random()*100);
	/*if(a.graphic._graphicsLayer.id=="nh"){
		var symbol = new esri.symbol.PictureMarkerSymbol("nnwaterSystem/temp_icon/weater.png", 12, 12);
		a.graphic.setSymbol(symbol);
	} else if(a.graphic._graphicsLayer.id=="sw"){
		var symbol = new esri.symbol.PictureMarkerSymbol("nnwaterSystem/temp_icon/shuiwei.png", 12, 12);
		a.graphic.setSymbol(symbol);
	} else if(a.graphic._graphicsLayer.id=="yl"){
		var symbol = new esri.symbol.PictureMarkerSymbol("nnwaterSystem/temp_icon/yuliang.png", 12, 12);
		a.graphic.setSymbol(symbol);
	} else if(a.graphic._graphicsLayer.id=="bz"){
		var symbol = new esri.symbol.PictureMarkerSymbol("nnwaterSystem/temp_icon/benzhan.png", 12, 12);
		a.graphic.setSymbol(symbol);
	}*/
}
function createjxLayer() {
    var url = baseUrl+":6080/arcgis/rest/services/NanNing/MapServer/0";
    var fl = new esri.layers.FeatureLayer(url,{
    	id: "jx",
    	outFields: ["*"],
        mode: esri.layers.FeatureLayer.MODE_ONDEMAND
    });
    fl.on("graphic-node-add", AddFeatureHandler);
    fl.on("click", jxgraphicHandler);
    fl.on("mouse-move", function (g) {
        var pt = g.graphic.geometry;
        var attr = g.graphic.attributes;
        map.infoWindow.setTitle(attr.name);
        map.infoWindow.setContent("名称:" + attr.name + "<br/>井下水位:" + toDecimal2(Math.random()*10)+"<br/>备注:");
        map.infoWindow.resize(200, 70);
        map.infoWindow.show(pt);
    });
    fl.on("mouse-out", function (g) {
        map.infoWindow.hide();
    });
    graphicsNNArr.push(fl);
    return fl;
}
function createckLayer() {
    var url = baseUrl+":6080/arcgis/rest/services/NanNing/MapServer/1";
    var fl = new esri.layers.FeatureLayer(url,{
    	id: "ck",
    	outFields: ["*"],
        mode: esri.layers.FeatureLayer.MODE_ONDEMAND
    });
    fl.on("graphic-node-add", AddFeatureHandler);
    fl.on("click", ckgraphicHandler);
    fl.on("mouse-move", function (g) {
        var pt = g.graphic.geometry;
        var attr = g.graphic.attributes;
        map.infoWindow.setTitle(attr.name);
        map.infoWindow.setContent("名称:" + attr.name + "<br/>数量:44<br/>联系人:廖伟福<br/>联系电话:7691283<br/>备注:");
        map.infoWindow.resize(200, 200);
        map.infoWindow.show(pt);
    });
    fl.on("mouse-out", function (g) {
        map.infoWindow.hide();
    });
    graphicsNNArr.push(fl);
    fl.hide();
    return fl;
}
function createsxLayer() {
    var url = baseUrl+":6080/arcgis/rest/services/NanNing/MapServer/2";
    var fl = new esri.layers.FeatureLayer(url,{
    	id: "sx",
    	outFields: ["*"],
        mode: esri.layers.FeatureLayer.MODE_ONDEMAND
    });
    fl.on("graphic-node-add", AddFeatureHandler);
    fl.on("click", sxgraphicHandler);
    fl.on("mouse-move", function (g) {
        var pt = g.graphic.geometry;
        var attr = g.graphic.attributes;
        map.infoWindow.setTitle(attr.name);
        map.infoWindow.setContent("名称:" + attr.name + "摄像头<br/>联系人:廖伟福<br/>联系电话:7691283<br/>备注:");
        map.infoWindow.resize(200, 200);
        map.infoWindow.show(pt);
    });
    fl.on("mouse-out", function (g) {
        map.infoWindow.hide();
    });
    graphicsNNArr.push(fl);
    fl.hide();
    return fl;
}
function createbjLayer() {
    var fl = new esri.layers.FeatureLayer(url,{
    	id: "bj",
    	outFields: ["*"],
        mode: esri.layers.FeatureLayer.MODE_ONDEMAND
    });
    graphicsNNArr.push(fl);
    return fl;
}

function createjsdLayer() {
	var url = baseUrl+":6080/arcgis/rest/services/NanNing/MapServer/3";
    var fl = new esri.layers.FeatureLayer(url,{
    	id: "jsd",
    	outFields: ["*"],
        mode: esri.layers.FeatureLayer.MODE_ONDEMAND
    });

    fl.on("graphic-node-add", AddFeatureHandler);
    fl.on("click", jsdgraphicHandler);
    fl.on("mouse-move", function (g) {
        var pt = g.graphic.geometry;
        var attr = g.graphic.attributes;
        map.infoWindow.setTitle(attr.name);
        map.infoWindow.setContent("名称:" + attr.name + "<br/>积水水位:" + toDecimal2(Math.random()*10)+"<br/>备注:");
        map.infoWindow.resize(200, 70);
        map.infoWindow.show(pt);
    });
    fl.on("mouse-out", function (g) {
        map.infoWindow.hide();
    });
    graphicsNNArr.push(fl);
    return fl;
}

function createylLayer() {
    var url = baseUrl+":6080/arcgis/rest/services/NanNing/MapServer/4";
    var fl = new esri.layers.FeatureLayer(url,{
    	id: "yl",
    	outFields: ["*"],
        mode: esri.layers.FeatureLayer.MODE_ONDEMAND
    });
    fl.on("graphic-node-add", AddFeatureHandler);
    fl.on("click", ylgraphicHandler);
    fl.on("mouse-move", function (g) {
        var pt = g.graphic.geometry;
        var attr = g.graphic.attributes;
        map.infoWindow.setTitle(attr.station_name);
        map.infoWindow.setContent("站点名称:" + attr.station_name +"<br/>站点编码:" + attr.station_code + "<br/>监测河流:" + attr.river+ "<br/>站点类型:" + attr.station_class+ "<br/>监测雨量:" + attr.temp+"<br/>备注:");
        map.infoWindow.resize(200, 200);
        map.infoWindow.show(pt);
    });
    fl.on("mouse-out", function (g) {
        map.infoWindow.hide();
    });
    graphicsNNArr.push(fl);
    fl.hide();
    return fl;
}


function createswLayer() {
    var url = baseUrl+":6080/arcgis/rest/services/NanNing/MapServer/5";
    var fl = new esri.layers.FeatureLayer(url,{
    	id: "sw",
    	outFields: ["*"],
        mode: esri.layers.FeatureLayer.MODE_ONDEMAND
    });
    fl.on("graphic-node-add", AddFeatureHandler);
    fl.on("click", swgraphicHandler);
    fl.on("mouse-move", function (g) {
        var pt = g.graphic.geometry;
        var attr = g.graphic.attributes;
        map.infoWindow.setTitle(attr.station_name);
        map.infoWindow.setContent("站点名称:" + attr.station_name +"<br/>站点编码:" + attr.station_code + "<br/>监测河流:" + attr.river+ "<br/>站点类型:" + attr.station_class+ "<br/>监测面积:" + attr.drainage_area+"<br/>备注:");
        map.infoWindow.resize(200, 200);
        map.infoWindow.show(pt);
    });
    fl.on("mouse-out", function (g) {
        map.infoWindow.hide();
    });
    graphicsNNArr.push(fl);
    
    fl.hide();
    return fl;
}

function createbzLayer() {
    var url = baseUrl+":6080/arcgis/rest/services/NanNing/MapServer/7";
    var fl = new esri.layers.FeatureLayer(url,{
    	id: "bz",
    	outFields: ["*"],
        mode: esri.layers.FeatureLayer.MODE_ONDEMAND
    });
    fl.on("graphic-node-add", AddFeatureHandler);
    fl.on("click", bzgraphicHandler);
    fl.on("mouse-move", function (g){
        var pt = g.graphic.geometry;
        var attr = g.graphic.attributes;
        map.infoWindow.setTitle(attr.pumpingstation_name);
        map.infoWindow.setContent("泵站名称:" + attr.pumpingstation_name +"<br/>联系人:廖伟福<br/>联系电话:7691283<br/>备注:");
        map.infoWindow.resize(200, 200);
        map.infoWindow.show(pt);
    });
    fl.on("mouse-out", function (g){
        map.infoWindow.hide();
    });
    graphicsNNArr.push(fl);
    return fl;
}

function createnhLayer() {
    var url = baseUrl+":6080/arcgis/rest/services/NanNing/MapServer/6";
    var fl = new esri.layers.FeatureLayer(url,{
    	id: "nh",
    	outFields: ["*"],
        mode: esri.layers.FeatureLayer.MODE_ONDEMAND
    });
    fl.on("graphic-node-add", AddFeatureHandler);
    fl.on("click", nhgraphicHandler);
    fl.on("mouse-move", function (g) {
        var pt = g.graphic.geometry;
        var attr = g.graphic.attributes;
        map.infoWindow.setTitle(attr.monitorpoint);
        map.infoWindow.setContent("内河监测点:" + attr.monitorpoint +"<br/>数量:"+attr.number_+"<br/>地址:"+attr.add_+"<br/>RTU编码:"+attr.RTUcode+"<br/>备注:");
        map.infoWindow.resize(200, 200);
        map.infoWindow.show(pt);
    });
    fl.on("mouse-out", function (g) {
        map.infoWindow.hide();
    });
    graphicsNNArr.push(fl);
    fl.hide();
    
    /*var symbol = new esri.symbol.TextSymbol();
	var renderer = new esri.renderer.SimpleRenderer(symbol);
	var labelLayer = new esri.layers.LabelLayer();
	labelLayer.addFeatureLayer(fl, renderer, "123");
	map.addLayer(labelLayer);
	
	labelLayer._featureLayerInfos[0].LabelExpressionInfo="23412312312";*/
	
    return fl;
}
function createrfLayer(){
	var fl = new esri.layers.ArcGISDynamicMapServiceLayer(arcgisBaseUrl+"/arcgis/rest/services/rainfall/MapServer",{id: "rf"});
   	graphicsNNArr.push(fl);
    fl.hide();
    fl.setOpacity(.50);
    return fl;
}
function createDistrictLayer(){
	 var url=arcgisBaseUrl+"/arcgis/rest/services/nanningDistrict/MapServer/0";
	 var fl = new esri.layers.FeatureLayer(url,{
    	id: "dis",
    	outFields: ["*"],
    	definitionExpression:"state = 1",
        mode: esri.layers.FeatureLayer.MODE_AUTO
    });
   	graphicsNNArr.push(fl);
    fl.hide();
    fl.setOpacity(.50);
    return fl;
}

function monitorLegend() {
    dojo.query('input[name="jclayer"]').on("change", function (e) {
        var value = e.currentTarget.value;
        var isCheck = e.currentTarget.checked;
        map.getLayer(value).setVisibility(isCheck);
    });
}

//在地图上显示站点
function showStationOnMap(stations) {
    // 设置显示中心点及坐标
    var location = new esri.geometry.Point(stations[0].longtitude, stations[0].latitude, map.spatialReference)
    // 逐个添加元素
    for (var s = 0; s < stations.length; s++) {
        var symbol = new esri.symbol.PictureMarkerSymbol(stations[s].imageUrl, 12, 12);
        var pt = new esri.geometry.Point(stations[s].longtitude, stations[s].latitude, map.spatialReference)
        // 每个元素的属性值     
        //var attr = { "stationName": stations[s].stationName, "sId": stations[s].sId,"value": stations[s].value,"time":stations[s].time};   
        // 点击该元素时的信息窗  
        var infoTemplate = new esri.InfoTemplate(stations[s].stationName,
        '<iframe src="./gzps/pump/jishuidian.html" frameborder="no" border="0" marginwidth="0" marginheight="0" scrolling="no" width="850" height="500"></iframe>');
        map.infoWindow.resize(900, 520);
        var graphic = new esri.Graphic(pt, symbol, null, infoTemplate);
        map.graphics.add(graphic);
        graphicsArr[s] = graphic;
    }
}

//在地图上remove掉站点
function removeStationOnMap() {
    var len = graphicsArr.length;
    for (var k = 0; k < len; k++) {
        map.graphics.remove(graphicsArr[k]);
    }
}

//全选
function legendCheckAll() {
    var isCheck = $("input[name='layall']").attr("checked");
    if (isCheck != "checked") {
        $("input[name='jclayer']").attr("checked", true);
    } else {
        $("input[name='jclayer']").removeAttr("checked");
    }
}

function getLonLot() {
    dojo.connect(map, 'onClick', function (theMap) {
        alert("x:" + theMap.mapPoint.x + "===y：" + theMap.mapPoint.y);
    });
} 
function showInfoWindowByPoint(obj){
	if(obj.estType==null)
		obj.estType=obj.esttype;
	if(obj.combId==null)
		obj.combId=obj.combid;
    if(outLineGraphic!=null)
           map.graphics.remove(outLineGraphic);		
	var pt=new esri.geometry.Point(obj.xcoor,obj.ycoor,new esri.SpatialReference({ wkid: 2433 }));
	
	map.infoWindow.hide();
	AutoClickLenged(obj.estType);
	
	var radius = map.extent.getWidth() / 135;
    var extent = new esri.geometry.Extent({
    	"xmin":pt.x-radius,
    	"ymin":pt.y-radius,
    	"xmax":pt.x+radius,
    	"ymax":pt.y+radius,
    	"spatialReference":{wkid:2433}
    });
    outLineGraphic = new esri.Graphic(extent, sls);
    map.graphics.add(outLineGraphic);
    var Layergraphics=null;
	if(obj.esttype=="6"){
		Layergraphics=map.getLayer("ssjk_6").graphics;
	} if(obj.esttype=="13"){
		Layergraphics=map.getLayer("ssjk_13").graphics;
	} else if(obj.esttype=="17"){
		Layergraphics=map.getLayer("ssjk_17").graphics;
	} else if(obj.esttype=="18"){
		Layergraphics=map.getLayer("ssjk_18").graphics;
	} else if(obj.esttype=="19"){
		Layergraphics=map.getLayer("ssjk_19").graphics;
	} else if(obj.esttype=="20"){
		Layergraphics=map.getLayer("ssjk_20").graphics;
	} else if(obj.esttype=="21"){
		Layergraphics=map.getLayer("ssjk_21").graphics;
	} else if(obj.estType=="22"){
		Layergraphics=map.getLayer("ssjk_22").graphics;
	}
	
	for (graphic in Layergraphics){
		if(Layergraphics[graphic].attributes.combId==obj.combId || obj.id){
			var attr=Layergraphics[graphic].attributes;
			map.infoWindow.setTitle(attr.title);
			map.infoWindow.setContent(attr.content);
			map.infoWindow.show(pt);
			map.centerAndZoom(pt,5);
		}
	}
}
function showInfoWindowByPoint2(type,obj){
	var pt=new esri.geometry.Point(obj.x,obj.y);
	map.infoWindow.hide();
	//if(type=="jsd"){
		//map.infoWindow.setTitle("");
		//map.infoWindow.setContent("泵站名称:"+obj.name+"<br/>监控点名称:"+obj.jkd_name+"<br/>监控点位编:"+obj.no);
		//map.infoWindow.show(pt);
		//map.infoWindow.resize(200, 120);
		//map.centerAndZoom(pt,5);
	//}
	if(type=="jx"){
		map.infoWindow.setTitle("");
		map.infoWindow.setContent("OBJECTID:"+obj.OBJECTID+"<br/>名称:"+obj.name);//+"<br/>井下水深:"+obj.d_value
		map.infoWindow.show(pt);
		map.infoWindow.resize(200, 120);
		map.centerAndZoom(pt,5);
	}else if(type=="jsd"){
		map.infoWindow.setTitle("");
		map.infoWindow.setContent("OBJECTID:"+obj.OBJECTID+"<br/>积水点名称:"+obj.name);//+"<br/>水位值:"+obj.d_value
		map.infoWindow.show(pt);
		map.infoWindow.resize(200, 120);
		map.centerAndZoom(pt,5);
	}else if(type=="bz"){
		map.infoWindow.setTitle("");
		map.infoWindow.setContent("OBJECTID:"+obj.OBJECTID+"<br/>泵站名称:"+obj.pumpingstation_name);//+"<br/>数值:"+obj.d_value
		map.infoWindow.show(pt);
		map.infoWindow.resize(200, 120);
		map.centerAndZoom(pt,5);
	}
}

function getGraphicbyCode(code){
	for (i in graphicsNNArr){
		if(graphicsNNArr[i].id=="bj"){
			var graphic = graphicsNNArr[i].graphics;
			for (j in graphic){
				if(graphic[j].attributes.title!=null&&graphic[j].attributes.title==code)
					return graphic[j]; 
			}
		}
	}
	return null;
}
/**
 * 显示图层
 * @param type
 */
function showLayer(isShow,type){
	for (i in graphicsNNArr){
		if(graphicsNNArr[i].id==type){
			graphicsNNArr[i].setVisibility(isShow);
			map.graphics.clear();
		}
	}
}

/**
 * 定位
 * @param x
 * @param y
 * @param zoom
 */
function locationPoint(x,y,zoom){
	clearGraphicLayer("highlightLayer");
	var point=new esri.geometry.Point(x,y);
	if(zoom){
		map.centerAndZoom(point,zoom);
	}else{
		map.centerAt(point);
	}	
	createGraphic("highlightLayer",x,y,"img/info.gif",20,20);
}



function locationPoint2(obj){
	var layer=map.getLayer("dis");
	layer.show();
	layer.setOpacity(.50);
	for(district in layer.graphics){
		if(layer.graphics[district].attributes.LAST_NAME9==obj.station_name){
			map.graphics.clear();
			//设置文字
			var point=layer.graphics[district].geometry.getExtent().getCenter();
			var value=obj.jyl.replace(/<[^>]+>/g,"");
			var symbol= new esri.symbol.TextSymbol(value);
			symbol.setFont(new esri.symbol.Font("18pt")) ;
			symbol.setColor(new esri.Color([255,0,0]));
			var graphic=new esri.Graphic(point,symbol);
			
			map.graphics.add(graphic);
			
			//高亮样式-降雨格点
			var highlightSymbol = new esri.symbol.SimpleFillSymbol(  
				esri.symbol.SimpleFillSymbol.STYLE_SOLID,  
				new esri.symbol.SimpleLineSymbol(
				esri.symbol.SimpleLineSymbol.STYLE_SOLID,
				new dojo.Color([255,0,0]),3),
				new dojo.Color([125,125,125,0.35])  
			);  
			
			//设置选中框
			var highlightGraphic = new esri.Graphic(  
                layer.graphics[district].geometry,  
                highlightSymbol  
          	);
			map.graphics.add(highlightGraphic);
			
			map.centerAt(point);
		}
	}
}

function dynamicLayerData(obj){
	var layer=map.getLayer("dis").setDefinitionExpression("FID = "+obj.fid);
	
	map.getLayer("dis").show();
}  
/**
 * 新建Graphic
 * @param graphicLayerId
 * @param x
 * @param y
 * @param iconUrl
 * @param iconW
 * @param iconH
 */
function createGraphic(graphicLayerId,x,y,iconUrl,iconW,iconH){
	var graphicLayer=null;
	if(map.getLayer(graphicLayerId)){
		graphicLayer=map.getLayer(graphicLayerId);
	}else{
		graphicLayer=new esri.layers.GraphicsLayer({id:graphicLayerId});
	}
	map.addLayer(graphicLayer,2);
	var point=new esri.geometry.Point(x,y);
	var symbol=new esri.symbol.PictureMarkerSymbol(iconUrl, iconW, iconH);
	var graphic=new esri.Graphic(point, symbol)
	graphicLayer.add(graphic);
}

/**
 * 清空GraphicLayer
 * @param graphicLayerId
 */
function clearGraphicLayer(graphicLayerId){
	var graphicLayer=null;
	if(map.getLayer(graphicLayerId)){
		graphicLayer=map.getLayer(graphicLayerId);
		graphicLayer.clear();
	}else{
		//graphicLayer=new esri.layers.GraphicLayer(id:graphicLayerId});
	}
}
//设置显示矢量地图隐藏影像图
function displaySLLayer(){
	var SLlayer=map.getLayer("NNVectorLayer");
	SLlayer.show();
	var YXlayer=map.getLayer("img");
	YXlayer.hide();
	
}
//设置显示影像图隐藏矢量地图
function displayYXLayer(){
	var SLlayer=map.getLayer("NNVectorLayer");
	SLlayer.hide();
	var YXlayer=map.getLayer("img");
	YXlayer.show();
}

function AutoClickLenged(est_type){
	if(!$("#ssjk_"+est_type+"Li").hasClass("hover")){
		$("#ssjk_"+est_type+"Li").addClass("hover");
	}
	showLayer(true,"ssjk_"+est_type);
}

function hideAllLayer(){
	for (i in graphicsNNArr){
		graphicsNNArr[i].hide();
	}
}
