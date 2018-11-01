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
var SGuid = getQueryStr("SGuid");
var wellId = getQueryStr("wellId");
var pipelineSymbol,pipemarkerSymbol,pipefillSymbol;

require(["dojo/ready"], function (ready) {
	ready(function () {
		//initBaidu();
		initMapArc();
		//初始化图层时注册查询事件
		mapDW.on('click',identityFindTask);
		// 定位
		//setTimeout(locationArc(),2000);
		// 画位置
		//setTimeout(DW(),2000);
		
	});	
});

var mapDW;
var flag;
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
function formatStr(str){
	if(str==null){
		return "";
	}else{
		return str;
	}
}
/**
 * 数据审核地图点击查询
 * @param point
 */
function identityFindTask(event){
	pipelineSymbol=(new esri.symbol.SimpleLineSymbol()).setColor(new esri.Color("red")).setWidth(5);
	pipemarkerSymbol=(new esri.symbol.SimpleMarkerSymbol()).setColor(new esri.Color("red")).setSize(6).setOutline(pipelineSymbol);
	pipefillSymbol=(new esri.symbol.SimpleFillSymbol()).setOutline(pipelineSymbol);
	if(typeof(event.graphic)!="undefined" && typeof(event.graphic.geometry)!="undefined" && typeof(event.graphic.geometry.stateName)!="undefined"){
		return;//如果点击的是问题上报点 就不走这里，不然会覆盖问题上报的弹框
	}
	mapDW.infoWindow.hide();
	var identifyTask = new esri.tasks.IdentifyTask(window.parent.parent.parent.parent.awater.url.url_jbj); 
    var identifyParams = new esri.tasks.IdentifyParameters();// 查询参数
    identifyParams.tolerance = 5;// 容差范围
    identifyParams.returnGeometry = true;// 是否返回图形
    identifyParams.layerIds = [0,1,2];// 查询图层
    identifyParams.layerOption = esri.tasks.IdentifyParameters.LAYER_OPTION_VISIBLE;// 设置查询的图层
    // 查询范围
    identifyParams.width = mapDW.width;  
    identifyParams.height = mapDW.height;  
    identifyParams.geometry = event.mapPoint;  
    identifyParams.mapExtent = mapDW.extent;  
    identifyTask.execute(identifyParams,function(results){
    	//console.log(results);
    	 var feature;
    	 var attributes;
         var sGeometry; 
         var graphic;
         if(!results || results.length==0)
         	return;
         mapDW.graphics.clear();
         feature = results[0].feature;
         attributes=feature.attributes;
         isExit(attributes.report_type,attributes.OBJECTID);
         var symbol1 = new esri.symbol.PictureMarkerSymbol("../../img/old_map_point_jing.png", 21, 28);
		symbol1.setOffset(0, 14);
        var graphic = new esri.Graphic(feature.geometry, symbol1);
        mapDW.graphics.clear();
        mapDW.graphics.add(graphic);
         if(flag){
        	 var htmls='<div class="tab-content" id="jbjxx" style="width:90%;height:100%;margin:auto" >'+
        	 '<form id="jbj" class="form-horizontal" >'+
        	 '<div class="form-group">'+
        	 '<label class="col-sm-12 control-label" style="font-size:15px;font-weight:300">'+attributes.layer_name+'('+attributes.OBJECTID+')'+'</label>'+
        	 '</div><div class="form-group"><table style="width:100%;"><tr style="width:100%;">'+
        	 '<td><label class="col-sm-6" >'+formatStr(attributes.attr_two)+' | '+formatStr(attributes.attr_one)+'</td></label>'+
        	 '<td><label>井盖材质:'+formatStr(attributes.attr_three)+'</label></td>'+
        	 '</tr></table></div><div class="form-group">'+
        	 '<label class="col-sm-12 control-label" >权属单位:'+formatStr(attributes.attr_four)+'</label>'+
        	 '</div><div class="form-group">'+
        	 '<label class="col-sm-12 control-label" >设施位置:'+formatStr(attributes.addr)+'</label>'+
        	 '</div><div class="form-group">'+
        	 '<label class="col-sm-12 control-label" >已挂牌编码:'+formatStr(attributes.attr_five)+'</label>'+
        	 '</div><div class="form-group">'+
        	 '<div class="col-sm-12" style="border: 1px solid #b5bcc7;border-radius:5px;left:15px;">'+
        	 '<p>接驳井照片</p><hr style="height:1px;border:none;border-top:1px dashed #555555;" />'+
        	 '<ul id="img-view" style="list-style: none;"></ul>'+
        	 '</div>'+
        	 '</div></form></div>';
        	 
        	 layer.open({
	  			  type: 1,
	  			  shade: false,
	  			  area: ['450px', '250px'],
	  			  title: "接驳井信息", //标题
	  			  btn:['确定'],
	  			  content: htmls,
	  			  btn1: function(index,layero){
	  				  parent.$("#x").val(x);
	  				  parent.$("#y").val(y);
	  				  parent.$("#wellId").val(attributes.OBJECTID);
	  				  parent.$("#wellIdName").val(attributes.layer_name+'('+attributes.OBJECTID+')');
	  				  dwPanelClose();
	  			  }
        	 });
        	 $.ajax({
     			type: 'post',
     			async: false,
     			url: '/agsupport_swj/psh-menpai!getImgsByObjId.action',
     			data: {objectId:attributes.OBJECTID},
     			dataType:'json',
     			success: function(data){
 					var total=0,imgHtml='',img_view='';
 					if(data.code==200 && data.rows && data.rows.length>0){
 						for(var i in data.rows){
 							var rowData=data.rows[i];
 							var timeText,imgUrl,thumPath;
 							if(rowData.attTime)
 								timeText = new Date(rowData.attTime).pattern("yyyy-MM-dd HH:mm:ss");
 							if(rowData.mime.indexOf('image')!=-1 || rowData.mime.indexOf('png')!=-1){
 								imgUrl = rowData.attPath;
 								thumPath = rowData.thumPath;
 							}
 							if(timeText && imgUrl && thumPath){
 								img_view+='<li class="img-view" style="width:88px;">'+""+'<img data-original='+imgUrl+'"' +
 										' src="'+thumPath+'" alt="图片'+(timeText)+'" width=85 height=95></li>';
 								total++;
 							}
 						}//style="width:88px;
 						if(imgHtml != ''){
 							//imgHtml+='</div>';
 						}
 					}else{
 						//imgHtml+='<label class="col-sm-3 control-label">暂无照片</label>';
 						img_view+='暂无照片';
 					}
 					$("#img-view").append(img_view);
 					//执行父页面图片预览初始化
 					$(".img-view").click(function(){
 						if(parent.parent.parent.parent.initViewer)
 							parent.parent.parent.parent.initViewer($("#img-view").parent().html(),"img-view");
 						if(parent.parent.initViewer)
 							parent.parent.initViewer($("#img-view").parent().html(),"img-view");
 						if(parent.viewer){
 							parent.viewer.show($(this).index());
 						}else if(parent.parent.parent.parent.viewer){
 							parent.parent.parent.parent.viewer.show($(this).index());
 						}else{
 							layer.msg("未检测到图片插件!",{icon: 2});
 						}
 					});
     			}
        	 });
         }
     	 /*var point;
         var texts="<div style=\"overflow-x: hidden;\"><ul class=\"meumul\">";
         for ( var i = 0; i < results.length; i++) {  
             feature = results[i].feature;  
             feature.setSymbol(pipefillSymbol);
             mapDW.graphics.add(feature);
             var reportType=feature.attributes.report_type;
             if(i<6){
            	 //texts+="<li class=\"meumli\" onclick=\"alertMapOpen('"+awater.url.url_report[0]+"','"+results[i].layerId+"','"+feature.attributes.OBJECTID+"')\"><span>类型:"+(reportType=='modify'? feature.attributes.layer_name:feature.attributes.component_type )+"</span><br/>" +
            	// "<span style='font-size:11px;'>上报类型:"+(reportType=='modify'?'数据校核':'数据上报')+"</span><br/><span style='font-size:11px;'>上报时间:"+feature.attributes.mark_time+"</span></li>";
            	 texts+="<li class=\"meumli\" onclick=\"alertMapOpenLayer('"+feature.attributes.report_type+"','"+feature.attributes.OBJECTID+"')\"><span>类型:"+feature.attributes.layer_name+"</span><br/>" +
            	 "<span style='font-size:11px;'>上报编号:"+feature.attributes.OBJECTID+"</span><br/>"+
            	 "<span style='font-size:11px;'>上报类型:"+(reportType=='modify'?'数据校核':'数据新增')+"</span><br/><span style='font-size:11px;'>上报时间:"+feature.attributes.mark_time+"</span></li>";
             }
             mapDW.infoWindow.show(feature.geometry, mapDW.getInfoWindowAnchor(feature.geometry)); 
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
         mapDW.infoWindow.resize(240,(len<4? len*200:800));
         mapDW.infoWindow.setTitle("基本信息");  
         mapDW.infoWindow.setContent(texts);
         if(!point){
        	 mapDW.infoWindow.show();
         }else{
        	 mapDW.infoWindow.show(point);
         }*/
    });
}
function isExit(reportType,objectid){
	if(objectid){
		//console.log(reportType,objectid);
		$.ajax({
			type: 'post',
			async: false,
			url: '/agsupport_swj/correct-mark!getFormByObjectId.action',
			data: {isCheck : reportType, objectId:objectid},
			dataType:'json',
			success: function(data){
				//console.log(data);
				if(data.success){
					flag=true;
					return;
				}else{
					flag=false;
					layer.msg("未检测到上报信息!",{icon:2});
				}
			}
		});
	}
}
//接驳井定位
function positionObjId(objId){
	var query = new esri.tasks.Query();
	var queryTask= new esri.tasks.QueryTask(window.parent.parent.parent.parent.awater.url.url_jbj+"/0");
	query.outFields = ["*"];
	query.where = "OBJECTID="+objId;
	queryTask.execute(query,function(result){
		if(!result || result.features.length==0)
         	return;
		var feature=result.features[0];
		var attributes=feature.attributes;
		//positPoint(feature.attributes.X,feature.attributes.Y);
		//定位
		var point,x,y;
		x=feature.attributes.X;
		y=feature.attributes.Y;
		if(x && y && mapDW.spatialReference){
			point = new esri.geometry.Point(x,y,mapDW.spatialReference);
			//var simpleMarkerSymbol = new esri.symbol.SimpleMarkerSymbol();
			var symbol1 = new esri.symbol.PictureMarkerSymbol("../../img/old_map_point_jing.png", 21, 28);
			symbol1.setOffset(0, 14);
	        var graphic = new esri.Graphic(point, symbol1);
	        mapDW.graphics.clear();
	        mapDW.setZoom(10);
	        mapDW.centerAt(graphic.geometry);
	        mapDW.graphics.add(graphic);
	        //centerAtGeometrys(graphic.geometry);
		}
		isExit(attributes.REPORT_TYPE,attributes.OBJECTID);
        if(flag){
       	 var htmls='<div class="tab-content" id="jbjxx" style="width:90%;height:100%;margin:auto" >'+
       	 '<form id="jbj" class="form-horizontal" >'+
       	 '<div class="form-group">'+
       	 '<label class="col-sm-12 control-label" style="font-size:15px;font-weight:300">'+attributes.LAYER_NAME+'('+attributes.OBJECTID+')'+'</label>'+
       	 '</div><div class="form-group"><table style="width:100%;"><tr style="width:100%;">'+
       	 '<td><label class="col-sm-6" >'+formatStr(attributes.ATTR_TWO)+' | '+formatStr(attributes.ATTR_ONE)+'</td></label>'+
       	 '<td><label>井盖材质:'+formatStr(attributes.ATTR_THREE)+'</label></td>'+
       	 '</tr></table></div><div class="form-group">'+
       	 '<label class="col-sm-12 control-label" >权属单位:'+formatStr(attributes.ATTR_FOUR)+'</label>'+
       	 '</div><div class="form-group">'+
       	 '<label class="col-sm-12 control-label" >设施位置:'+formatStr(attributes.ADDR)+'</label>'+
       	 '</div><div class="form-group">'+
       	 '<label class="col-sm-12 control-label" >已挂牌编码:'+formatStr(attributes.ATTR_FIVE)+'</label>'+
       	 '</div><div class="form-group">'+
       	 '<div class="col-sm-12" style="border: 1px solid #b5bcc7;border-radius:5px;left:15px;">'+
       	 '<p>接驳井照片</p><hr style="height:1px;border:none;border-top:1px dashed #555555;" />'+
       	 '<ul id="img-view" style="list-style: none;"></ul>'+
       	 '</div>'+
       	 '</div></form></div>';
       	 layer.open({
	  			  type: 1,
	  			  shade: false,
	  			  area: ['450px', '250px'],
	  			  title: "接驳井信息", //标题
	  			  btn:['确定'],
	  			  content: htmls,
	  			  btn1: function(index,layero){
	  				  parent.$("#x").val(x);
	  				  parent.$("#y").val(y);
	  				  parent.$("#wellId").val(attributes.OBJECTID);
	  				  parent.$("#wellIdName").val(attributes.LAYER_NAME+'('+attributes.OBJECTID+')');
	  				  dwPanelClose();
	  			  }
       	 });
       	 $.ajax({
    			type: 'post',
    			async: false,
    			url: '/agsupport_swj/psh-menpai!getImgsByObjId.action',
    			data: {objectId:attributes.OBJECTID},
    			dataType:'json',
    			success: function(data){
					var total=0,imgHtml='',img_view='';
					if(data.code==200 && data.rows && data.rows.length>0){
						for(var i in data.rows){
							var rowData=data.rows[i];
							var timeText,imgUrl,thumPath;
							if(rowData.attTime)
								timeText = new Date(rowData.attTime).pattern("yyyy-MM-dd HH:mm:ss");
							if(rowData.mime.indexOf('image')!=-1 || rowData.mime.indexOf('png')!=-1){
								imgUrl = rowData.attPath;
								thumPath = rowData.thumPath;
							}
							if(timeText && imgUrl && thumPath){
								img_view+='<li class="img-view" style="width:88px;">'+""+'<img data-original='+imgUrl+'"' +
										' src="'+thumPath+'" alt="图片'+(timeText)+'" width=85 height=95></li>';
								total++;
							}
						}//style="width:88px;
						if(imgHtml != ''){
							//imgHtml+='</div>';
						}
					}else{
						//imgHtml+='<label class="col-sm-3 control-label">暂无照片</label>';
						img_view+='暂无照片';
					}
					$("#img-view").append(img_view);
					//执行父页面图片预览初始化
					$(".img-view").click(function(){
						if(parent.parent.parent.parent.initViewer)
							parent.parent.parent.parent.initViewer($("#img-view").parent().html(),"img-view");
						if(parent.parent.initViewer)
							parent.parent.initViewer($("#img-view").parent().html(),"img-view");
						if(parent.viewer){
							parent.viewer.show($(this).index());
						}else if(parent.parent.parent.parent.viewer){
							parent.parent.parent.parent.viewer.show($(this).index());
						}else{
							layer.msg("未检测到图片插件!",{icon: 2});
						}
					});
    			}
       	 });
        }
	});
}
//根据sGuid定位
function positionSGuid(sGuid){
	var query = new esri.tasks.Query();
	var queryTask= new esri.tasks.QueryTask(window.parent.parent.parent.parent.awater.url.url_mp+"/0");
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
		if(x && y && mapDW.spatialReference){
			point = new esri.geometry.Point(x,y,mapDW.spatialReference);
			//var simpleMarkerSymbol = new esri.symbol.SimpleMarkerSymbol();
			var symbol1 = new esri.symbol.PictureMarkerSymbol("../../img/ic_add_facility_door.png", 21, 28);
			symbol1.setOffset(0, 14);
	        var graphic = new esri.Graphic(point, symbol1);
	        mapDW.graphics.clear();
	        mapDW.setZoom(10);
	        mapDW.centerAt(graphic.geometry);
	        mapDW.graphics.add(graphic);
	        //centerAtGeometrys(graphic.geometry);
		}
	});
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
	parent.$("#X").val(x);
	parent.$("#Y").val(y);
	setLocation(x, y);
	// 关闭
	// setTimeout(dwPanelClose(),3000);
}
// 定位  结束  	
//获取地理位置的函数
function setLocation(x,y){
	var geoc = new BMap.Geocoder();
　　　var pt = new BMap.Point(x,y);//实例化这两个点
　　　geoc.getLocation(pt, function (rs) {
　　　　　　var addComp = rs.addressComponents;
　　　　　　var wtdd=addComp.province  + addComp.city + addComp.district + addComp.street +  addComp.streetNumber;
		 //赋值
		parent.$("#szwz").val(wtdd);
		parent.$("#jdmc").val(addComp.street); 　　
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
	    maxZoom:11
    });	
	
	// 底图、影像图、水利设施
/*    var tdtvecLayer = new tdt.TDTLayer("vec",{visible:true,id:'vec'}); 
    mapDW.addLayer(tdtvecLayer);
    var tdtcvaLayer = new tdt.TDTLayer("cva",{visible:true,id:'DiTu'});
    mapDW.addLayer(tdtcvaLayer);*/
	mapDW.addLayer(createYgDitu());
	//mapDW.addLayer(createDitu());
	//mapDW.addLayer(createGW());
	mapDW.addLayer(createMp());
	//mapDW.addLayer(createSjsb());
	mapDW.addLayer(createJbj());
	mapDW.addLayer(createJbjlx());
	if(wellId && wellId!=""){
		positionObjId(wellId)
	}else{
		positionSGuid(SGuid);
	}
	
}
//地图初始化  结束

//管网
function createGW(){
	var url_=window.parent.parent.parent.parent.awater.url.url_h;
    var layer = new esri.layers.ArcGISDynamicMapServiceLayer(url_,{id:"gw_b2"});
    return layer;
}
//遥感底图
function createYgDitu(){
	var url_=window.parent.parent.parent.parent.awater.url.url_ditu;
	var layer = new esri.layers.ArcGISTiledMapServiceLayer(url_[0],{id:url_[1]});
	return layer;
}
//底图
function createDitu(){
	var url_=window.parent.parent.parent.parent.awater.url.url_vec;
	 var layer = new esri.layers.ArcGISTiledMapServiceLayer(url_[0],{id:url_[1]});
	 return layer;
}
//门牌
function createMp(){
	var url_=window.parent.parent.parent.parent.awater.url.url_mp;
    var layer = new esri.layers.ArcGISDynamicMapServiceLayer(url_,{id:"mp"});
    return layer;
}
//数据上报
function createSjsb(){
	var url_=window.parent.parent.parent.parent.awater.url.url_report[0];
    var layer = new esri.layers.ArcGISDynamicMapServiceLayer(url_,{id:"sjsb"});
    return layer;
}
//接驳井
function createJbj(){
	var url_=window.parent.parent.parent.parent.awater.url.url_jbj;
    var layer = new esri.layers.ArcGISDynamicMapServiceLayer(url_,{id:"jbj"});
    return layer;
}
//接驳井连线
function createJbjlx(){
	var url_=window.parent.parent.parent.parent.awater.url.url_jbjlx;
    var layer = new esri.layers.ArcGISDynamicMapServiceLayer(url_,{id:"jbjlx"});
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