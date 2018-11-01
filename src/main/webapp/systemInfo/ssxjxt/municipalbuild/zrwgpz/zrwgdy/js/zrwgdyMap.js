//地图初始化相关的脚本
require([
"esri/map",
"custom/tdt/TDTLayer", 
"custom/tdt/TomcatLayer", 
"custom/tdt/SuperMapLayer",
"custom/tdt/SuperMapImgLayer",
"custom/tdt/SuperMapBZLayer",
"esri/dijit/LocateButton",
"esri/dijit/Scalebar",
"esri/dijit/HomeButton",
"esri/dijit/LayerSwipe",
"esri/geometry/Geometry",
"esri/geometry/Circle",
"esri/geometry/Extent",
"esri/geometry/mathUtils",
"esri/symbols/SimpleLineSymbol",
"esri/symbols/TextSymbol",
"esri/symbols/Font",
"esri/symbols/SimpleMarkerSymbol",  
"esri/symbols/SimpleFillSymbol",
"esri/symbols/PictureFillSymbol",
"esri/symbols/PictureMarkerSymbol",
"esri/Color",
"esri/InfoTemplate",
"esri/dijit/InfoWindow",
"custom/popup/PopupWin",
"custom/NewPopup/NewPopupWin",
"custom/InfoPanel/InfoPanel",
"esri/layers/FeatureLayer",
"esri/layers/WMTSLayer",
"esri/layers/WMTSLayerInfo",
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
		initMapArc();
	});	
});
var mapArc;
//  加载地图  结束


//地图初始化  开始
function initMapArc(){
	mapArc = new esri.Map("mapDiv", {
		showLabels: true,
	    logo:false,
	    center: [113.33863778154898,23.148347272756297],
	    extent: new esri.geometry.Extent({          
	      xmin: 107.23452588182978,
	      ymin: 21.813379881292327,
	      xmax: 110.3840906318817,
	      ymax: 24.252829164596033,
	      spatialReference:{wkid:4326}
	    }),
	    zoom: 17
	  });	
	
	
	// 底图、影像图、水利设施
    var tdtvecLayer = new tdt.TDTLayer("vec",{visible:true,id:'vec'}); 
    mapArc.addLayer(tdtvecLayer);
    var tdtcvaLayer = new tdt.TDTLayer("cva",{visible:true,id:'DiTu'});
    mapArc.addLayer(tdtcvaLayer);
}
//地图初始化  结束