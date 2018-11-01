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
	debugger;
	ready(function () {
		//initBaidu();
		initMapArc();
		// 定位
		setTimeout(locationArc(),2000);		
		
		// 画位置
		setTimeout(DW(),2000);
		
	});	
});
var mapDW;
//  加载地图  结束

//定位  开始
var toolBar;
function DW(){
	// 绘画按钮
	var btn=dojo.byId("startBtn");
	dojo.connect(btn,"click",activateTool);
	
	// 创建工具面板
	createTool();
}

//创建工具面板
function createTool(){
	toolBar=new esri.toolbars.Draw(mapDW);
	toolBar.on("draw-end",addToMap);
}

// 激活工具面板
function activateTool(){
	// 清除地图
	mapDW.graphics.clear();
	
	// 定义绘图工具
	var drawToolBar=esri.toolbars.Draw['POINT'];
	toolBar.activate(drawToolBar);
	
	// 设置样式
	mapDW.hideZoomSlider();
	mapDW.setMapCursor("crosshair");
}

// 显示结果
function addToMap(evt){
	// 结束绘画
	toolBar.deactivate();
	mapDW.setMapCursor("default");
	mapDW.showZoomSlider();
	var geometry=evt.geometry;
	
	// 描点
	var x=geometry.x;
	var y=geometry.y;
	if(x!=null&&y!=null&&x!=''&&y!=''){
		var pointJson={"x":x,"y":y,"spatialReference":{"wkid":4326}};
		var geometry=new esri.geometry.Point(pointJson);
		var pipelineSymbol=(new esri.symbol.SimpleLineSymbol()).setColor(new esri.Color("red")).setWidth(5);
		var pipemarkerSymbol=(new esri.symbol.SimpleMarkerSymbol()).setColor(new esri.Color("red")).setSize(6).setOutline(pipelineSymbol);
		var graphic=new esri.Graphic(geometry, pipemarkerSymbol);
		mapDW.setZoom(9);
		mapDW.centerAt(geometry); 
		setTimeout(function(){
			mapDW.graphics.add(graphic);
	          setTimeout(function(){
	        	  mapDW.graphics.remove(graphic);
	              setTimeout(function(){
	            	 mapDW.graphics.add(graphic);
	          },200);
	       },300);
	    },300);
	}else{
		mapDW.graphics.clear();
	}
	
	// 赋值
	parent.$("#x").val(x);
	parent.$("#y").val(y);
	setLocation(x, y);
	// 关闭
	// setTimeout(dwPanelClose(),3000);
}
// 定位  结束  	
//获取地理位置的函数
function setLocation(x,y){
	debugger;
	var geoc = new BMap.Geocoder();
　　　var pt = new BMap.Point(x,y);//实例化这两个点
　　　geoc.getLocation(pt, function (rs) {
　　　　　　var addComp = rs.addressComponents;
　　　　　　var wtdd=addComp.province  + addComp.city + addComp.district + addComp.street +  addComp.streetNumber;
		 //赋值
		parent.$("#addr").val(wtdd);
		//parent.$("#jdmc").val(addComp.street); 　　
	});
}
//地图初始化  开始
function initMapArc(){
	mapDW = new esri.Map("mapDiv", {
		showLabels: true,
	    logo:false,
	    center: [113.33863778154898,23.148347272756297],
	    extent: new esri.geometry.Extent({          
	    	xmin: 112.94442462654136,
	    	ymin: 22.547612828115952,
	    	xmax: 114.05878172043404,
	    	ymax: 23.938714362742893,
		      spatialReference:{wkid:4326}
	    }),
	    zoom: 9,
	    maxZoom:10
    });	
	
	// 底图、影像图、水利设施
/*    var tdtvecLayer = new tdt.TDTLayer("vec",{visible:true,id:'vec'}); 
    mapDW.addLayer(tdtvecLayer);
    var tdtcvaLayer = new tdt.TDTLayer("cva",{visible:true,id:'DiTu'});
    mapDW.addLayer(tdtcvaLayer);*/
	mapDW.addLayer(createDitu());
	mapDW.addLayer(createGW());
}
//地图初始化  结束

//管网
function createGW(){
	var url_=window.parent.parent.parent.awater.url.url_h;
    var layer = new esri.layers.ArcGISDynamicMapServiceLayer(url_,{id:"gw_b2"});
    return layer;
}

//底图
function createDitu(){
	var url_=window.top.awater.url.url_vec;
	 var layer = new esri.layers.ArcGISTiledMapServiceLayer(url_[0],{id:url_[1]});
	 return layer;
}

// 定位 开始
function locationArc(){
	var x=GetQueryString("x");
	var y=GetQueryString("y");
	if(x!=null&&y!=null&&x!=''&&y!=''){
		var pointJson={"x":x,"y":y,"spatialReference":{"wkid":4326}};
		var geometry=new esri.geometry.Point(pointJson);
		var pipelineSymbol=(new esri.symbol.SimpleLineSymbol()).setColor(new esri.Color("red")).setWidth(5);
		var pipemarkerSymbol=(new esri.symbol.SimpleMarkerSymbol()).setColor(new esri.Color("red")).setSize(6).setOutline(pipelineSymbol);
		var graphic=new esri.Graphic(geometry, pipemarkerSymbol);
		mapDW.setZoom(18);
		mapDW.centerAt(geometry); 
		setTimeout(function(){
			mapDW.graphics.add(graphic);
	          setTimeout(function(){
	        	  mapDW.graphics.remove(graphic);
	              setTimeout(function(){
	            	 mapDW.graphics.add(graphic);
	          },200);
	       },300);
	    },300);
	}else{
		if(mapDW.graphics)
			mapDW.graphics.clear();
	}
}
// 定位 结束

// 清除  开始
function dwClear(){
	mapDW.graphics.clear();
}
// 清除 结束
//关闭
function dwPanelClose(){
	var index = parent.layer.getFrameIndex(window.name); 
    parent.layer.close(index);
}