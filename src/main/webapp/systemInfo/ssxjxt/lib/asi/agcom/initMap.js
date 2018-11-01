//地图操作相关的脚本
//操作地图的GisObject对象，在agcom_2DMap.js的initmap方法对他赋值
var GisObject;
var AgcomWindow;
var HeatMapLayer;

//获取操作地图的GisObject对象
function getGisObject() {
	var agcomMap = window.document.getElementById('mapDiv').contentWindow;
	var agcomWindow = agcomMap.document.getElementById('agcom_iframes').contentWindow;
	GisObject=agcomWindow.GisObject;
    return GisObject;
}

//获取操作地图的AgcomWindow对象
function getAgcomWindow() {
	var agcomMap = window.document.getElementById('mapDiv').contentWindow;
	AgcomWindow = agcomMap.document.getElementById('agcom_iframes').contentWindow;
    return AgcomWindow;
}


//增加热点图
function addheatmap(heatMapData) {
	var transformedData = { max: 1 , data: [] },
    data = heatMapData.data,
    datalen = data.length,
    nudata = [];
	var agcomMap = window.document.getElementById('mapDiv').contentWindow;
	AgcomWindow = agcomMap.document.getElementById('agcom_iframes').contentWindow;
	while(datalen--){
    	nudata.push({
        	lonlat: new AgcomWindow.AG.MicMap.LonLat(data[datalen].lon, data[datalen].lat),
        	count: parseInt(data[datalen].count)
    	});
	}
	transformedData.data = nudata;  
	var heatmap = getGisObject().getHeatMapLayer();
	getGisObject().map.addLayer(heatmap);
	heatmap.isBaseLayer = true;
	heatmap.setVisibility(true);
	heatmap.setDataSet(transformedData);
	HeatMapLayer=heatmap;
	return heatmap;
}


/**
 * //地图上弹详情信息窗
 * @param itemParam {} 传入参数
 */
function clickItem(serverName,templateCode,taskInstDbid,masterEntityKey){//
	layer.open({
		type: 2,
		title: "详细信息",
		shadeClose: false,
		//closeBtn : [0 , true],
		shade: 0.5,
		maxmin: false, //开启最大化最小化按钮
		area: ['700px', '550px'],
		offset: ['120px', $(window).width()/2-400+'px'],
		content: "/psxj/systemInfo/ssxjxt/xcyh/xcyh/detail.html?serverName="+serverName+"&templateCode="+templateCode+"&taskInstDbid="+taskInstDbid+"&masterEntityKey="+masterEntityKey,
		cancel: function(){
		},
		end : function(){

		}

	});
}

/**
 * //地图上弹设施详情信息窗
 * @param itemParam {} 传入参数
 */
function clickFacilityItem(itemParam){// 
	//iframe窗
    window.openLayerPanal(itemParam.url,itemParam.title,itemParam,itemParam.width,itemParam.height,120,$("#mapDiv").width()*0.45,false,true,null,null);
}

/**
 * 地图相对面板宽度做相关偏移
 * @param flag 偏移标志 0："-" 向左偏移,1:"+" 向右偏移
 */
function moveAgcomWindowByWidth(flag) {
	if(GisObject){
        var mapWidth = (GisObject.toolbar.getExtent()[0] - GisObject.toolbar.getExtent()[2])*0.16;
        var mapCenterPoint = GisObject.toolbar.getCenter(); 
        var mapCenterX = mapCenterPoint[0];
        if(flag==1){
        	mapCenterX = mapCenterPoint[0]+mapWidth;
        }else{
            mapCenterX = mapCenterPoint[0]-mapWidth;
        }

        GisObject.setInitCenter(parseFloat(mapCenterX),mapCenterPoint[1],parseInt(GisObject.toolbar.getZoom()));
//        GisObject.toolbar.setCenter(mapCenterX, mapCenterPoint[1],GisObject.toolbar.getZoom());
	}
}

/**
 * 设置地图缩放到某个范围
 * @param left,bottom,right,top
 */
function zoomToExtent(left,bottom,right,top) {
	if(GisObject){
		GisObject.toolbar.zoomToExtent(left,bottom,right,top);
	}
}

//清除热点图
function removeHeatmap() {
	if(HeatMapLayer){
	  	HeatMapLayer.tmpData = {};
	  	GisObject.map.removeLayer(HeatMapLayer);
		HeatMapLayer=null;
	}
}

//清除全部绘制要素对象
function removeAllFeatures() {
	if(GisObject){
		  GisObject.toolbar._drawVectors.removeAllFeatures();
		  GisObject.map.infowindow.hideInfoWindow();//隐藏
		  GisObject.toolbar._drawVectors.events.un({
			    scope : this
			});
	}
}

