/**
 * 
 */


function creatbjlayer(){	
	//createPoint("bj","降雨量:67.4",108.36,22.86,bulidHtmlContent({name:'林  涛',tel:'13977196060'}),"/awater/nnwaterSystem/temp_icon/rainStorm-red.png");
	//createPoint("bj","降雨量:127",108.27,22.78,bulidHtmlContent({name:'李秋果',tel:'13768118236'}),"/awater/nnwaterSystem/temp_icon/rainStorm-red.png");
	//createPoint("bj","降雨量:42.2",108.34,22.74,bulidHtmlContent({name:'魏  辉',tel:'13877195373'}),"/awater/nnwaterSystem/temp_icon/rainStorm-yellow.png");
	//createPoint("bj","降雨量:16.8",108.31,22.84,bulidHtmlContent({name:'宁世朝',tel:'13037785769'}),"/awater/nnwaterSystem/temp_icon/rainStorm-red.png");
}

/**
 * 新增点
 */
function createPoint(featureLayreId,title,x,y,content,iconUrl,iconW,iconH){
	require([
	         "esri/geometry/Point",
	         "esri/layers/FeatureLayer",
	         "esri/graphic",
	         "esri/dijit/InfoWindowLite",
	         "esri/InfoTemplate",
	         "esri/dijit/PopupTemplate",
	         "esri/symbols/TextSymbol",
	         "esri/renderers/SimpleRenderer",
	         "esri/layers/LabelClass",
	         "dojo/_base/connect",
	         "esri/Color",
	         "esri/symbols/Font"
	       ], function(Point,
	    		   FeatureLayer,
	    		   Graphic,
	    		   InfoWindowLite,
	    	       InfoTemplate,
	    	       PopupTemplate,
	    	       TextSymbol,
	    	       SimpleRenderer,
	    	       LabelClass,
	    	       connect,
	    	       Color,
	    	       Font
	       	) {

				iconW=(iconW==null)?iconW=24:iconW=iconW;
				iconH=(iconH==null)?iconH=24:iconH=iconH;

		 	var featureCollection = {
		          "layerDefinition": null,
		          "featureSet": {
		            "features": [],
		            "geometryType": "esriGeometryPoint"
		          }
		        };
		        featureCollection.layerDefinition = {
		          "geometryType": "esriGeometryPoint",
		          "objectIdField": "ObjectID",
		          "drawingInfo": {
		            "renderer": {
		              "type": "simple"
		            }
		          },
		          "fields": [
		                     {
		            "name": "ObjectID",
		            "alias": "ObjectID",
		            "type": "esriFieldTypeOID"
		          }, {
		            "name": "description",
		            "alias": "Description",
		            "type": "esriFieldTypeString"
		          }, {
		            "name": "title",
		            "alias": "Title",
		            "type": "esriFieldTypeString"
		          }, {
		            "name": "mapValue",
		            "alias": "mapValue",
		            "type": "esriFieldTypeString"
		          }, {
		            "name": "content",
		            "alias": "content",
		            "type": "esriFieldTypeString"
		          }
		          ]
		        };
		  var infoTemplate  =   new InfoTemplate("${title}", "${content}")
		  connect.connect(infoTemplate, "onShow", function(evt) {});
		  var featureLayer=null;
		if(map.getLayer(featureLayreId)){
			featureLayer=map.getLayer(featureLayreId);
		}else{
			featureLayer = new FeatureLayer(featureCollection, {
		          id: featureLayreId,
		          infoTemplate:infoTemplate
		        });
		    	graphicsNNArr.push(featureLayer);
		    featureLayer.on("mouse-move", function (g) {
        		var pt = g.graphic.geometry;
		        var attr = g.graphic.attributes;
		        map.infoWindow.setTitle(attr.name);
		        map.infoWindow.setContent("地区:" + attr.title + "<br/>类型:暴雨预警<br/>内容:市气象局2016年7月2日11时04分发布暴雨红色预警信号。<br/>频道:电视，短信，121，传真，电话<br/>上报人:陈世安");
		        map.infoWindow.resize(300, 150);
		        map.infoWindow.show(pt);
		    });
			map.addLayers([featureLayer]);
			//featureLayreOnClickHandler(featureLayer);
			
			var labelSymbol = new TextSymbol(); 
			labelSymbol.setColor(new Color([255,0,0,1]));
			var font  = new Font();
			font.setSize("12pt");
			font.setWeight(Font.WEIGHT_BOLD);
			labelSymbol.setFont(font);

			//var labelRenderer = new SimpleRenderer(labelSymbol);


			var json = {"labelExpressionInfo": {"value": "{mapValue}"}};

			//create instance of LabelClass
			  var lc = new LabelClass(json);
			  lc.symbol = labelSymbol; // symbol also can be set in LabelClass' json
			  featureLayer.setLabelingInfo([ lc ]);			
		}	
		//featureLayer.setInfoTemplate(popupTemplate);
		featureLayer.setInfoTemplate(infoTemplate);
		var features = [];
 		var attr = {title:title,mapValue:title,content:content};
 		var geometry = new Point(x, y);		
 		var graphic = new Graphic(geometry);
 		graphic.setAttributes(attr);
 		features.push(graphic);
 		featureLayer.add(graphic);
 		
	});
}

/**
 * 建立html文字信息
 * @param obj
 */
function bulidHtmlContent(obj){
	var html="<table>" +
			"<tr>" +
			"<td>责任人：</td>" +
			"<td>"+obj.name+"</td>" +
			"</tr>" +
			"<tr>" +
			"<td>联系方式：</td>" +
			"<td>"+obj.tel+"</td>" +
			"</tr>" +
			"<tr>" +
			"<td><a href='#' onclick=showWindow('/awater/nnwaterSystem/city-yjdd/list.html')>打开预案</a></td>" +
			"<td></td>" +
			"</tr>" +
			"</table>";
	return html;
}

function showWindow(url){
	//iframe层
	layer.open({
	  type: 2,
	  title: '应急调度情况',
	  shadeClose: true,
	  shade: 0.5,
	  area: ['60%', '60%'],
	  content: url //iframe的url
	}); 	
}

function showAddYJWindow(id){
	layer.open({
	  type: 2,
	  title: '启动市级应急预案-设置预案',
	  shadeClose: true,
	  shade: 0,
	  offset: ['115px', '350px'],
	  area: ['900px', '400px'],
	  content: location.protocol+"//"+location.hostname+":"+location.port+'/awater/nnwaterSystem/EmergenControl/Municipal/Template/Template_Alarm_List.html?id='+id
	}); 	
}

function startYJ(id,userType){
	//市级用户点击
	if(userType==1){
		$.ajax({
			url: location.protocol+"//"+location.hostname+":"+location.port+'/agsupport/meteo-hydrolog-alarm!checkAlarmStatus.action',
			data:{"id":id},
			dataType: 'json',
			cache:false,
			success: function (data){
				if(data.status==1&&data.yaCityCount==0)
					showAddYJWindow(id);
				else
					layer.msg("本预警已启动预案或已有启动预案");
			},
			error : function() {
				layer.msg('请求失败');
			}
		});
	} else {
		//其他用户点击，提示
		layer.msg("当前用户无权限启动市级响应预案"); 
	}
}

function showDialog(cityRecordId,userType){
	if(userType==1){
		createNewtab("/awater/nnwaterSystem/EmergenControl/Municipal/Supervise/Supervise.html?id="+cityRecordId,"市级调度");	
	} else {
		$.ajax({
			type: 'get',
			url : location.protocol+'//'+location.hostname+':'+location.port+'/agsupport/ya-record-district!checkStatus.action',
			data:{"yaCityId":cityRecordId},
			dataType : 'json',  
			success : function(data) {
				if(data.statusId==0){ 
					layer.open({
						type: 2,
						title: '市级应急响应详细',
						shadeClose: false,
						shade: 0,
						maxmin: true,
						area: ['900px', '600px'],
						content: "/awater/nnwaterSystem/EmergenControl/Municipal/Record/Record_Input.html?yaCityId="+cityRecordId
					}); 
				} else {
					$.ajax({
						method : 'GET',
						url : location.protocol+"//"+location.hostname+":"+location.port+'/agsupport/ya-record-district!getNowDistrict.action',
						async : false,
						dataType : 'json',
						success : function(data) {			
	                        //showTabWindow("/awater/nnwaterSystem/EmergenControl/District/main.html?districtUnitId="+data.districtUnitId+"&id="+data.id);
						    createNewtab("/awater/nnwaterSystem/EmergenControl/District/main.html?districtUnitId="+data.districtUnitId+"&id="+data.id,"成员单位调度详情");
						},
						error : function(error) {
							alert('error');
						}
				    });		
				}
			},
			error : function() {
				layer.msg('请求失败');
			}
		});                   	
	}
}

function addJsdToList(layerIndex){
	var mapDblClickEventObject=map.on("dbl-click", function (p) {
		var x=p.mapPoint.x;
		var y=p.mapPoint.y;
		mapDblClickEventObject.remove();
		mapDblClickEventObject=null;
		if($("iframe[src*='WaterPoint_List']").length==0)
		     return;
		var frameName=$("iframe[src*='WaterPoint_List']").attr("name");
		var inputX=$("iframe[name='"+frameName+"'")[0].contentWindow.layer.getChildFrame("#xcoor",layerIndex);
		inputX.val(x.toFixed(6));
		var inputY=$("iframe[name='"+frameName+"'")[0].contentWindow.layer.getChildFrame("#ycoor",layerIndex);
		inputY.val(y.toFixed(6));
		var aTab=$(".page-tabs-content a[data-id*='WaterPoint_List']")
		aTab.addClass("active").siblings(".J_menuTab").removeClass("active");
	    var aContent = $(".J_mainContent .J_iframe[data-id*='WaterPoint_List']");
	    aContent.show().siblings(".J_iframe").hide();
	});
}

var monitorRecSymbol,monitorRecEvent;        
function getMonitorRectangle(){ 
	pipeGis.toolBar.tb.activate(esri.toolbars.Draw.RECTANGLE);  
    if(!monitorRecSymbol){ 
        monitorRecSymbol= (new esri.symbol.SimpleFillSymbol()).setOutline((new esri.symbol.SimpleLineSymbol()).setColor(new esri.Color("red")));	        
		monitorRecEvent=pipeGis.toolBar.tb.on("draw-end", function(evtObj){ 
		      if($("iframe[src*='ssjk-dim-contrast.html']").length==0){
		           pipeGis.toolBar.tb.deactivate();
		           monitorRecEvent.remove();
		           return;
		   	  }
		   	  map.graphics.clear();
		   	  var graphic = new esri.Graphic(evtObj.geometry, monitorRecSymbol);
              map.graphics.add(graphic);
	  	      var extent=evtObj.geometry.getExtent();
		      if(!extent)
		          return;
	          var frameName=$("iframe[src*='ssjk-dim-contrast.html']").attr("name");
		      $("iframe[name='"+frameName+"'")[0].contentWindow.getExtentAndAnalysis(extent);
		});
	}
}

function dutyManage(type){
   if(type==1){
      createNewtab("/awater/nnwaterSystem/EmergenControl/dutyManagement/dutyManagement.html?type=1","市级值班管理");
   }else{
      createNewtab("/awater/nnwaterSystem/EmergenControl/dutyManagement/dutyManagement.html?type=2","成员单位值班管理");
   }
}