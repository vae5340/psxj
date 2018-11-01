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
"custom/popup/PopupWin",
"custom/NewPopup/NewPopupWin",
"custom/InfoPanel/InfoPanel",
"esri/layers/FeatureLayer",
"esri/layers/ArcGISDynamicMapServiceLayer",
"esri/layers/ArcGISImageServiceLayer",
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
require(["dojo/ready"], function (ready) {
    ready(function(){
        yellowLineSymbol=(new esri.symbol.SimpleLineSymbol()).setColor(new esri.Color([230,255,0])).setWidth(3);
        yellowMarkerSymbol=(new esri.symbol.SimpleMarkerSymbol()).setColor(new esri.Color([230,255,0])).setSize(6).setOutline(yellowLineSymbol);
    	yellowFillSymbol=(new esri.symbol.SimpleFillSymbol()).setOutline(yellowLineSymbol).setStyle(esri.symbol.SimpleFillSymbol.STYLE_NULL);
        initMap();
    });
});

var map;
//var graphicLayer;
var featureLayer
var sls;
var outLineGraphic;
var fl;
var mapGlobe = {};
var	yellowLineSymbol;
var yellowMarkerSymbol;
var	yellowFillSymbol;

var graphicsArr = new Array();

//地图初始化
function initMap() {
    map = new esri.Map("mapDiv");
    var layerDefinition = {
				  "geometryType": "esriGeometryPolygon",
				  "objectIdField": "ObjectID",
		          "drawingInfo": {
		            "renderer": {	          
			             "type": "simple",
					     "field": "value",
					     "defaultSymbol": {
					        "type": "esriTS"
					    }				  	            
		          }
		       },
	           "fields": [{
		            "name": "ObjectID",
		            "alias": "ObjectID",
		            "type": "esriFieldTypeOID"
		          },{
			      "name": "value",
			      "type": "esriFieldTypeString",
			      "alias": "value"
			    }
			]
	  } 
	  var featureCollection = {
	    layerDefinition: layerDefinition,
	    featureSet: null
	  };
	  
	  graphicLayer = new esri.layers.GraphicsLayer({id: "graphicLayer"});
      map.addLayer(graphicLayer);
       featureLayer = new esri.layers.FeatureLayer(featureCollection);
       map.addLayer(featureLayer);
       map.spatialReference=new esri.SpatialReference(4326);
       	//sls = new esri.symbol.SimpleLineSymbol().setWidth(2).setColor(new esri.Color([0,255,255])).setStyle(esri.symbol.SimpleLineSymbol.STYLE_SOLID);   
    //sls = new esri.symbol.SimpleLineSymbol().setWidth(3).setColor(new esri.Color([0,255,255])).setStyle(esri.symbol.SimpleLineSymbol.STYLE_SHORTDOT);   
}


	function valueReplace(v){ 
	     v=v.toString().replace(new RegExp('(["\"])', 'g'),"\\\""); 
	    return v; 
	} 

function toDecimal2(x) {  
	var f = parseFloat(x);  
	if (isNaN(f)) {  
  		return false;  
	}  
	var f = Math.round(x*100)/100;  
	var s = f.toString();  
	var rs = s.indexOf('.');  
	if (rs < 0) {  
		rs = s.length;  
		s += '.';  
	}  
	while (s.length <= rs + 2) {  
  		s += '0';  
	}  
	return s;  
}   

//添加比例尺
function addScalebar() {
    var scalebar = new esri.dijit.Scalebar({
        map: map,
        attachTo: 'bottom-left', //top-right, bottom-right, top-center, bottom-center, bottom-left, top-left.
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


//获取图层根据Id
function getMapLayer(LayerId){
	var graphicsLayer=null;
	require(["esri/layers/GraphicsLayer"], function(GraphicsLayer) {
		if(map.getLayer(LayerId)){
			graphicsLayer=map.getLayer(LayerId);
		} else {
			graphicsLayer = new GraphicsLayer({id: LayerId});
			map.addLayers([graphicsLayer]);
		}
	});
	return graphicsLayer;
}
