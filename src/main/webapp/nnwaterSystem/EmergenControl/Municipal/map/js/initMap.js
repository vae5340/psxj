//地图初始化相关的脚本
mapOptions = {
    extent: { center: [108.40669180908202,22.815586677246095], zoom: 4 }, //设置地图的初始范围
    baseMap: {},
    featureLayers: {},
    service: {}
}
//地图初始化相关的脚本
require(["dojo/ready"], function (ready) {
    ready(function () {
        initMap();
		ssjkInit();//在线监控
    });
});

var map;
var sls;
var outLineGraphic;
var mapGlobe = {};

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
  	if(location.hostname.indexOf("180.140.190.209")==-1){
		map.addLayer(createGTWMTSLayer()); //添加国土局wmts
    	map.addLayer(createGTBZWMTSLayer()); //添加国土局wmts标注
    } else {
    	map.addLayer(createVECLayer()); //添加南宁底图
    	map.addLayer(createCVALayer()); //添加南宁底图
    }
    //map.addLayer(createDTLayer()); //添加本地MapServer底图
	sls = new esri.renderer.SimpleLineSymbol().setWidth(3).setColor(new esri.Color([0,255,255])).setStyle(SimpleLineSymbol.STYLE_SHORTDOT);   

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
function createDTLayer() {
	//var layer = new esri.layers.ArcGISDynamicMapServiceLayer("http://192.168.0.105:6080/arcgis/rest/services/map_cg/MapServer");
	var url="http://10.16.87.241:8399/arcgis/rest/services/map2015/MapServer";
	var layer = new esri.layers.ArcGISTiledMapServiceLayer(url);
	return layer;
}

//添加比例尺
function addScalebar() {
    var scalebar = new esri.dijit.Scalebar({
        map: map,
        attachTo: 'bottom-left', //top-right, bottom-right, top-center, bottom-center, bottom-left, top-left.
        scalebarUnit: "dual"
    });
}

//获取图层根据Id
function getMapLayer(LayerId){
	var graphicsLayer=null;
	require(["esri/layers/GraphicsLayer"], function( GraphicsLayer) {
		if(map.getLayer(LayerId)){
			graphicsLayer=map.getLayer(LayerId);
		} else {
			graphicsLayer = new GraphicsLayer({id: LayerId});
			map.addLayers([graphicsLayer]);
		}
	});
	return graphicsLayer;
}

function initMuniMap(map) {
	map.addLayer(createcarLayer()); //添加应急车辆数据
	map.addLayer(createpersonLayer()); //添加应急人员数据
	map.addLayer(creategoodLayer()); //添加应急物资数据
}

function createcarLayer(){
	$.getJSON("/awater/data/emegenCar.json",function(data){	   
		$.each(data,function(infoIndex,info){
			var pt = new esri.geometry.Point(info["x"],info["y"],map.spatialReference)
		    var attr = {"id":info["id"],"name":info["name"],"driver":info["driver"],"company":info["company"]};
			var symbol = new esri.symbol.PictureMarkerSymbol("/awater/nnwaterSystem/temp_icon/ico/busstation.png", 12, 12);
			var graphic = new esri.Graphic(pt,symbol,attr);
			map.graphics.add(graphic);
		});
	}); 
}
		
function createpersonLayer(){
	$.getJSON("/awater/data/emegenPerson.json",function(data){	   
		$.each(data,function(infoIndex,info){
			var pt = new esri.geometry.Point(info["x"],info["y"],map.spatialReference)
			var attr = {"id":info["id"],"name":info["name"],"group":info["group"]};
			var symbol = new esri.symbol.PictureMarkerSymbol("/awater/nnwaterSystem/temp_icon/ico/user_suit.gif", 12, 12);
			var graphic = new esri.Graphic(pt,symbol,attr);
			map.graphics.add(graphic);
		});
	}); 
}
		
function creategoodLayer(){
	$.getJSON("/awater/data/emegenGood.json",function(data){	   
		$.each(data,function(infoIndex,info){
			var pt = new esri.geometry.Point(info["x"],info["y"],map.spatialReference)
			var attr = {"id":info["id"],"name":info["name"],"num":info["num"]};
			var symbol = new esri.symbol.PictureMarkerSymbol("/awater/nnwaterSystem/temp_icon/ico/csk.png", 12, 12);
			var graphic = new esri.Graphic(pt,symbol,attr);
			map.graphics.add(graphic);
		});
	}); 
}
		
function locateCar(id){
	$.each(window.parent.carList,function(index,row){        
		if(row.id==id) {           
			var content="";
			for (var key in row) {
				if(key=="name")
					content += "车辆类型:" + row[key] + "<br/>";
				else if(key=="driver")
					content += "司机:" + row[key] + "<br/>";
				else if(key=="company")
					content += "公司:" + row[key] + "<br/>";
			}
			var pt = new esri.geometry.Point(row.x,row.y,map.spatialReference)	            
			map.infoWindow.setTitle("应急车辆信息");
			map.infoWindow.setContent(content);   
			map.centerAt(pt);    
			map.infoWindow.show(pt);	           	           
		}
	});    
}
	   
function locatePerson(id){
	$.each(window.parent.personList,function(index,row){        
		if(row.id==id) {           
			var content="";
			for (var key in row) {
				if(key=="name")
		 			content += "姓名:" + row[key] + "<br/>";
				else if(key=="group")
					content += "部门:" + row[key] + "<br/>";
			} 
			var pt = new esri.geometry.Point(row.x,row.y,map.spatialReference)            
			map.infoWindow.setTitle("应急人员信息");
			map.infoWindow.setContent(content);   
			map.centerAt(pt);    
			map.infoWindow.show(pt);	           	           
		}
	});
}
	   
function locateGood(id) {
	$.each(window.parent.goodList,function(index,row){        
		if(row.id==id) {           
			var content="";
		 	for (var key in row) {
				if(key=="name")
					content += "名称:" + row[key] + "<br/>";
				else if(key=="num")
					content += "数量:" + row[key] + "<br/>";
			}      
	       	var pt = new esri.geometry.Point(row.x,row.y,map.spatialReference)            
	        map.infoWindow.setTitle("应急物资信息");
	    	map.infoWindow.setContent(content);   
	   	    map.centerAt(pt);    
			map.infoWindow.show(pt);	           	           
		}
	});
}