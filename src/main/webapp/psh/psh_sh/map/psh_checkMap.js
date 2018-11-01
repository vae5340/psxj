//地图初始化相关的脚本1
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
var map;
var mp_tc=window.parent.mp_tc;
//样式
var pipelineSymbol,pipemarkerSymbol,pipefillSymbol;
var toCheckInput;
var serverName="psxj";
// 地图初始化  开始
function initMapArc(){
	map = new esri.Map("mapDiv", {
		showLabels: true,
	    logo:false,
	    center: [113.33863778154898,23.148347272756297],
	    extent: new esri.geometry.Extent({          
	    	xmin: 112.94442462654136,
	    	ymin: 22.547612828115952,
	    	xmax: 114.05878172043404,
	    	ymax: 23.938714362742893,
	    	/* xmin: 107.23452588182978,
	      ymin: 21.813379881292327,
	      xmax: 110.3840906318817,
	      ymax: 24.252829164596033,*/
	      spatialReference:{wkid:4326}
	    }),
//	    zoom: 17
	    zoom: 9,
	    maxZoom:10
	  });
	//电子底图
	 map.addLayer(createVec());
    map.addLayer(createDitu());
    //加载排水户上报服务
    showMpTc();

//    var mapClickOn = map.on('click', doIdentifyCheck);//点差事件
    pipelineSymbol=(new esri.symbol.SimpleLineSymbol()).setColor(new esri.Color("red")).setWidth(5);
    pipemarkerSymbol=(new esri.symbol.SimpleMarkerSymbol()).setColor(new esri.Color("red")).setSize(6).setOutline(pipelineSymbol);
    pipefillSymbol=(new esri.symbol.SimpleFillSymbol()).setOutline(pipelineSymbol);
    toCheckInput = new ToCheckInput();
}
//加载门牌图层
function showMpTc(){
	var featureLayerMp = new esri.layers.ArcGISDynamicMapServiceLayer(mp_tc, {id: 'mp_tc',visable:true});
	map.addLayer(featureLayerMp);
	map.on('click',identityMpTask);
}
//门牌点击事件
function identityMpTask(event){
	if(typeof(event.graphic)!="undefined" && typeof(event.graphic.geometry)!="undefined" && typeof(event.graphic.geometry.stateName)!="undefined"){
		return;//如果点击的是问题上报点 就不走这里，不然会覆盖问题上报的弹框
	}
	var layerMap = map.getLayer("mp_tc");
	if(!layerMap || !layerMap.visible)
		return;
	var identifyTask = new esri.tasks.IdentifyTask(mp_tc); 
    var identifyParams = new esri.tasks.IdentifyParameters();// 查询参数
    identifyParams.tolerance = 5;// 容差范围
    identifyParams.returnGeometry = true;// 是否返回图形
    identifyParams.layerIds = [0];// 查询图层
    identifyParams.layerOption = esri.tasks.IdentifyParameters.LAYER_OPTION_VISIBLE;// 设置查询的图层
    // 查询范围
    identifyParams.width = map.width;  
    identifyParams.height = map.height;  
    identifyParams.geometry = event.mapPoint;  
    identifyParams.mapExtent = map.extent;  
    identifyTask.execute(identifyParams,function(results){
    	//console.log(results);
    	 var feature;  
         var sGeometry; 
         var graphic;
         if(!results || results.length==0)
         	return;
         map.graphics.clear();
         //显示门牌挂接的接驳井并连线
         var symbol0 = new esri.symbol.PictureMarkerSymbol("../../img/old_map_point_jing.png", 21, 28);
		 symbol0.setOffset(0, 14);
		 //雨水
		 var symbol_y = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SHORTDASH, new esri.Color("#79e70c"), 2);
		//污水
		 var symbol_w = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SHORTDASH, new esri.Color("#e60000"), 2);
		//雨污合流
		 var symbol_h = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SHORTDASH, new esri.Color("#ae2fe8"), 2);
		 var feature1 = results[0].feature;
         $.ajax({
     		type : 'get',
     		url: '/' + serverName + '/pshDischargerWell/getFormBySGuid',
     		data:{"sGuid":feature1.attributes.S_GUID},
     		async:false,
     		dataType: 'json',
     		success : function(data){
     			if(data!=null && data.length>0){
     				for ( var i = 0; i < data.length; i++) {
     					var query = new esri.tasks.Query();
     					var queryTask= new esri.tasks.QueryTask(parent.awater.url.url_report[0]+"/0");
     					query.outFields = ["*"];
     					query.where = "OBJECTID="+data[i];
     					queryTask.execute(query,function(result){
     						if(!result || result.features.length==0)
     				         	return;
     						var feature=result.features[0];
     						var point = new esri.geometry.Point(feature.attributes.X,feature.attributes.Y,map.spatialReference);
     				        graphic = new esri.Graphic(point, symbol0);
     			            map.graphics.add(graphic);
     			            var polyline = new esri.geometry.Polyline(
     			        	   [[feature1.geometry.x,feature1.geometry.y], [feature.attributes.X,feature.attributes.Y]],
     			        	   map.spatialReference
     			        	);
     			            var symbolPolyline;
     			            if(feature.attributes.ATTR_TWO=="雨水"){
     			            	symbolPolyline=symbol_y;
     			            }else if(feature.attributes.ATTR_TWO=="污水"){
     			            	symbolPolyline=symbol_w;
     			            }else{
     			            	symbolPolyline=symbol_h;
     			            }
     			            var graphic = new esri.Graphic(polyline, symbolPolyline);
     			            map.graphics.add(graphic);
     					});
     				}
     			}
     		}
     	});
     	 var point;
         var texts="<div ><ul class=\"meumul\">";
         var symbol1 = new esri.symbol.PictureMarkerSymbol("../../img/ic_add_facility_door.png", 21, 28);
		 symbol1.setOffset(0, 14);
         for ( var i = 0; i < results.length; i++) {  
             feature = results[i].feature;
             feature.setSymbol(symbol1);
             map.graphics.add(feature);
             if(i<6){
            	 texts+="<li class=\"meumli\" onclick=\"pshInfo('"+feature.attributes.S_GUID+"')\"><span>门牌号码:"+feature.attributes.MPWZHM+"</span><br/>" +
            	 "<span style='font-size:11px;'>门牌编号:"+feature.attributes.OBJECTID+"</span><br/>"+
            	 "<span style='font-size:11px;'>地址全称:"+feature.attributes.DZQC+"</span></li>";
             }
             map.infoWindow.show(feature.geometry, map.getInfoWindowAnchor(feature.geometry)); 
             var geometr =results[0].feature.geometry;
             if(geometr.type=="point"){
	                point = new esri.geometry.Point(geometr.x,geometr.y,geometr.spatialReference);
             }else if(geometr.type=="polyline"){
             	point = new esri.geometry.Point(geometr.paths[0][0][0],geometr.paths[0][0][1],geometr.spatialReference);
             }
         }
         texts+="</ul></div>";
         var len=results.length;
         //设置宽度和高度
         map.infoWindow.resize(240,(len<4? len*200:800));
         map.infoWindow.setTitle("基本信息");  
         map.infoWindow.setContent(texts);
         if(!point){
         	map.infoWindow.show();
         }else{
         	map.infoWindow.show(point);
         }
    });
}
//门牌查看排水户信息
function pshInfo(mpId){
	layer.open({
		type: 2,
		area: ['1200px', '650px'],
		title : "排水户信息",	
		maxmin: true,
		btn:['确定','取消'],
		content: ['/psxj/psh/psh_query/mpToPshList.html?mpId='+mpId, 'yes']
	});
}
//地图初始化  结束
//点击查看数据
function doIdentifyCheck(event){
    var layerMap = map.getLayer("mp_tc");
    if(layerMap && layerMap.visibleAtMapScale) {
        map.infoWindow.hide();
        var identifyTask = new esri.tasks.IdentifyTask(parent.awater.url.url_nw_report[0]);
        var identifyParams = new esri.tasks.IdentifyParameters();
        identifyParams.tolerance = 10;// 容差范围
        identifyParams.returnGeometry = true;// 是否返回图形
        identifyParams.layerIds = [0];
        identifyParams.layerOption = esri.tasks.IdentifyParameters.LAYER_OPTION_VISIBLE;
        identifyParams.width = map.width;
        identifyParams.height = map.height;
        identifyParams.geometry = event.mapPoint;
        identifyParams.mapExtent = map.extent;
        identifyTask.execute(identifyParams, function (results) {
            toCheckInput.data = [];
            console.log(results);
            var feature;
            var sGeometry;
            var graphic;
            if(!results || results.length==0)
                return;
            map.graphics.clear();
            var point;
            var texts="<div style=\"overflow-x: hidden;\"><ul class='nweumul'>";
            for ( var i = 0; i < results.length; i++) {
                feature = results[i].feature;
                var attributes = feature.attributes;
                feature.setSymbol(pipemarkerSymbol);
                map.graphics.add(feature);
                toCheckInput.data[i] =attributes;
                if(i<6)
                    var toData = new Date(attributes.mark_time);
                    texts+="<li style='"+(i>0? "margin-top: 10px;":"")+"' onclick='toCheckInput.InitHtml("+attributes.MARK_ID+");'><span>设施类型："+attributes.layer_name+"</span><br/><span>上报类型："+attributes.CHECK_TYPE+"</span><br/>" +
                        "<span style='font-size:11px;'>上报人："+attributes.mark_person+"</span><br/><span style='font-size:11px;'>上报时间："+new Date(toData.setHours(toData.getHours()+8)).pattern('yyyy-MM-dd HH:mm')+"</span><br/>" +
                        "<span style='font-size:11px;'>上报地点："+attributes.addr+"</span></li>";
                map.infoWindow.show(feature.geometry, map.getInfoWindowAnchor(feature.geometry));
                var geometr =results[0].feature.geometry;
                if(geometr.type=="point"){
                    point = new esri.geometry.Point(geometr.x,geometr.y,geometr.spatialReference);
                }else if(geometr.type=="polyline"){
                    point = new esri.geometry.Point(geometr.paths[0][0][0],geometr.paths[0][0][1],geometr.spatialReference);
                }
            }
            texts+="</ul></div>";
            var len=results.length;
            //设置宽度和高度
            map.infoWindow.resize(350,(len<4? len*200:800));
            map.infoWindow.setTitle("基本信息");
            map.infoWindow.setContent(texts);
            if(!point){
                map.infoWindow.show();
            }else{
                map.infoWindow.show(point);
            }
        });
    }
}
//根据权限加载上报数据
function orgLoadMap(){
    var layerOptions = [];
    if(parent.createTabCurrent.getOrg){
        var org = parent.createTabCurrent.getOrg;
        if(org.teamOrg){
            layerOptions[0] = "TEAM_ORG_ID ="+org.teamOrgId;
        }else if(org.parentOrg){
            layerOptions[0] = "PARENT_ORG_ID ="+org.parentOrgId;
        }
        var layerNw = createReport(parent.awater.url.url_nw_report[0],mp_tc)
        layerNw.setLayerDefinitions(layerOptions);
        map.addLayer(layerNw);
    }else{
        layer.msg("加载农污机构失败!",{icon:'5'});
    }
    /*$.ajax({
       type:'get',
        url:'/psxj/nw-check-record!getUserOrgs.action',
        dataType:'json',
        success:function(result){
            if(result.code==200){
                if(result.data){
                    var org = result.data;
                }else{
                    layer.msg("加载农污机构失败!",{icon:'5'})
                }
            }
        },error:function(result){
            layer.msg("加载农污机构失败!",{icon:'5'})
        }
    });*/
}
function clickRefresh(){
    map.graphics.clear();
    map.infoWindow.hide();
    refreshMap(mp_tc);
}
//刷新图层
function refreshMap(layerId){
    if(!map)
        return;
    map.getLayer(layerId).refresh();
}
function createReport(url,id){
	//var url_=window.parent.awater.url.url_h;
	var layer = new esri.layers.ArcGISDynamicMapServiceLayer(url,{id:id,visable:true});
	return layer;
}

//电子底图
function createVec(){
	var layer = new esri.layers.ArcGISTiledMapServiceLayer(parent.awater.url.url_vec[0],{id:parent.awater.url.url_vec[1]});
	return layer;
}
//遥感底图
function createDitu(){
	var layer = new esri.layers.ArcGISTiledMapServiceLayer(parent.awater.url.url_ditu[0],{id:parent.awater.url.url_ditu[1],visible:false});
	return layer;
}

//根据sGuid定位
function positionSGuid(sGuid){
	var query = new esri.tasks.Query();
	var queryTask= new esri.tasks.QueryTask(mp_tc+"/0");
	query.outFields = ["*"];
	query.where = "S_GUID='"+sGuid+"'";
	queryTask.execute(query,function(result){
		if(!result || result.features.length==0)
         	return;
		var feature=result.features[0];
		//positPoint(feature.attributes.X,feature.attributes.Y);
		//定位
		var point,x,y;
		x=feature.attributes.ZXJD;
		y=feature.attributes.ZXWD;
		if(x && y && map.spatialReference){
			point = new esri.geometry.Point(x,y,map.spatialReference);
			//var simpleMarkerSymbol = new esri.symbol.SimpleMarkerSymbol();
			var symbol1 = new esri.symbol.PictureMarkerSymbol("../../img/ic_add_facility_door.png", 21, 28);
			symbol1.setOffset(0, 14);
	        var graphic = new esri.Graphic(point, symbol1);
	        map.graphics.clear();
	        map.setZoom(10);
	        map.centerAt(graphic.geometry);
	        map.graphics.add(graphic);
	        //centerAtGeometrys(graphic.geometry);
		}
	});
}

//根据x，y定位
function positPoint(x,y){
	var point;
	if(x && y && map.spatialReference){
		point = new esri.geometry.Point(x,y,map.spatialReference);
		//var simpleMarkerSymbol = new esri.symbol.SimpleMarkerSymbol();  
        var graphic = new esri.Graphic(point, pipemarkerSymbol);
        centerAtGeometrys(graphic.geometry);
	}
}
//高亮显示（根据geometry）
function centerAtGeometrys(geometry){
	if(!geometry)
		return;
   map.graphics.clear();
   var graphic;
   if(geometry.type=="point"){
       graphic= new esri.Graphic(geometry, pipemarkerSymbol);
       map.setZoom(10);
       map.centerAt(geometry); 
       setTimeout(function(){
         map.graphics.add(graphic);
          setTimeout(function(){
               map.graphics.remove(graphic);
             setTimeout(function(){
             map.graphics.add(graphic);
          },200);
       },300);
       },300);
   }else if(geometry.type=="polyline"){
       graphic= new esri.Graphic(geometry, pipelineSymbol);
       map.setExtent(geometry.getExtent()); 
       setTimeout(function(){
         map.graphics.add(graphic);
          setTimeout(function(){
               map.graphics.remove(graphic);
             setTimeout(function(){
             map.graphics.add(graphic);
          },200);
       },300);
       },300);
   }else{
       graphic= new esri.Graphic(geometry, pipefillSymbol);
       map.setExtent(geometry.getExtent()); 
        setTimeout(function(){
         map.graphics.add(graphic);
          setTimeout(function(){
               map.graphics.remove(graphic);
             setTimeout(function(){
             map.graphics.add(graphic);
          },200);
       },300);
     },300);
  }
}
var ToCheckInput = function(){
    ToCheckInput = new Object();
    ToCheckInput.data,
    ToCheckInput.InitHtml = function(markid){
        if(markid){
            var row_markid = markid;
            layer.open({
                type: 2,
                area: ['900px', '700px'],
                maxmin: true,
                zIndex:20000,
                title : "查看详情",
                btn:['上一条','下一条','返回'],
                content: ['/psxj/psh/psh_sh/showSq/psh_checkInput.html?id='+markid, 'yes'],
                btn1: function(index,layero){
                    var iframes = $(layero).find("iframe")[0].contentWindow;
                    var row = ToCheckInput.getUpDoum('up',row_markid);
                    if(row && row.MARK_ID){
                        row_markid = row.MARK_ID;
                        iframes.reloadCorrectMark(row.MARK_ID);
                    }else{
                        layer.msg("当前没有上一条了!",{icon: 5});
                    }
                    return false;
                },btn2: function(index,layero){
                    var iframes = $(layero).find("iframe")[0].contentWindow;
                    var row = ToCheckInput.getUpDoum('down',row_markid);
                    if(row && row.MARK_ID){
                        row_markid = row.MARK_ID;
                        iframes.reloadCorrectMark(row.MARK_ID);
                    }else{
                        layer.msg("当前没有下一条了!",{icon: 5});
                    }
                    return false;
                },success: function(layero){
                    layero.find('.layui-layer-btn0')[0].style.borderColor="#2e8ded";
                    layero.find('.layui-layer-btn1')[0].style.backgroundColor ="#2e8ded";
                    layero.find('.layui-layer-btn1')[0].style.color="#ffffff";
                }
            });
        }
    },
    ToCheckInput.getUpDoum = function(tag,markid){
        if(tag && this.data && markid){
            if(typeof this.data !='object')
                throw new Error("类型错误："+this.data);
            if(typeof tag !='string')
                throw new Error("类型错误："+this.tag);
            if('up'==tag){
                for(var i=0;i< this.data.length;i++){
                    if(markid == this.data[i].MARK_ID){
                        return i>0? this.data[i-1]: null;
                    }
                }
            }else if('down'==tag){
                for(var i=0;i< this.data.length;i++){
                    if(markid == this.data[i].MARK_ID){
                        return i<this.data.length-1? this.data[i+1]: null;
                    }
                }
            }else{
                return null;
            }
        }
    }
    return ToCheckInput;
}