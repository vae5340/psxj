var gisObject;
//图层名
var projectName = 'XIAOBAN';
var vector;
function getGisObject() {
    var agcomMap = window.parent.parent.document.getElementById('mapDiv').contentWindow;
    var agcomWindow = agcomMap.document.getElementById('agcom_iframes').contentWindow;
    var GisObject = agcomWindow.GisObject;
    return GisObject;
}

function getGisObject1() {
    var agcomMap = window.document.getElementById('mapDiv').contentWindow;
    var agcomWindow = agcomMap.document.getElementById('agcom_iframes').contentWindow;
    var GisObject = agcomWindow.GisObject;
    return GisObject;
}


function locationByPoint(type, xcoor, ycoor) {
    var x =xcoor==undefined?$("#X").val():xcoor;
    var y = ycoor==undefined?$("#Y").val():ycoor;
    layer.open({
		type: 2,
		title: "获取位置",
		shadeClose: false,
		// closeBtn : [0 , true],
		shade: 0.5,
		maxmin: false, //开启最大化最小化按钮
		area: ['500px', '450px'],
		offset: ['0px', $(window).width()/2-230+'px'],
		content: "/psxj/systemInfo/ssxjxt/xcyh/xcyh/mapDW.html?x=" + x +"&y=" + y,
		cancle:function(){
		},
		end : function(){

		}

	});
}

// 关闭
function dwPanelClose(){
	var index = parent.layer.getFrameIndex(window.name); 
    parent.layer.close(index);
}

function selectFeature(){
    herf = window.parent.location.href;
    var thishref = herf.substring(herf.indexOf("webpage"), herf.length-1);
    tabs.children("a[data-id='mapDiv']").addClass("active").siblings(".J_menuTab").removeClass("active");
    $('#content-main', window.parent.parent.document).children(".J_iframe[data-id='mapDiv']").show();
    window.parent.parent.layer.msg('请在地图上标记位置', {
        icon: 1,
        time: 1000 //1s后自动关闭
    });

    gisObject = getGisObject();
    gisObject.toolbar.clear();
    if (!vector) rebindVectorEvent(gisObject, thishref);
    //在地图上加载小斑图层
    if (!gisObject.layerTreeWidget.getLayerVisibleByName(projectName))
        gisObject.layerTreeWidget.setLayerVisibleByName(projectName, true);
}


//重新绑定图层要素点击事件
function rebindVectorEvent(GisObject, thishref) {
    //获取所有图层数据
    var minLayerDirLayer = GisObject.layerTreeWidget.minLayerDirLayer;
    for (var pNodeName in minLayerDirLayer) {
        var cNodes = minLayerDirLayer[pNodeName];
        for (var i = 0; i < cNodes.length; i++) {
            var node = cNodes[i];
            if (node.name == projectName) {
                vector = GisObject.layerTree.drawVectors[node.id];
                //解绑默认图层绑定的事件
                vector.events.listeners['featureselected'].splice(0, 1);
                var agcom_2dmap = window.parent.parent.document.getElementById("mapDiv").contentWindow[1];
                vector.events.on({
                    //矢量图层鼠标左键事件
                    "featureselected": agcom_2dmap.dojo.hitch(this, function (r) {
                            $('#xiaoban_objectid').val(r.feature.attributes.objectId);
                            tabs.children("a[data-id='" + thishref + "']").addClass("active").siblings(".J_menuTab").removeClass("active");
                            $('#content-main', window.parent.parent.document).children(".J_iframe[data-id='" + thishref + "']").show();
                            $('#content-main', window.parent.parent.document).children(".J_iframe[data-id='mapDiv']").hide();
                        }
                    )
                });
                return;
            }
        }
    }
}

function getDrawType(v) {

    var agcom_2dmap = window.parent.parent.document.getElementById("mapDiv").contentWindow[1];
    switch (v) {
        case "point":
            return agcom_2dmap.AG.MicMap.gis.Toolbar.POINT;
        case "extent":
            return agcom_2dmap.AG.MicMap.gis.Toolbar.EXTENT;
        case "line":
            return agcom_2dmap.AG.MicMap.gis.Toolbar.POLYLINE;
        case "polygon":
            return agcom_2dmap.AG.MicMap.gis.Toolbar.POLYGON;
        case "oval":
            return agcom_2dmap.AG.MicMap.gis.Toolbar.OVAL;
    }
    return null;
}

function locatePosition(xiaobanId) {
    $.ajax({
        type: 'post',
        url: '/' + serverName + '/asi/xcyh/businessAccepted/ccproblem!getXiaoBanWkt.action',
        data: {'xiaobanId': xiaobanId},
        dataType: 'json',
        success: function (ajaxResult) {
            if (ajaxResult) {
                if (ajaxResult.success && ajaxResult.result != '') {
                    gisObject = getGisObject1();
                    var agcom_2dmap = window.parent.parent.document.getElementById("mapDiv").contentWindow[1];
                    var geometry = agcom_2dmap.AG.MicMap.gis.Toolbar.getGeometryByWKT(ajaxResult.result);
                    gisObject.layerdraw.addGeometry(geometry, null, gisObject.getHighlightStyle('bufferStyle'));
                    gisObject.map.zoomToExtent(geometry.getBounds());
                }
            }
        }
    })
}

function locatePointPosition(x,y){
    gisObject = getGisObject1();
    var style = null;
    var wkt = "POINT("+x+" "+y+")";
    if(wkt) {
        if (wkt.indexOf('POINT') != -1) {
            style = {
                url: "/agcom/2DMap/com/augurit/resources/images/info.gif"
            }
            gisObject.layerLocate.locateByWkt(wkt, null, true, true, style);
        } else {
            gisObject.layerLocate.locateByWkt(wkt, null, true, true, gisObject.getHighlightStyle('bufferStyle'));
        }
    }
}

// 点定位
function locationPointPositionArc(x,y){
	if(x!=null&&y!=null&&x!=''&&y!=''){
		mapArc.graphics.clear();
		var pointJson={"x":x,"y":y,"spatialReference":{"wkid":4326}};
		var geometry=new esri.geometry.Point(pointJson);
		var pipelineSymbol=(new esri.symbol.SimpleLineSymbol()).setColor(new esri.Color("red")).setWidth(5);
		var pipemarkerSymbol=(new esri.symbol.SimpleMarkerSymbol()).setColor(new esri.Color("red")).setSize(6).setOutline(pipelineSymbol);
		var graphic=new esri.Graphic(geometry, pipemarkerSymbol);
		mapArc.setZoom(18);
		mapArc.centerAt(geometry); 
		setTimeout(function(){
			mapArc.graphics.add(graphic);
	          setTimeout(function(){
	        	  mapArc.graphics.remove(graphic);
	              setTimeout(function(){
	            	 mapArc.graphics.add(graphic);
	          },200);
	       },300);
	    },300);
	}else{
		mapArc.graphics.clear();
	}
}
