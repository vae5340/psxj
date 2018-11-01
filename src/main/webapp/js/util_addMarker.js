require([
    "esri/map",
    "esri/dijit/Scalebar",
    "esri/geometry/Circle",
    "esri/symbols/SimpleLineSymbol",
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
	"esri/InfoTemplate",
    'esri/geometry/screenUtils',
    "dojo/domReady!"
], function(
    Map,
    Scalebar,
    Circle,
    SimpleLineSymbol,
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
    HeatmapRenderer,
    SimpleMarkerSymbol,
	InfoTemplate,
    screenUtils
){});
	var map;
	var markLayer,measureLayer;
	var graphic;
	var allMarkers = [];//标记数组
	var infoTemplate;
	
	//初始化地图
    function initMarker(){//初始化地图操作模块
		map = window.map;
		//清除地图上其他的InfoWindow
		
		//创建图层
		markLayer = new esri.layers.GraphicsLayer();
		//markLayer.spatialReference=map.spatialReference;
		//把图层添加到地图上
		map.addLayer(markLayer);
		var onOff = true;
        var changeHandler = map.on("click", function(e) {
	        if(onOff){
				pipeNetworkFunctions.pipeIdentify.setAllowPopup(false);
				addMarker(e.mapPoint.x, e.mapPoint.y);								
				onOff = false;
			}else{
				changeHandler.remove();
				onOff = true;
			}
		});	
		map.showZoomSlider();
    }
	function addMarker(xx,yy){
		//设置标注的经纬度
		var pt = new esri.geometry.Point(xx,yy,map.spatialReference);
		//设置标注显示的图标
		var symbol = new esri.symbol.PictureMarkerSymbol("waterSystem/ssjk/img/gdgc.png",25,25);
		
		//创建模板
		infoTemplate = new esri.InfoTemplate();
		
		var str = "<label>标题：</label><input type='text' id='title' value='我的标记' style='width:180px;' onfocus='if(value == \"我的标记\"){value=\"\"}' onblur='if (value == \"\"){value=\"我的标记\"}'/></br></br>"+
		"<label style='vertical-align:top'>备注：</label><textarea rows='5' id='content' style='resize:none;width:180px;' onfocus='if(value == \"我的备注\"){value=\"\"}' onblur='if (value == \"\"){value=\"我的备注\"}'>我的备注</textarea></br></br>"+
		"<div style='float:right'><input style='margin-right:10px;' type='button' value='保存' onclick='save()'/>"+
		"<input type='button' value='删除' onclick='deleteMark()'/></div>";
		
		//要在模版中显示的参数
		var title = $("#title").val();
		var content = $("#content").val();		
        var attr = {"id": xx,"title":title,"content":content};
		
        //创建图像  
        graphic = new esri.Graphic(pt, symbol, attr);
		
		//设置模板标题内容
		for(var i = 0;i<graphic.attributes.id;i++){
			graphic.attributes.id[i] = this.id;
		}
		if(graphic.attributes.title && graphic.attributes.id == xx){
			infoTemplate.setTitle("${title}");
		}else{
			infoTemplate.setTitle("添加标注");
		}
		if(graphic.attributes.content && graphic.attributes.id == xx){
			infoTemplate.setContent("${content}</br><input type=\"button\" value=\"删除\" onclick=\"deleteMark()\"/>");
		}else{
			infoTemplate.setContent(str);
		}
        graphic.setInfoTemplate(infoTemplate);
		//把图像添加到刚才创建的图层上
		markLayer.add(graphic);
		setMapCenter(xx,yy,8);

		//dojo.connect(map.graphics,"onclick",showInfoWindow);
	}
	
	function setMapCenter(xx,yy,level){
		var point = new esri.geometry.Point(xx,yy,map.spatialReference);
		map.centerAndZoom(point,level);
	}
	
	//标注保存后的状态
	function save(){
		//获取标注内容保存到attribute
		var title = $("#title").val();
		var content = $("#content").val();
		var attr = {"title":title,"content":content};
		graphic.setAttributes(attr);
		infoTemplate.setTitle("${title}");
		infoTemplate.setContent("${content}</br><input style=\"float:right;\" type=\"button\" value=\"删除\" onclick=\"deleteMark(this)\"/>");
	}
	
	//删除graphic节点
	function deleteMark(o){
		
		graphic.hide();
		map.infoWindow.hide();
		//alert(graphicAttr);
	}
	//添加标注
	function mapAddOverLay(xx, yy, id, labelname) {
		var point = new BMap.Point(xx, yy);
		var marker = new BMap.Marker(point);
		map.addOverlay(marker); //添加标注

		allMarkers.push(marker); //记录覆盖物句柄

		if (labelname != "") {
			var label = new BMap.Label(labelname, { offset: new BMap.Size(20, -10) });
			marker.setLabel(label); //添加Label
		}

		//添加标注回调
		addOverlayCallback(marker, xx, yy, id);
	}
	
	//测距
	function measure(){
		
	}
	