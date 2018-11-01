<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@page import="com.augurit.gzps.fljk.FljkUtil"%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
  	<%@ include file="/platform/style.jsp"%>
  	<title>应急调度专题图</title>
   <script>
    var baseUrl="<%=request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/"%>";
    </script>
    	<script type="text/javascript">
			djConfig = {
				parseOnLoad: true,
				modulePaths:{'AG.MicMap':baseUrl+'/2DMap/com/augurit'},
				bindEncoding :'UTF-8',
				usePlainJson: true
			};
		</script>
		<link rel="stylesheet" type="text/css" href="<%=path %>/resources/css/css/blue/main.css">
	 <script type='text/javascript' src='<%=path%>/2DMap/com/augurit/resources/dojo/dojo/dojo.js'></script>
    <script type="text/javascript" src="<%=path%>/2DMap/com/augurit/gis/AG.MicMap.js"></script>
    <script type="text/javascript" src="<%=path%>/2DMap/com/augurit/gis/AG.MicMap.Control.js"></script>
    <script type="text/javascript" src="<%=path%>/2DMap/com/augurit/gis/MapInIt.js"></script>
    <script type="text/javascript" src="<%=path%>/2DMap/com/augurit/gis/Toolbar.js"></script>
    <script src="<%=path %>/agcom/mapExtend.js" type="text/javascript"></script>
    <script src='' id="extendMapJs"></script>
     <script type="text/javascript">
        	// dhtmlx.skin = "dhx_skyblue";
			dojo.require("dijit._Widget");
			dojo.require("dijit._Templated");
			dojo.require("dijit._Container");
			dojo.require("dojo.fx");
			dojo.require("AG.MicMap.gis.MapInIt");
			dojo.require("dojo.parser");
			//加载Slider的脚本对象
			dojo.require("dijit.dijit");
			dojo.require("dijit.form.HorizontalSlider");
			dojo.require("dijit.form.VerticalSlider");
			dojo.require("dijit.form.HorizontalRule");
			dojo.require("dijit.form.VerticalRule");
			dojo.require("dijit.form.HorizontalRuleLabels");
			dojo.require("dijit.form.VerticalRuleLabels");
        	//真实WEB地址
			//获取运维子系统地址。在config.properties配置文件里面配置
			var baseRestUrl = '<%=path%>';
			 
			var layerQueryPrecision = 5;
			var filtrateNumIndex = 5;
			var alwaysRefurbishLayer = false;//矢量图层移动时,是否每次都刷新所有数据
			//设置代理(用于跨域数据读取)
	        AG.MicMap.ProxyHost = baseUrl + "/proxy.jsp?";
        </script>
    <style>
    	
    </style>
    <script>
    var GisObject;
	$(function(){
		AG.MicMap.Request.GET({
		    url: ctx + "/rest/system/getDefaultProjectInfo?d="+new Date().getTime(),
		    success: function(r){
		    //加载地图开始
		    try{
		        var data = eval('(' + r.responseText + ')');
		        GisObject = new AG.MicMap.gis.MapInIt("mapDiv");
		        //解析图层
		        GisObject.setMapOptions({
		            extent : data.project.param.extent,
		            scales : data.project.param.scales,
		            reference : data.project.param.reference
		        });
			    GisObject.addLayers(data.layers);
			    GisObject.setInitCenter(data.project.param.center.split(',')[0],data.project.param.center.split(',')[1],data.project.param.zoom);
			    GisObject.initBase(data.project.param.layers);
			    GisObject.addZoomBar();//添加缩放、比例尺显示导航条
           	 	GisObject.addOMap();//添加鹰眼
           		GisObject.addScalebar();//添加比例尺条
           		GisObject.addAreaSearch(true,false,false);//添加导航条
           		GisObject.addCoordinate();//状态栏显示坐标信息
           		window.setTimeout(function(){	
					addUserLayer();
					addCarLayer();
					addJSDLayer();
					addZTT();//添加积水点专题图
           		},500);
           		
           		}catch(e){}
		    	//加载地图结束
		    	window.setTimeout(function(){	window.parent.loadok();},1000);
			}
		});
	})
	
	var secondScheduleName,secondScheduleX,secondScheduleY;
	function secondSchedule(name,x,y){
		secondScheduleName=name;
		secondScheduleX=x;
		secondScheduleY=y;
		GisObject.map.events.on({
		    'click' : mapClickHandler
		    });
	}
	 
	function addZTT(){
		var ZTTUrl=baseRestUrl+"/gzps/yjdd/ZTT.jsp";
		var ZTTWidht=170;
		var ZTTHeight=80;
		var mapWidth=(parent.$("#mapFrame").width()).toString().replace("px","");
		var mapHeight=(parent.$("#mapFrame").height()).toString().replace("px","");
		var resultX=mapWidth-ZTTWidht;
		var resultY=mapHeight-ZTTHeight;
		if(resultX & resultY){	
			popupZTT("内涝分布专题图",ZTTUrl,ZTTWidht,ZTTHeight,resultY-40,resultX-35);
		}
		else{
			popupZTT("内涝分布专题图",ZTTUrl,ZTTWidht,ZTTHeight,22,22);
		}
	}
	
	function mapClickHandler(evt){
		GisObject.map.events.un({
		    'click' : mapClickHandler});
// 		GisObject.layerdraw.drawPolyline({
// 			strokeOpacity: 1,
// 			strokeColor: "#e6111b",
// 			strokeDashstyle: "longdashdotdot",
// 			strokeEndarrow : 'block'
// 		},function(feature){alert("完成");});
		drawSchedulePath();
// 		var style = {
// 				strokeWeight: 3,
// 				strokeOpacity: 1,
// 				strokeColor: "#e6111b",
// 				strokeDashstyle: "solid",
// 				strokeEndarrow:"block"
// 			}
// 			var points = [
// 				[secondScheduleX,secondScheduleY],[GisObject.toolbar.getLonLatFromViewPortPx(evt.xy.x,evt.xy.y)[0],GisObject.toolbar.getLonLatFromViewPortPx(evt.xy.x,evt.xy.y)[1]]
// 			]
// 			GisObject.layerdraw.addPolyline(points,null,style);
// 			alert("已向用户　"+secondScheduleName+"　发送调度短信");
	}
	
	var style = {
			strokeWeight: 3,
			strokeOpacity: 1,
			strokeColor: "#e6111b",
			strokeDashstyle: "solid",
			strokeEndarrow:"block"
		}
	
	var path="118.303139,32.299694,118.30231546012,32.29866403174,118.29931138602,32.296861587282,118.29793809501,32.299350677248,118.29699395743,32.301324783083,118.29665063468,32.302440582033,118.29682229606,32.303899703737,118.29716561881,32.304929671999,118.29733728019,32.305787978883,118.29707978812,32.306732116457,118.29682229606,32.307418761964,118.29639314261,32.308105407472,118.29579232779,32.308877883669,118.29527734366,32.309564529176,118.29484819022,32.310079513307,118.29398988334,32.310422836061,118.29330323783,32.310766158815,118.29295991508,32.311538635011,118.29304574576,32.312568603273,118.29313157645,32.313426910158,118.29261659232,32.314199386354,118.29227326957,32.315143523927,118.29218743888,32.316173492189,118.2927882537,32.317289291139,118.29338906852,32.318576751466,118.29373239127,32.319435058351,118.2942473754,32.320465026613,118.29459069816,32.321409164186,118.29476235953,32.322439132448,118.29373239127,32.323383270021,118.29270242301,32.324069915529,118.29227326957,32.325271545168";
	
	function drawSchedulePath(){
		var pathLayer=new AG.MicMap.Layer.Vector("path"); 
		GisObject.map.addLayer(pathLayer);
		var points=path.split(",");
		var pointArr=[];
		for(var i=0;i<points.length;i=i+2){
			pointArr.push([points[i],points[i+1]]);
		}
		var geometry = new AG.MicMap.Geometry.PolyLine(pointArr);
		var feature = new AG.MicMap.Feature(geometry,null,style);
		pathLayer.addFeatures(feature);
		alert("已向用户　"+secondScheduleName+"　发送调度短信");
	}
	
	var JSDDate=[
    {"name":"东门养护所","code":"jsd_007","type":"JSD","y":"32.315102424","x":"118.311785092","url":"jishuidian-blue.png"},
    {"name":"来安路","code":"jsd_006","type":"JSD","y":"32.305736239","x":"118.323092465","url":"jishuidian-blue.png"},
    {"name":"凤凰路建行门口","code":"jsd_009","type":"JSD","y":"32.300377981","x":"118.313527705","url":"jishuidian-black.png"},
    {"name":"遵阳立交桥底","code":"jsd_008","type":"JSD","y":"32.320773076","x":"118.313297463","url":"jishuidian-blue.png"},
    {"name":"华力包装厂门口","code":"jsd_010","type":"JSD","y":"32.268707009","x":"118.330736309","url":"jishuidian-blue.png"},
    {"name":"凤凰三村","code":"jsd_003","type":"JSD","y":"32.303463389","x":"118.321387058","url":"jishuidian-blue.png"},
    {"name":"凤凰四村","code":"jsd_004","type":"JSD","y":"32.302138378","x":"118.321322686","url":"jishuidian-yellow.png"},
    {"name":"三环门口","code":"jsd_005","type":"JSD","y":"32.302647998","x":"118.321403152","url":"jishuidian-yellow.png"},
    {"name":"城西干渠交口","code":"jsd_011","type":"JSD","y":"32.273410249","x":"118.332917622","url":"jishuidian-yellow.png"},
    {"name":"东坡路","code":"jsd_012","type":"JSD","y":"32.250802144","x":"118.316085222","url":"jishuidian-black.png"},
    {"name":"一校两团对面","code":"jsd_013","type":"JSD","y":"32.308024536","x":"118.340814639","url":"jishuidian-black.png"}
	]; 
	
	var jsdLayer;
	function addJSDLayer(){
		jsdLayer = new AG.MicMap.Layer.Vector("jsd");
		jsdLayer.events.on({
		    'featuremousedown':function(feature){
				popupInfo(feature.attributes.name,"<%=path%>/gzps/yjdd/popup/jishuidian.jsp",900,525);
		    }
		})
		GisObject.map.addLayer(jsdLayer);
		for(var i=0;i<JSDDate.length;i++){
			var val=JSDDate[i];
	 		var geometry = new AG.MicMap.Geometry.Point(val.x,val.y);
	 		var style = {
	 		    url : val.url,
	 		    width : 17,
	 		    height : 19
	 		}
	 		var feature = new AG.MicMap.Feature(geometry,val,style);
	 		jsdLayer.addFeatures(feature);
	 		var tipDiv = {};
	 		tipDiv.id = "jsd_"+val.code;
	 		tipDiv.offset ={x:10,y:0};
	 		tipDiv.x = val.x;
	 		tipDiv.y = val.y;
	 		tipDiv.context =val.name;
	 		GisObject.mapcontrol.addInfoTip(tipDiv);
		}
		parent.$("#la_jsd_num").html("("+JSDDate.length+")");
	}
	
	function popupZTT(title,url,width,height,top,left){
		GisObject.mapcontrol.showDialogWindow({
			title : title,
			url : url,
			width : width,
			height : height,
			top:top,
			left:left,
			isDefault : false
		});
	}
	
	function popupInfo(title,url,width,height){
		GisObject.mapcontrol.showDialogWindow({
			title : title,
			url : url,
			width : width,
			height : height,
			top:22,
			left:22,
			isDefault : false
		});
	}
	
	function featureDownHandler(o){
		var feature=o.feature;
			var geometry = feature.geometry;
			var param = {
			    x : geometry.x,
			    y : geometry.y,
			    title :feature.attributes.username,
			    context : '<iframe width="230" height="120" src="'+ctx+'/gzps/yjdd/tip.jsp?x='+geometry.x+'&y='+geometry.y+'&id='+feature.attributes.code+'&type=user" frameborder="0"></iframe>',
			    allShow : false
			}
			getGisObject().toolbar.setCenter(geometry.x,geometry.y);
			var infowindow = getGisObject().mapcontrol.showInfowindow(param);
	}
	
	var userLayer;
	var userData=[
	 {"username":"徐如春","code":"1173","address":"琅琊区琅琊西路81附近","longitude":"118.308","latitude":"32.285"},
	 {"username":"郑凯","code":"1122","address":"琅琊区丰乐路188号附近","longitude":"118.337","latitude":"32.286"},
	 {"username":"吴正","code":"1126","address":"琅琊区天长西路4号附近","longitude":"118.304257","latitude":"32.304478"},
	 {"username":"曹欢","code":"1127","address":"琅琊区琅琊西路81附近","longitude":"118.303139","latitude":"32.299694"}];
	
	function addUserLayer(){
		userLayer = new AG.MicMap.Layer.Vector("user");
		userLayer.events.on({
		    'featuremousedown':featureDownHandler
		})
		GisObject.map.addLayer(userLayer);
		for(var i=0;i<userData.length;i++){
			var val=userData[i];
	 		var geometry = new AG.MicMap.Geometry.Point(val.longitude,val.latitude);
	 		var style = {
	 		    url : "user_suit.gif",
	 		    width : 17,
	 		    height : 19
	 		}
	 		var feature = new AG.MicMap.Feature(geometry,val,style);
	 		feature.id=val.code;
	 		userLayer.addFeatures(feature);
	 		var tipDiv = {};
	 		tipDiv.id = "user_"+val.code;
	 		tipDiv.offset ={x:10,y:0};
	 		tipDiv.x = val.longitude;
	 		tipDiv.y = val.latitude;
	 		tipDiv.context ="<div style='color:green'>"+val.username+"</div>";
	 		GisObject.mapcontrol.addInfoTip(tipDiv);
		}
		parent.$("#la_user_num").html("("+userData.length+")");
	}
	
	var carLayer;
	var carData=[
	{"name":"皖A50213","code":"4","type":"JSD","y":"32.296","x":"118.344"},
	{"name":"皖M2899","code":"2","type":"JSD","y":"32.294","x":"118.301"},
	{"name":"皖A02488","code":"1","type":"JSD","y":"32.330","x":"118.305"},
	{"name":"皖B00001","code":"3","type":"JSD","y":"32.36","x":"118.29"}
	]

	
	function addCarLayer(){
		carLayer = new AG.MicMap.Layer.Vector("car");
// 		wscLayer.events.on({
// 		    'featuremousedown':featureDownHandler
// 		})
		GisObject.map.addLayer(carLayer);
		for(var i=0;i<carData.length;i++){
			var val=carData[i];
	 		var geometry = new AG.MicMap.Geometry.Point(val.x,val.y);
	 		var style = {
	 		    url : "busstation.png",
	 		    width : 17,
	 		    height : 19
	 		}
	 		var feature = new AG.MicMap.Feature(geometry,val,style);
	 		feature.id=val.code;
	 		carLayer.addFeatures(feature);
	 		var tipDiv = {};
	 		tipDiv.id = "car_"+val.code;
	 		tipDiv.offset ={x:10,y:0};
	 		tipDiv.x = val.x;
	 		tipDiv.y = val.y;
	 		tipDiv.context ="<div style='color:blue'>"+val.name+"</div>";
	 		GisObject.mapcontrol.addInfoTip(tipDiv);
		}
		parent.$("#la_car_num").html("("+carData.length+")");
	}
	
	function getGisObject(){
		return GisObject;
	}
	
	function setDivValue(divid,html){
		$("#"+divid).html(html);
	}
	
	function setTip(divid,html){
	
	}
    </script>
  </head>
  <body oncontextmenu="return false" style="margin:0px;overflow:hidden">
	    <div id="mapDiv"
			style="position: absolute; left: 0px; top: 0px; width: 100%; height: 100%; z-index: 10">
		</div>

  </body>
</html>