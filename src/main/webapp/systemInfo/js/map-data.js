//地图初始化相关的脚本
require([
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
    	var areaData=[[
            "黄埔","10"
        ], [
            "天河","28"
        ],[
            "白云","12"
        ],[
            "番禺","15"
        ],[
            "海珠","27"
        ], [
            "越秀","29"
        ], [
            "南沙","16"
        ],[
            "荔湾","20"
        ],[
            "花都","10"
        ],[
            "增城","18"
        ],[
            "从化","12"
        ], [
            "净水公司","11"
        ]];
    	loadEcharData(areaData);
	 });
});
var pipemarkerSymbols,pipelineSymbol;
//加载统计数据到地图  //pipemarkerSymbols
function loadEcharData(result){
	var rows=[],layerId;
	if(result){
		$.ajax({
			method : 'get',
			url: '/psxj/systemInfo/data/area_data.json',
			dataType: 'json',
			success : function(data){
				if(!data)
					return;
				layerId = data.layerId;
				for(var i=0;i<result.length;i++){
					var areaName = result[i][0]; //区域名 ,result是后台加载的数据
					var areaTotal =result[i][1]; //区域统计数量
					for(var k=0;k<data.rows.length;k++){
						var item = data.rows[k];
						if(areaName.indexOf(item.name) != -1){
							rows[i]=item;
							rows[i].total = areaTotal;
						}
					}
				}
				if(layerId && rows.length>0)
					EcharDatatoMap(rows,layerId);
			}
		});
	}
}
function EcharDatatoMap(rows,layerId){
	pipelineSymbol=(new esri.symbol.SimpleLineSymbol()).setColor(new esri.Color("#81C0C0")).setWidth(5);//.setStyle("opacity:0.4");
	pipemarkerSymbols=(new esri.symbol.SimpleMarkerSymbol()).setColor(new esri.Color("#81C0C0")).setSize(26).setOutline(pipelineSymbol);//.setStyle("opacity:0.4");
	var font = new esri.symbol.Font("19px",esri.symbol.Font.VARIANT_NORMAL, esri.symbol.Font.WEIGHT_BOLD,"Courier");//Font.STYLE_ITALIC,
    font.setWeight(esri.symbol.Font.WEIGHT_BOLD);
	var featureLayer = null;
	if(!map)
		return;
	 var layerDefinition = {
	    "geometryType": "esriGeometryPolygon",
	    "fields": [{
	      "name": "BUFF_DIST",
	      "type": "esriFieldTypeInteger",
	      "alias": "Buffer Distance",
	    }]
	  } 
	  var featureCollection = {
	    layerDefinition: layerDefinition,
	    featureSet: null
	  };
	if(map.getLayer(layerId)){
		featureLayer = map.getLayer(layerId);
	}else{
		featureLayer = new esri.layers.FeatureLayer(featureCollection, {
	          id: layerId,
	          opacity:0.7
	    });
	}
	for(var i=0;i<rows.length;i++){
		var labelSymbol = new esri.symbol.TextSymbol().setOffset(-1, -5).setFont(font);
		var name = rows[i].name;
		var total = rows[i].total;
		var x  = rows[i].x;
		var y  = rows[i].y;
		var attr = rows[i];
		labelSymbol.setText(total);
		var geometry = new esri.geometry.Point(x,y);
		var graphic = new esri.Graphic();
		graphic.setGeometry(geometry);
		graphic.setSymbol(pipemarkerSymbols);
		var graphicText = new esri.Graphic(geometry,labelSymbol);
		graphic.setAttributes(attr);
		graphicText.setAttributes(attr);
		featureLayer.add(graphic);
		featureLayer.add(graphicText);
		//featureLayer.setMaxScale(0);
	    //featureLayer.setMinScale(20000);
	    map.addLayers([featureLayer]);
	}
	featureLayer.on('click', function(g){
		console.log(g);
	});
}
