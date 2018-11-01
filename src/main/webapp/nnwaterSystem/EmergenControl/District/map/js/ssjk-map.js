/**
 * 设施监控地图操作
 */


/**
 * 设施监控新增点
 */
function ssjkCreatePoint(combId,featureLayreId,title,x,y,content,iconUrl,combStatus,iconW,iconH){
	require([
	         "esri/geometry/Point",
	         "esri/layers/FeatureLayer",
	         "esri/graphic",
	         "esri/dijit/InfoWindowLite",
	         "esri/InfoTemplate",
	         "esri/dijit/PopupTemplate",
	         "esri/symbols/TextSymbol",
	         "esri/symbols/MarkerSymbol",
	         "esri/renderers/SimpleRenderer",
	         "esri/symbols/SimpleMarkerSymbol",
	         "esri/symbols/PictureMarkerSymbol",
	         "esri/renderers/UniqueValueRenderer",
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
	    	       MarkerSymbol,
	    	       SimpleMarkerSymbol,
	    	       PictureMarkerSymbol,
	    	       SimpleRenderer,
	    	       UniqueValueRenderer,
	    	       LabelClass,
	    	       connect,
	    	       Color,
	    	       Font
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
					    "uniqueValueInfos": [{
					      "value": "0",
					      "symbol": {
								 "type": "esriPMS",
								 "url": iconUrl,
								 "contentType": "image/png",
								 "width": iconW,
								 "height": iconH
					        }
					    }, 
					      {"value": "1",
					      "symbol": {
						     "type": "esriPMS",
			                 "url": "/awater/waterSystem/ssjk/img/warning.png",
			                 "contentType": "image/png",
			                 "width": iconW,
			                 "height": iconH
					    }					    				
				     }]					  	            
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
			//featureLayer.on("click", showSsjkMain);
			featureLayer.on("click", buildClickMenu);
            featureLayer.on("mouse-over", function (g) {
                if(outLineGraphic!=null)
                   map.graphics.remove(outLineGraphic);			
		        var pt = g.graphic.geometry;
		        var attr = g.graphic.attributes;
                changeInfoWindowUI();
		        map.infoWindow.setTitle(attr.title);
		        map.infoWindow.setContent(attr.content);
		        map.infoWindow.show(pt);
		        var radius = map.extent.getWidth() / 100;
			    var extent = new esri.geometry.Extent({"xmin":pt.x-radius,"ymin":pt.y-radius,"xmax":pt.x+radius,"ymax":pt.y+radius});
		        outLineGraphic = new esri.Graphic(extent, sls);
		        map.graphics.add(outLineGraphic);      
		    });
		    
			featureLayer.on("mouse-out", function (g) {
		        map.infoWindow.hide();
		    });   

			//控制图层默认显示
		    switch (featureLayreId){				
				case 'ssjk_6':
				    featureLayer.on("click", showSsjkMain);    				    				    				  
					break;
				case 'ssjk_13':				
				    featureLayer.on("click", showJsdDispatch);    				    
					break;
				case 'ssjk_21':
					featureLayer.on("click", showSsjkMain);    				    				    				
					break;
				default :
					 featureLayer.hide();
			}
			graphicsNNArr.push(featureLayer);			
	   }
		var attr = {combId:combId,title:title,mapValue:title,content:content,combStatus:combStatus};
 		var geometry = new Point(x, y);		
 		var graphic = new Graphic(geometry);
 		graphic.setAttributes(attr);
 		featureLayer.add(graphic);	
  });
}

var districtArea="";

//获取当前成员单位信息
$.ajax({
	method : 'GET',
	url : '/agsupport/om-org!getOrganizationName.action',
	async : false,
	success : function(data) {
		districtName=data;	
		for(var index in nnArea){
			if(nnArea[index].name==districtName){
				districtArea=nnArea[index].code;			  
				break;
			}
		}
		if(data='市区防内涝抢险指挥部')
			specialArea=true;
	},
	error : function(e) {
		alert('请求失败');
	}
});

function addAllMonitorStation(result){
	if(specialArea==null)
		specialArea=parent.window.specialArea;
	var rows=result.rows;
	//1 设施
	for(var i=0;i<rows.length;i++){
		var row=rows[i];
		if(!specialArea&&row.area!=districtArea&&row.estType!=17){
			
			continue;
	    }
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
				
				if(status==1){
				   combStatus="1";
				}					
			}
			//content+="</td>";
		}
		//content+="</table>";
		ssjkCreatePoint(combId,featureLayreId,title,x,y,content,iconUrl,combStatus);
	}	
}

function featureLayreOnClickHandler(featureLayer){
require([
         "dojo/_base/connect"
       ], function(connect) {        
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
	parent.layer.open({
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
	parent.layer.open({
	  type: 2,
	  title: title,
	  shadeClose: true,
      shade: false,
	  area: ['620px', '520px'],
	  content: location.protocol+"//"+location.hostname+":"+location.port+'/awater/waterSystem/ssjk/ssjk-dim-sx.html' //iframe的url
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
	parent.layer.open({
	  type: 2,
	  title: title,
	  shadeClose: true,
      shade: false,
	  area: ['600px', '400px'],
	  content: page+"?dimID="+dimId+"&itemID="+itemId //iframe的url
	}); 
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

 function changeInfoWindowUI(h){
      if(h){
	    if($(".titlePane").is(":visible")){
          $(".titlePane").hide();
          $(".esriPopupWrapper").css("width","180px");
          $(".sizer").css("width","180px");  
       }
      }else{
          if(!$(".titlePane").is(":visible")){
		   $(".titlePane").show();
          $(".esriPopupWrapper").css("width","260px");
          $(".sizer").css("width","260px");	 
       }        
      }
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
function showJsdDispatch(g){
	parent.layer.open({
		type: 2,
	  	title: g.graphic.attributes.title,
	  	shadeClose: true,
	  	shade: 0,
	  	area: ['700px', '440px'],
	  	content:"/awater/nnwaterSystem/EmergenControl/District/Record/jsdDispatch_Map_Record.html?combId="+g.graphic.attributes.combId+"&modelId="+recordId+"&type=4"
	}); 
}

function showSsjkMain(g){
	if(g.graphic.getLayer().id!="ssjk_17"){
    	parent.layer.open({
			type: 2,
		  	title: g.graphic.attributes.title,
		  	shadeClose: true,
		  	shade: 0,
		  	area: ['860px', '420px'],
		  	content:  ["/awater/waterSystem/ssjk/ssjk-dim-main.html?combId="+g.graphic.attributes.combId,"#mapDiv"] //iframe的url
		}); 
	}
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
	parent.layer.open({
		type: 2,
		title: title,
		shadeClose: true,
		shade: 0,
		area: ['860px', '420px'],
		content: ["/awater/waterSystem/ssjk/ssjk-dim-main.html?combId="+combId,"#mapDiv"]
	});
}