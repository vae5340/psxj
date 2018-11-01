/**
 * 设施监控地图操作
 */
//定时器
var flickerSelectSetTimeout=null;
/**
 * 设施监控新增点
 */
function ssjkCreatePoint(combId,featureLayreId,title,x,y,content,iconUrl,combStatus,iconW,iconH,daValue){
	require([
	         "esri/geometry/Point",
	         "esri/geometry/Polyline",
	         "esri/layers/FeatureLayer",
	         "esri/graphic",
	         "esri/dijit/InfoWindowLite",
	         "esri/InfoTemplate",
	         "esri/dijit/PopupTemplate",
	         "esri/symbols/TextSymbol",
	         "esri/symbols/MarkerSymbol",
	         "esri/symbols/SimpleMarkerSymbol",
	         "esri/symbols/PictureMarkerSymbol",
	         "esri/symbols/SimpleLineSymbol", 
	         "esri/symbols/SimpleFillSymbol",
	         "esri/renderers/SimpleRenderer",
	         "esri/renderers/UniqueValueRenderer",	         
	         "esri/layers/LabelClass",
	         "dojo/_base/connect",
	         "esri/Color",
	         "esri/symbols/Font",
	         "esri/geometry/ScreenPoint",
	         "esri/dijit/Popup",
	         "dojo/dom-construct"
	       ], function(Point,
	      		   Polyline,
	    		   FeatureLayer,
	    		   Graphic,
	    		   InfoWindowLite,
	    	       InfoTemplate,
	    	       PopupTemplate,
	    	       TextSymbol,
	    	       MarkerSymbol,
	    	       SimpleMarkerSymbol,
	    	       PictureMarkerSymbol,
	    	       SimpleLineSymbol,
	    	       SimpleFillSymbol,
	    	       SimpleRenderer,
	    	       UniqueValueRenderer,
	    	       LabelClass,
	    	       connect,
	    	       Color,
	    	       Font,
	    	       ScreenPoint,
	    	       Popup,
	    	       domConstruct
	       	) {
				iconW=(iconW==null)?iconW=12:iconW=iconW;
				iconH=(iconH==null)?iconH=12:iconH=iconH;

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
			        	"type": "uniqueValue",
						"field1": "combStatus",
						"defaultSymbol": {
							"type": "esriPMS",
			            	"url": iconUrl,
			                "contentType": "image/png",
			                "width": iconW,
			                "height": iconH
						},
					    "uniqueValueInfos": dimIcon				  	            
					}
				}, "fields": [
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
		            "name": "combId",
		            "alias": "combId",
		            "type": "esriFieldTypeString"
		          }, {
		            "name": "content",
		            "alias": "content",
		            "type": "esriFieldTypeString"
		          }, {
		            "name": "combStatus",
		            "alias": "combStatus",
		            "type": "esriFieldTypeString"
		          }
		        ]
		    };
		var featureLayer=null;
		if(map.getLayer(featureLayreId)){
			featureLayer=map.getLayer(featureLayreId);
		}else{
			featureLayer = new FeatureLayer(featureCollection, {
		          id: featureLayreId,
		          //infoTemplate: popupTemplate
		          //infoTemplate:infoTemplate
		    });
		        
	        map.addLayers([featureLayer]);
            featureLayer.on("click", buildClickMenu);

            featureLayer.on("mouse-over", function (g) {
                if(outLineGraphic!=null)
                   map.graphics.remove(outLineGraphic);			          
		        var pt = g.graphic.geometry;
		        var attr = g.graphic.attributes;
                changeInfoWindowUI();
		        map.infoWindow.setTitle(attr.title);
		        map.infoWindow.setContent(attr.content);
		        //map.infoWindow.show(pt);
                var radius = map.extent.getWidth() / 135;
			    var extent = new esri.geometry.Extent({
			    	"xmin":pt.x-radius,
			    	"ymin":pt.y-radius,
			    	"xmax":pt.x+radius,
			    	"ymax":pt.y+radius,
			    	spatialReference:{wkid:2433}
			    });
			    outLineGraphic = new esri.Graphic(extent, sls);
		        map.graphics.add(outLineGraphic);
		        if(flickerSelectSetTimeout==null){
		        	flickerSelectPoint();
		        }
		        function flickerSelectPoint(){
		        	if(outLineGraphic==null){
		        		return;
		        	}
		        	if(outLineGraphic.visible){
		        		outLineGraphic.hide();
		        	}else{
		        		outLineGraphic.show();
		        	}
		        	flickerSelectSetTimeout=setTimeout(function(){
		        		flickerSelectPoint();
			        },500)
		        }
		        
		    });  

			//控制图层默认显示
		    switch (featureLayreId){
				case 'ssjk_33':
					break;
				case 'ssjk_35':
					break;
				case 'ssjk_37':
					break;
				default :
					featureLayer.hide();
			}
			graphicsNNArr.push(featureLayer);
		}
		var attr = {combId : combId,title:title,mapValue:title,content:content,combStatus:combStatus};
		var geometry = new Point(x, y);
		var graphic = new Graphic(geometry);
	 	graphic.setAttributes(attr);
	 	featureLayer.add(graphic);	
  });
}
function sourchValue(val){
	if(val){
		var bolea=false;
		for (i in graphicsNNArr){
			$(graphicsNNArr[i].graphics).each(function(index,item){
				if(val.XCOOR == item.geometry.x && val.YCOOR==item.geometry.y){
				   if(item.symbol){
				   		var yoffset = item.symbol.yoffset + -20;
				   		item.symbol.setOffset(45, yoffset);
				   }
					bolea=true;
				}else{
					bolea=false;
				}
				return;
			});
		}
		return bolea;
	}else{
		return false;
	}
}
//改变设备的实时值（水位、流量）
function changeDValue(value){
	$.ajax({
		method : 'get',
		url : '/agsupport/ps-comb!getJkDataDValue.action',
		anysc : true,
		dataType : 'json',
		success:function(data){
			if(value)
				changeAllMoitorStation(data,value);
			else
				changeAllMoitorStation(data);
		}
	});
  setTimeout("changeDValue('"+1+"')",1000*600);
}
function changeAllMoitorStation(data,value){
	require([
		"esri/geometry/Point",
      	"esri/symbols/TextSymbol",
       	"esri/symbols/Font",
	  	"esri/layers/FeatureLayer",
	  	"esri/graphic"
	], function(Point,TextSymbol,Font,FeatureLayer,Graphic) {
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
	var dataValue=data.rows;
	for(var i=0;i<dataValue.length;i++){
		var comb_id = dataValue[i].ID;
		var item_id = dataValue[i].ITEM_ID;
		var dValue = dataValue[i].D_VALUE;
		var alertValue = dataValue[i].ALERT_VALUE;
		var x=dataValue[i].XCOOR;
		var y=dataValue[i].YCOOR;
		var itemType = dataValue[i].ITEM_TYPE;
		var estType=dataValue[i].EST_TYPE;
		var ssType=ssTypes[estType];
		var featureLayreId=ssType.layerId+"_1";
		var featureLayer=null;
		if(value && map.getLayer(featureLayreId)){
			featureLayer=map.getLayer(featureLayreId);
			$(featureLayer.graphics).each(function(index,item){
				if(item.attributes){
					if(item.attributes.combId===comb_id){
						var unit="m";
						switch (ssType.layerId){
							case 'ssjk_29':
								if(itemType=='TPT')unit="℃";
								else	unit="mm";
								break;
							case 'ssjk_30':
								if(itemType=='TPT')unit="℃";
								else	unit="mm";
								break;
							case 'ssjk_31':
								if(itemType=='TPT')unit="℃";
								else	unit="mm";
								break;
							case 'ssjk_35':
								unit="m3/s";
								break;
							case 'ssjk_37':
								unit="m";
								break;
							default :
								break;
						}
						item.symbol.setText(dValue.toFixed(2)+unit);
						item.symbol.setColor(new esri.Color([102, 0, 255]));
						if(alertValue){
							if (dValue < alertValue){
								item.symbol.setColor(new esri.Color([102, 0, 255]));
							}else if (dValue < alertValue+0.1){
								item.symbol.setColor(new esri.Color([212, 70, 120]));
							}else{
								item.symbol.setColor(new esri.Color([255,0,0]));
							}
						}
					}
				}
			});
			featureLayer.redraw();
		}else{
			if(map.getLayer(featureLayreId)){
				featureLayer=map.getLayer(featureLayreId);
			}else{
				featureLayer = new FeatureLayer(featureCollection, {
			          id: featureLayreId,
			    });
			    featureLayer.setMaxScale(0);
			    featureLayer.setMinScale(20000);
			    map.addLayers([featureLayer]);
				graphicsNNArr.push(featureLayer);
			}
			//控制图层默认显示
		    switch (featureLayreId){
				case 'ssjk_33_1':
					break;
				case 'ssjk_35_1':
					break;
				case 'ssjk_37_1':
					break;
				default :
					featureLayer.hide();
			}
			
			var attr = {combId : comb_id};
		    var geometry = new Point(x,y);
		    font = new Font("19px",Font.VARIANT_NORMAL, Font.WEIGHT_BOLD,"Courier");//Font.STYLE_ITALIC,
		    font.setWeight(Font.WEIGHT_BOLD);
		    var labelSymbol = new TextSymbol().setOffset(40, 1).setFont(font);
			//根据不同类型设置单位
			var unit="m";
			switch (ssType.layerId){
				case 'ssjk_29':
					if(itemType=='TPT')unit="℃";
					else	unit="mm";
					break;
				case 'ssjk_30':
					if(itemType=='TPT')unit="℃";
					else	unit="mm";
					break;
				case 'ssjk_31':
					if(itemType=='TPT')unit="℃";
					else	unit="mm";
					break;
				case 'ssjk_35':
					labelSymbol.setOffset(55, 1)
					unit="m3/s";
					break;
				case 'ssjk_37':
					unit="m";
					break;
				default :
					break;
			}
			labelSymbol.setText(dValue.toFixed(2) + unit);
			sourchValue(dataValue[i]);  //设置不同设备的偏移量
			labelSymbol.setColor(new esri.Color([102, 0, 255]));
			//if(dValue === 0) labelSymbol.setOffset(20, -6)
			if(alertValue){
				if (dValue < alertValue){
					labelSymbol.setColor(new esri.Color([102, 0, 255]));
				}else if (dValue < alertValue+0.1){
					labelSymbol.setColor(new esri.Color([212, 70, 120]));
				}else{
					labelSymbol.setColor(new esri.Color([255,0,0]));
				}
			}
			var labelGraphic = new Graphic(geometry,labelSymbol);
			labelGraphic.setAttributes(attr);
	 		featureLayer.add(labelGraphic);
	 	}
	}
  });
}
function addAllMonitorStation(result){
		var rows=result.rows;
		//1 设施
		for(var i=0;i<rows.length;i++){
			var row=rows[i];
			var combId=row.combId;
			var combName=row.combName;
			var estType=row.estType;
			var x=row.xcoor;
			var y=row.ycoor;
			var laneWay=row.laneWay;
			(laneWay) ? laneWay=laneWay : laneWay="";
			var estDept=row.estDept;//建立单位
			(estDept) ? estDept=estDept : estDept="";
			var orgDept=row.orgDept;//维护单位
			(orgDept) ? orgDept=orgDept : orgDept="";
			var coorSys=row.coorSys;//坐标系统
			(coorSys) ? coorSys=coorSys : coorSys="";
			var eleSys=row.eleSys;//高程系统
			(eleSys) ? eleSys=eleSys : eleSys="";
			var drainSys=row.drainSys;//备注
			(drainSys) ? drainSys=drainSys : drainSys="";
	
			var devices=row.device;		
			if(estType==null){
				continue;
			}		
			var content="";
			
			if(devices){
			}else{
				content="该设施无设备";
				devices=[];
				continue;//屏蔽可以显示无设备的点
			}
			var ssType=ssTypes[estType];
			var ssTypeName=ssType.layerName;
			var featureLayreId=ssType.layerId;
			
			var combStatus="0";
			var iconUrl=ssType.iconUrl;
			var title=combName;
			
			content+="<p>设施类型："+ssTypeName+"</p>"+
			"<p>设施地址："+combName+"</p>"+
			"<p>所在道路："+laneWay+"</p>"+
			"<p>维护单位："+orgDept+"</p>"+
			"<p>坐标系统："+coorSys+"</p>"+
			"<p>高程系统："+eleSys+"</p>"+
			"<p>备注："+drainSys+"</p>";
			//content+="<table class='table'>"
			//2 设备
			for(var j=0;j<devices.length;j++){
				//content+="<tr>";
				var device= devices[j];
				var deviceId=device.deviceId;
				var deviceName=device.deviceName;
				var itemDims=device.itemDim;
				//content+="<td class='td'>"+deviceName+"</td>";
				//content+="<td class='td'>";
				// 3 监控项
				for(var k=0;k<itemDims.length;k++){
					var itemDim=itemDims[k];
					var dimId=itemDim.id;
					var itemId=itemDim.itemId;
					var itemType=itemDim.itemType;
					var itemTag=itemDim.itemTag;
					var itemName=itemDim.itemName;
					var itemTag=itemDim.itemTag;
				    var status=itemDim.status;				
					var valueId=combId+"_"+deviceId+"_"+itemId;//ID结构为“设施ID_设备ID_监控项ID”
					var itemTitle=title+"("+itemName+")";
					if(itemId!=null && itemType!=null){
	//					if(itemId=="L_16020197")
	//						content+=itemName+':<a id="'+valueId+'" href="javascript:openSPWindow(\''+dimId+'\',\''+itemId+'\',\''+itemType+'\',\''+itemTitle+"实时"+'\',\''+itemTag+'\')">实时视频</a>水位高程:4.4米，井深：4.8米<br />预警传感器距井口距离：0.5米<br />地面高程:6米<br />井底高程：3米';
	//					else 
	//						content+=itemName+':<a id="'+valueId+'" href="javascript:openJKWindow(\''+dimId+'\',\''+itemId+'\',\''+itemType+'\',\''+itemTitle+"实时"+'\',\''+itemTag+'\')">'+ '获取中'+'</a>&nbsp&nbsp<a href="javascript:openHisWindow(\''+dimId+'\',\''+itemId+'\',\''+itemType+'\',\''+itemTitle+"历史"+'\',\''+itemTag+'\')">历史</a></br>水位高程:77.3米<br />井深：4.8米<br />预警传感器距井口距离：0.5米<br />地面高程:81.8米<br />井底高程：77米';
					}else{
						content+=itemName+":无实时数据</br>";
					}
					
					if(status>0){
					   combStatus=status;
					}					
				}
				//content+="</td>";
			}
			
			map.on("zoom-end", function (e) {
	          if(outLineGraphic){   
	                var radius = map.extent.getWidth() / 135;
	                var centP=outLineGraphic.geometry.getCenter();
				    var extent = new esri.geometry.Extent({
				    	"xmin":centP.x-radius,
				    	"ymin":centP.y-radius,
				    	"xmax":centP.x+radius,
				    	"ymax":centP.y+radius,
				    	"spatialReference":{wkid:4326}
				    });
				    outLineGraphic.setGeometry(extent);
		       }
		    });
		   	combStatus=estType+","+combStatus;
			if(estType==13&&row.combStatus==2)
				combStatus=estType+",2";
			ssjkCreatePoint(combId,featureLayreId,title,x,y,content,iconUrl,combStatus);
		}
		changeDValue();
}
function featureLayreOnClickHandler(featureLayer){
	require(["dojo/_base/connect"],function(connect) {        
		connect.connect(featureLayer, "onClick", function(evt) {
			var attributes=evt.graphic.attributes;
       	 	var combId=attributes.combId;
       	 	getMonitorStationByCombId(combId);
		});
	});
}

/**
 * 打开监控项
 * @param itemId
 * @param itemType
 */
function openJKWindow(dimId,itemId,itemType,title,itemTag){
	
	var page=dimTypes[itemTag].page;
	//iframe层
	layer.open({
	  type: 2,
	  title: title,
	  shadeClose: true,
      shade: false,
	  area: ['780px', '430px'],
	  content: page+"?dimID="+dimId+"&itemID="+itemId //iframe的url
	}); 
}
/**
 * 打开视频监控项
 * @param itemId
 * @param itemType
 */
function openSPWindow(dimId,itemId,itemType,title,itemTag){
	
	var page=dimTypes[itemTag].page;
	//iframe层
	layer.open({
	  type: 2,
	  title: title,
	  shadeClose: true,
      shade: false,
	  area: ['620px', '520px'],
	  content: '/awater/waterSystem/ssjk/ssjk-dim-sx.html' //iframe的url
	}); 
}
/**
 * 打开监控项
 * @param itemId
 * @param itemType
 */
function openHisWindow(dimId,itemId,itemType,title,itemTag){ 
	var page=dimTypes[itemTag].hisPage;
	//iframe层
	layer.open({
	  type: 2,
	  title: title,
	  shadeClose: true,
      shade: false,
	  area: ['600px', '400px'],
	  content: page+"?dimID="+dimId+"&itemID="+itemId //iframe的url
	}); 
}

 function changeInfoWindowUI(h){      
      if(h){
	    if($(".titlePane").is(":visible")){
          $(".titlePane").hide();
          $(".esriPopupWrapper").css("width","180px");
          $(".sizer").css("width","180px");  
          S(".esriPopup.pointer.top").css("background","#F7F7F7");
       }
      }else{
          if(!$(".titlePane").is(":visible")){
		   $(".titlePane").show();
          $(".esriPopupWrapper").css("width","260px");
          $(".sizer").css("width","260px");	 
          S(".esriPopup.pointer.top").css("background","#337ab7");
       }        
      }
 }
   

/**
 * 添加默认监测数据
 */
function addMonitorStationLable(results){
//	//1 设施
//	var stations=results.rows;
//	for(var i=0;i<stations.length;i++){
//		var station=stations[i];
//		var combId=station.combId;
//		//2 设备
//		var devices=station.device;		
//		for(var j=0;j<devices.length;j++){
//			var device= devices[j];
//			var deviceId=device.deviceId;
//			// 3监控项
//			var itemDims=device.itemDimData;
//			for(var k=0;k<itemDims.length;k++){
//				var itemDim=itemDims[k];
//				var itemDimId=itemDim.itemId;
//				var d_value1=itemDim.d_value1;
//				//var valueId=combId+"_"+deviceId+"_"+itemDimId;//对应弹出框页面元素的ID，结构为“设施ID_设备ID_监控项ID”
//				//changeDimItemValue(valueId,d_value1);
//				//changeMonitorStationLable(combId,valueLable);
//			}		
//		}
//	}
}

/**
 * 改变设施点lable
 */
function changeMonitorStationLable(results,combId,deviceId,itemDimId,valueLable){
	//1 设施
	var stations=results.rows;
	for(var i=0;i<stations.length;i++){
		var station=stations[i];
		var combId=station.combId;
		//2 设备
		var devices=station.device;		
		for(var j=0;j<devices.length;j++){
			var device= devices[j];
			var deviceId=device.deviceId;
			// 3监控项
			var itemDims=device.itemDimData;
			for(var k=0;k<itemDims.length;k++){
				var itemDim=itemDims[k];
				var itemDimId=itemDim.itemDimId;
				var d_value1=itemDim.d_value;
				var valueId=combId+"_"+deviceId+"_"+itemDimId;//对应弹出框页面元素的ID，结构为“设施ID_设备ID_监控项ID”
				//changeDimItemValue(valueId,d_value1);
			}		
		}
	}
}

/**
 * 显示弹出框
 * @param g
 */
function showSsjkMain(g){
	map.centerAt(g.mapPoint);
    layer.open({
		type: 2,
		title: g.graphic.attributes.title,
		shadeClose: true,
		shade: 0,
		//offset: 'rb',
		area: ['940px', '420px'],
		content: [getHtmlProjectBasePath()+"/waterSystem/ssjk/ssjk-dim-main-test.html?combId="+g.graphic.attributes.combId,"#mapDiv"] //iframe的url
	});
}

function buildClickMenu(g){
	map.centerAt(g.mapPoint);
	var radius = map.extent.getWidth() / 100;
	var centP=outLineGraphic.geometry.getCenter();
	var treeObj = $.fn.zTree.getZTreeObj("treeLegend");
	var nodes = treeObj.getCheckedNodes(true);
	var layerIds="";
	$(nodes).each(function (index, obj) {
		if(obj.layerName){
			if(layerIds=="")
				layerIds=obj.layerName.split("_")[1];
			else
				layerIds+=","+obj.layerName.split("_")[1];
		}
	});
	$.ajax({
		url: '/agsupport/ps-comb!buildMapClickMenu.action',
		data:{x:centP.x,y:centP.y,radius:radius,layerIds:layerIds},
		dataType: 'json',
		cache:false,
		success: function (data){
			$("#clickMenu").remove();
			var liHtml="";
			$(data.total).each(function (index, obj) {
				liHtml+="<li combId="+obj.ID+" combName="+obj.COMB_NAME+" ><a>"+obj.COMB_NAME+" <br /><span style='color:red;'>"+ssTypes[obj.EST_TYPE].layerName+"<span></a></li>";
			});
			if(data.count>1){
				var html='<div id="clickMenu" x="'+centP.x+'" y="'+centP.y+'" style="position:absolute;top:'+($("#mapDiv").height()/2)+'px;left:'+($("#mapDiv").width()/2)+'px;z-index:31;" class="tool-box">'+
							'<ul class="mapMenu">'+
								liHtml+
							'</ul>'+
						'</div>';
				
				$("#mapDiv").append(html);
				$(".mapMenu li").click(function(){
					onClickMenu($(this).attr("combId"),$(this).attr("combName"));
					$("#clickMenu").remove();
				});
			} else if(data.count==1){
				showSsjkMain(g);
			}
		},
		error : function() {
			layer.msg("获取设施设备失败");
		}
	});
}

function onClickMenu(combId,title){
	layer.open({
		type: 2,
		title: title,
		shadeClose: true,
		shade: 0,
		area: ['940px', '420px'],
		content: [getHtmlProjectBasePath()+"/waterSystem/ssjk/ssjk-dim-main-test.html?combId="+combId,"#mapDiv"]
	});
}

//地图生成graphicLayerList-根据EstType

function addMonitorStationByEstType(result){
	var rows=result.rows;
	//1 设施
	for(var i=0;i<rows.length;i++){
		var row=rows[i];
		var combId=row.combId;
		var combName=row.combName;
		var estType=row.estType;
		var x=row.xcoor;
		var y=row.ycoor;
		var laneWay=row.laneWay;
		(laneWay) ? laneWay=laneWay : laneWay="";
		var estDept=row.estDept;//建立单位
		(estDept) ? estDept=estDept : estDept="";
		var orgDept=row.orgDept;//维护单位
		(orgDept) ? orgDept=orgDept : orgDept="";
		var coorSys=row.coorSys;//坐标系统
		(coorSys) ? coorSys=coorSys : coorSys="";
		var eleSys=row.eleSys;//高程系统
		(eleSys) ? eleSys=eleSys : eleSys="";
		var drainSys=row.drainSys;//备注
		(drainSys) ? drainSys=drainSys : drainSys="";

		var devices=row.device;		
		if(estType==null){
			continue;
		}		
		var content="";
		
		if(devices){
		}else{
			content="该设施无设备";
			devices=[];
			continue;//屏蔽可以显示无设备的点
		}
		var ssType=ssTypes[estType];
		var ssTypeName=ssType.layerName;
		var featureLayreId=ssType.layerId;
		
		var combStatus="0";
		var iconUrl=ssType.iconUrl;
		var title=combName;
		
		content+="<p>设施类型："+ssTypeName+"</p>"+
		"<p>设施地址："+combName+"</p>"+
		"<p>所在道路："+laneWay+"</p>"+
		"<p>维护单位："+orgDept+"</p>"+
		"<p>坐标系统："+coorSys+"</p>"+
		"<p>高程系统："+eleSys+"</p>"+
		"<p>备注："+drainSys+"</p>";
		//2 设备
		for(var j=0;j<devices.length;j++){
			var device= devices[j];
			var deviceId=device.deviceId;
			var deviceName=device.deviceName;
			var itemDims=device.itemDim;
			// 3 监控项
			for(var k=0;k<itemDims.length;k++){
				var itemDim=itemDims[k];
				var dimId=itemDim.id;
				var itemId=itemDim.itemId;
				var itemType=itemDim.itemType;
				var itemTag=itemDim.itemTag;
				var itemName=itemDim.itemName;
				var itemTag=itemDim.itemTag;
			    var status=itemDim.status;				
				var valueId=combId+"_"+deviceId+"_"+itemId;//ID结构为“设施ID_设备ID_监控项ID”
				var itemTitle=title+"("+itemName+")";
				if(itemId!=null && itemType!=null){
				
				}else{
					content+=itemName+":无实时数据</br>";
				}
				
				if(status>0){
				   combStatus=status;
				}					
			}
		}
		
		map.on("zoom-end", function (e) {
          if(outLineGraphic){   
                var radius = map.extent.getWidth() / 135;
                var centP=outLineGraphic.geometry.getCenter();
			    var extent = new esri.geometry.Extent({
			    	"xmin":centP.x-radius,
			    	"ymin":centP.y-radius,
			    	"xmax":centP.x+radius,
			    	"ymax":centP.y+radius,
			    	"spatialReference":{wkid:4326}
			    });
			    outLineGraphic.setGeometry(extent);
	       }
	    });
	   	combStatus=estType+","+combStatus;
	   	
		ssjkCreatePointNoLimite(combId,featureLayreId,title,x,y,content,iconUrl,combStatus);
	}
}

//地图生成graphicLayer-根据EstType

function ssjkCreatePointNoLimite(combId,featureLayreId,title,x,y,content,iconUrl,combStatus,iconW,iconH){
	require([
	         "esri/geometry/Point",
	         "esri/geometry/Polyline",
	         "esri/layers/FeatureLayer",
	         "esri/graphic",
	         "esri/dijit/InfoWindowLite",
	         "esri/InfoTemplate",
	         "esri/dijit/PopupTemplate",
	         "esri/symbols/TextSymbol",
	         "esri/symbols/MarkerSymbol",
	         "esri/symbols/SimpleMarkerSymbol",
	         "esri/symbols/PictureMarkerSymbol",
	         "esri/symbols/SimpleLineSymbol", 
	         "esri/symbols/SimpleFillSymbol",
	         "esri/renderers/SimpleRenderer",
	         "esri/renderers/UniqueValueRenderer",	         
	         "esri/layers/LabelClass",
	         "dojo/_base/connect",
	         "esri/Color",
	         "esri/symbols/Font",
	         "esri/geometry/ScreenPoint",
	         "esri/dijit/Popup",
	         "dojo/dom-construct"
	       ], function(Point,
	      		   Polyline,
	    		   FeatureLayer,
	    		   Graphic,
	    		   InfoWindowLite,
	    	       InfoTemplate,
	    	       PopupTemplate,
	    	       TextSymbol,
	    	       MarkerSymbol,
	    	       SimpleMarkerSymbol,
	    	       PictureMarkerSymbol,
	    	       SimpleLineSymbol,
	    	       SimpleFillSymbol,
	    	       SimpleRenderer,
	    	       UniqueValueRenderer,
	    	       LabelClass,
	    	       connect,
	    	       Color,
	    	       Font,
	    	       ScreenPoint,
	    	       Popup,
	    	       domConstruct
	       	) {
				iconW=(iconW==null)?iconW=12:iconW=iconW;
				iconH=(iconH==null)?iconH=12:iconH=iconH;

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
			        	"type": "uniqueValue",
						"field1": "combStatus",
						"defaultSymbol": {
							"type": "esriPMS",
			            	"url": iconUrl,
			                "contentType": "image/png",
			                "width": iconW,
			                "height": iconH
						},
					    "uniqueValueInfos": dimIcon				  	            
					}
				}, "fields": [
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
		            "name": "combId",
		            "alias": "combId",
		            "type": "esriFieldTypeString"
		          }, {
		            "name": "content",
		            "alias": "content",
		            "type": "esriFieldTypeString"
		          }, {
		            "name": "combStatus",
		            "alias": "combStatus",
		            "type": "esriFieldTypeString"
		          }
		        ]
		    };
		var featureLayer=null;
		if(map.getLayer(featureLayreId)){
			featureLayer=map.getLayer(featureLayreId);
		}else{
			featureLayer = new FeatureLayer(featureCollection, {id: featureLayreId});
		        
	        map.addLayers([featureLayer]);
            featureLayer.on("click", buildClickMenu);

            featureLayer.on("mouse-over", function (g) {
                if(outLineGraphic!=null)
                   map.graphics.remove(outLineGraphic);			          
		        var pt = g.graphic.geometry;
		        var attr = g.graphic.attributes;
                changeInfoWindowUI();
		        map.infoWindow.setTitle(attr.title);
		        map.infoWindow.setContent(attr.content);
                var radius = map.extent.getWidth() / 135;
			    var extent = new esri.geometry.Extent({
			    	"xmin":pt.x-radius,
			    	"ymin":pt.y-radius,
			    	"xmax":pt.x+radius,
			    	"ymax":pt.y+radius,
			    	spatialReference:{wkid:2433}
			    });
			    outLineGraphic = new esri.Graphic(extent, sls);
		        map.graphics.add(outLineGraphic);
		        if(flickerSelectSetTimeout==null){
		        	flickerSelectPoint();
		        }
		        function flickerSelectPoint(){
		        	if(outLineGraphic==null){
		        		return;
		        	}
		        	if(outLineGraphic.visible){
		        		outLineGraphic.hide();
		        	}else{
		        		outLineGraphic.show();
		        	}
		        	flickerSelectSetTimeout=setTimeout(function(){
		        		flickerSelectPoint();
			        },500)
		        }
		    });
		    graphicsNNArr.push(featureLayer);
		}
		var attr = {combId:combId,title:title,mapValue:title,content:content,combStatus:combStatus};
 		var geometry = new Point(x, y);		
 		var graphic = new Graphic(geometry);
 		graphic.setAttributes(attr);
 		featureLayer.add(graphic);	
  });
}