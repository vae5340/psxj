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
"esri/layers/LabelClass",
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
"esri/toolbars/edit",
"esri/tasks/FeatureSet",
"esri/SpatialReference"
]);
require(["dojo/ready"], function (ready) {
	    ready(function () {
	    	$("#qsfw").validate({
	    	    rules: {
	    	    	gwcd:{
	    	    		required: true,
	    	    		number:true
	    	    	}
	    	    },
	    	    messages: {
	    	    	gwcd:{
	    	    		required:'<font class="waring" color="red">该字段为必填项</font>',
	    	    		number:'<font class="waring" color="red">请输入数字</font>'
	    	    	}
	    	    }
	    	});
    	$("#mapInfo_content").load("systemInfo/mapInfo/infoInput.html");
        initMap();
        // 初始化测量工具
        //initTools();
        //加载问题上报数据点
        getWtsbByLoginName();
        //地图右上角是否显示
        //isShowGxOrWtsb();
        //权属范围编辑功能初始化
        initQstc();
        //是否显示权属范围编辑
        //isShowEdit();
        //打印地图
        $("#tool_print").click(function(){
        	printMap();
    	});
    });
});
var gwurl_1=awater.url.url_h,gwurl_bc=awater.url.url_nc,qsfw_bj=awater.url.url_qsfw_bj,qsfw_tc=awater.url.url_qsfw_dt,
	sjrh_tc=awater.url.url_sjrh,sylx_tc=awater.url.url_sylx,mp_tc=awater.url.url_mp,ykwkj_tc=awater.url.url_ykwkj,
	pshsb_tc=awater.url.url_pshsb,gwurl_2,gwurl_3;
var map,sls,outLineGraphic,fl, graphicsArr = new Array(),
	graphicsNNArr = new Array(),refreshobj=null,pipeNetValid=false,isClickQuery = true;
var isInfoWindowShow = false;
var tileArr = new Array();
var tileGraphicsLayer;
var pipelineSymbol,pipemarkerSymbol,pipefillSymbol;
var myFeatureLayer,drawToolbar,editToolbar,editEvt,delEvt,editDeactivate,isClear=false;
var index;//定时器
//加载数据融合图层
function showSjrhTc(){
		var featureLayerSjrh = new esri.layers.FeatureLayer(sjrh_tc, {id: 'sjrh_tc',outFields: ["*"]});
	  map.addLayer(featureLayerSjrh);
}
//加载示意连线图层
function showSylxTc(){
	var featureLayerSylx = new esri.layers.ArcGISDynamicMapServiceLayer(sylx_tc, {id: 'sylx_tc'});
	map.addLayer(featureLayerSylx);
}
//应开未开井图层
function showYkwkjTc(){
	var featureLayerYkwkj = new esri.layers.ArcGISDynamicMapServiceLayer(ykwkj_tc, {id: 'ykwkj_tc'});
	map.addLayer(featureLayerYkwkj);
}
//排水户上报分布图
function showPshsbTc(){
	var featureLayerPshsb = new esri.layers.ArcGISDynamicMapServiceLayer(pshsb_tc, {id: 'pshsb_tc'});
	map.addLayer(featureLayerPshsb);
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
         var symbol0 = new esri.symbol.PictureMarkerSymbol("img/old_map_point_jing.png", 21, 28);
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
     		url: '/' + serverName + '/psh-discharger-well!getFormBySGuid.action',
     		data:{"sGuid":feature1.attributes.S_GUID},
     		async:false,
     		dataType: 'json',
     		success : function(data){
     			if(data!=null && data.length>0){
     				for ( var i = 0; i < data.length; i++) {
     					var query = new esri.tasks.Query();
     					var queryTask= new esri.tasks.QueryTask(awater.url.url_report[0]+"/0");
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
         var symbol1 = new esri.symbol.PictureMarkerSymbol("img/ic_add_facility_door.png", 21, 28);
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
function changeQsdw(value){
	if(value=="城中村权属管理"){
		$("#qsdwText").html("城中村名<font color='red'>*</font>");
	}else if(value=="其他业主单位权属"){
		$("#qsdwText").html("权属单位<font color='red'>*</font>");
	}else if(value=="三不管设施"){
		$("#qsdwText").html("三不管区域名称<font color='red'>*</font>");
	}else if(value=="待查区"){
		$("#qsdwText").html("待查区名称<font color='red'>*</font>");
	}
}
//是否显示权属范围编辑,判断用户是否为去管理员或系统管理员，是则显示，否则不显示
function isShowEdit(){
	$.ajax({
		type : 'get',
		url: '/' + serverName + '/gx-problem-report!userIsAdmin.action',
		dataType: 'json',
		success : function(data){
			if(data.success){
				$("#qsfwBts").show();
			}
		}
	});
}
function clock(){
	if($("#userName").text()!=null && $("#userName").text()!=""){
		window.clearInterval(index);
		if($("#userName").text()!="技术支持管理员"){//系统管理员不限制
			//编辑图层只能看到自己上报的
			myFeatureLayer.setDefinitionExpression("LRR = '"+$("#userName").text()+"'");
		}
	}
}
//权属范围编辑功能初始化
function initQstc(){
	myFeatureLayer = new esri.layers.FeatureLayer(qsfw_bj, {  
		id: 'qsfw_bj',
        opacity:0.7 ,
        outFields: ["*"] 
	});
	//alert($("#userName").text());
	index=self.setInterval("clock()",1000);
	map.addLayers([myFeatureLayer]);  
	//map.on("layers-add-result", initSelectToolbar); 
	
	drawToolbar = new esri.toolbars.Draw(map);
	editToolbar = new esri.toolbars.Edit(map);
	initSelectToolbar();
	/*on(dom.byId("addFence"), "click", function(evt) {  
	    drawToolbar.activate(Draw.POLYGON);  
	});*/
	myFeatureLayer.hide();
	//新增
	$("#addFence").click(function(){
		clear();
		/*map.getLayer("qsfw_tc").show();
		$("#checkbox_qsfw_tc").prop("checked",true);*/
		drawToolbar.activate(esri.toolbars.Draw.POLYGON);
	});
	//删除
	$("#deleteFence").click(function(){
		clear();
		myFeatureLayer.show();
		map.getLayer("qsfw_tc").hide();
		$("#checkbox_qsfw_tc").prop("checked",false);
		delEvt = myFeatureLayer.on("click", function(evt) {
			require(["dojo/_base/event"], function (event) {
		    	event.stop(evt);
		    });
			layer.confirm('确定删除该权属范围？', {
		        btn: ['确定', '取消'] //按钮
		    }, function () {
		    	myFeatureLayer.applyEdits(null, null, [evt.graphic],function(){
	            	myFeatureLayer.hide();
	            	map.getLayer("qsfw_tc").show();
	            	$("#checkbox_qsfw_tc").prop("checked",true);
	            	if(delEvt!=undefined){
	        			delEvt.remove();
	        		}
	            	layer.msg('删除成功！', {
                        icon: 1,
                        time: 2000
                    });
	        	},function(){
	        		layer.msg('删除失败！', {
                        icon: 1,
                        time: 2000
                    });
	        	});
		    }, function () {
		        return;
		    });
		});
	});
	//修改
	$("#updateFence").click(function(){
		clear();
		myFeatureLayer.show();
		map.getLayer("qsfw_tc").hide();
		$("#checkbox_qsfw_tc").prop("checked",false);
		editEvt = myFeatureLayer.on("click", function(evt) {
			editEvt.remove();
			require(["dojo/_base/event"], function (event) {
		    	event.stop(evt);
		    });
			var options = {
	            allowAddVertices: true,
	            allowDeleteVertices: true,
	            ghostLineSymbol: new esri.symbol.SimpleLineSymbol().setWidth(3).setColor(new esri.Color([128,128,128])).setStyle(esri.symbol.SimpleLineSymbol.STYLE_SHORTDOT),
	            uniformScaling: true
	          };

			editToolbar.activate(esri.toolbars.Edit.EDIT_VERTICES | esri.toolbars.Edit.MOVE, evt.graphic, options);
		    editDeactivate = map.on("click", function(evt){
		    	isClear=false;
		        editToolbar.deactivate();
		        editDeactivate.remove();
	        });
		});
	});
	//清除
	$("#clearFence").click(function(){
		clear();
	});
	
}
function clear(){
	isClear=true;
	myFeatureLayer.hide();
	map.getLayer("qsfw_tc").show();
	    $("#checkbox_qsfw_tc").prop("checked",true);
	drawToolbar.deactivate();
	editToolbar.deactivate();
	if(delEvt!=undefined){
		delEvt.remove();
	}
	if(editEvt!=undefined){
		editEvt.remove();
	}
	if(editDeactivate!=undefined){
		editDeactivate.remove();
	}
}
function initSelectToolbar() {
	editToolbar.on("deactivate", function(evt) {
	    if(!isClear){//evt.info.isModified
	    	document.getElementById("qsfw").reset();
	    	var attrs=evt.graphic.attributes;
	    	$("#qslx").val(attrs['QSLX']);
	        $("#qsdw").val(attrs['QSDW']);
	        $("#yhdw").val(attrs['YHDW']);
	        $("#yhfwms").val(attrs['YHFWMS']);
	        $("#gwcd").val(attrs['GWCD']);
	        if(attrs['QSLX']=="城中村权属管理"){
	    		$("#qsdwText").html("城中村名<font color='red'>*</font>");
	    	}else if(attrs['QSLX']=="其他业主单位权属"){
	    		$("#qsdwText").html("权属单位<font color='red'>*</font>");
	    	}else if(attrs['QSLX']=="三不管设施"){
	    		$("#qsdwText").html("三不管区域名称<font color='red'>*</font>");
	    	}else if(attrs['QSLX']=="待查区"){
	    		$("#qsdwText").html("待查区名称<font color='red'>*</font>");
	    	}
	        //清除以前的验证提示
	        if($("#qsfw").data('validator')){
	        	$("#qsfw").data('validator').resetForm();
	        	$("#qsfw input").removeClass("error");
	        }
	      //统计区域内窨井数量
	        identifyTask = new esri.tasks.IdentifyTask(gwurl_1); 
			identifyParams = new esri.tasks.IdentifyParameters();// 查询参数
		    identifyParams.tolerance = 0;// 容差范围
		    identifyParams.returnGeometry = false;// 是否返回图形
		    identifyParams.layerIds = [5];// 查询图层
		    identifyParams.layerOption = esri.tasks.IdentifyParameters.LAYER_OPTION_ALL;// 设置查询的图层LAYER_OPTION_VISIBLE
		    // 查询范围
		    identifyParams.width = map.width;  
		    identifyParams.height = map.height; 
	        identifyParams.geometry = evt.graphic.geometry;  
	        identifyParams.mapExtent = map.extent;  
	        identifyTask.execute(identifyParams,function(results) {
	        	layer.open({
					  type: 1,
					  shade: false,
					  area: ['850px', '300px'],
					  title: "权属范围信息修改", //标题
					  btn:['保存','取消'],
					  content: $('#qsfwxx'), //捕获的元素，注意：最好该指定的元素要存放在body最外层，否则可能被其它的相对元素所影响
					  btn1: function(index,layero){
						  var flag = $("#qsfw").valid();
						  if(flag){
							  evt.graphic.attributes['QSLX']=$("#qslx").val();
							  evt.graphic.attributes['QSDW']=$("#qsdw").val();
							  evt.graphic.attributes['YHDW']=$("#yhdw").val();
							  evt.graphic.attributes['YHFWMS']=$("#yhfwms").val();
							  evt.graphic.attributes['GWCD']=$("#gwcd").val();
							  evt.graphic.attributes['MEMO1']=results.length;
							  myFeatureLayer.applyEdits(null, [evt.graphic], null,function(){
					            	myFeatureLayer.hide();
					            	map.getLayer("qsfw_tc").show();
					            	$("#checkbox_qsfw_tc").prop("checked",true);
					            	if(editEvt!=undefined){
					        			editEvt.remove();
					        		}
					            	layer.close(index);
					            	layer.msg('修改成功！', {
				                        icon: 1,
				                        time: 2000
				                    });
					        	},function(){
					        		layer.msg('修改失败！', {
				                        icon: 1,
				                        time: 2000
				                    });
					        	});
						  }
					  },btn2: function(layero){
						  myFeatureLayer.hide();
		            	  map.getLayer("qsfw_tc").show();
		            	  $("#checkbox_qsfw_tc").prop("checked",true);
					  },
					  cancel: function(){
						  //editEvt.remove();
						  myFeatureLayer.hide();
		            	  map.getLayer("qsfw_tc").show();
		            	  $("#checkbox_qsfw_tc").prop("checked",true);
					  }
				});
	        });
	    }
	});
    drawToolbar.on("draw-end", function(evt) {
    	document.getElementById("qsfw").reset();
    	$("#qsdwText").html("权属单位<font color='red'>*</font>");
    	//清除以前的验证提示
        if($("#qsfw").data('validator')){
        	$("#qsfw").data('validator').resetForm();
        	$("#qsfw input").removeClass("error");
        }
        //统计区域内窨井数量
        identifyTask = new esri.tasks.IdentifyTask(gwurl_1); 
		identifyParams = new esri.tasks.IdentifyParameters();// 查询参数
	    identifyParams.tolerance = 0;// 容差范围
	    identifyParams.returnGeometry = false;// 是否返回图形
	    identifyParams.layerIds = [5];// 查询图层
	    identifyParams.layerOption = esri.tasks.IdentifyParameters.LAYER_OPTION_ALL;// 设置查询的图层LAYER_OPTION_VISIBLE
	    // 查询范围
	    identifyParams.width = map.width;  
	    identifyParams.height = map.height; 
        identifyParams.geometry = evt.geometry;  
        identifyParams.mapExtent = map.extent;  
        identifyTask.execute(identifyParams,function(results) {
        	//alert(results.length);
        	$.ajax({//获取当前用户所在区域
        		type : 'get',
        		url: '/' + serverName + '/gx-problem-report!getUserSzqy.action',
        		dataType: 'json',
        		success : function(data){
        			if(data){
        				layer.open({
        		  			  type: 1,
        		  			  shade: false,
        		  			  area: ['850px', '300px'],
        		  			  title: "权属范围信息新增", //标题
        		  			  btn:['保存','取消'],
        		  			  content: $('#qsfwxx'), //捕获的元素，注意：最好该指定的元素要存放在body最外层，否则可能被其它的相对元素所影响
        		  			  btn1: function(index,layero){
        		  				    var flag = $("#qsfw").valid();
        		  				    if(flag){
        		  				    	var petroFieldsFL = map.getLayer("qsfw_bj");
        		  				        drawToolbar.deactivate();  
        		  				        //获取要素个数  
        		  				        var currentGraphciNo = petroFieldsFL.graphics.length;
        		  				        //获取OBJECTID
        		  				        var currentObj;
        		  				        if(currentGraphciNo == 0){
        		  				        	currentObj=0;
        		  				        }else{
        		  				        	//获取最后一个要素的OBJECTID，并转为数值类型  
        		  				            currentObj = Number(petroFieldsFL.graphics[currentGraphciNo - 1].attributes['OBJECTID']);  
        		  				        }
        		  				        //设置新增Graphic的属性，OBJECTID必须设置，其余可以设为NULL  
        		  				        var attr = {  
        		  				            "OBJECTID": currentObj + 1 ,
        		  				            "QSLX": $("#qslx").val(),
        		  				            "QSDW": $("#qsdw").val(),
        		  				            "YHDW": $("#yhdw").val(),
        		  				            "YHFWMS": $("#yhfwms").val(),
        		  				            "GWCD": $("#gwcd").val(),
        		  				            "LRSJ": CurentTime(),
        		  				            "LRR": $("#userName").text(),
        		  				            "MEMO1":results.length,
        		  				            "SZQY":data.szqy
        		  				        };  
        		  				        //产生新的Graphic  
        		  				        var newGraphic = new esri.Graphic(evt.geometry, null, attr,null);  
        		  				        //使用applyEdits函数将Graphic保存到FeatureLayer中  
        		  				        petroFieldsFL.applyEdits([newGraphic], null, null,function(){
        		  				        	map.getLayer("qsfw_tc").refresh();
        		  				        	map.getLayer("qsfw_tc").show();
        		  					        $("#checkbox_qsfw_tc").prop("checked",true);
        		  					        layer.close(index);
        		  					        layer.msg('新增成功！', {
        		  		                        icon: 1,
        		  		                        time: 2000
        		  		                    });
        		  				        },function(){
        		  				        	layer.msg('新增失败！', {
        		  		                        icon: 1,
        		  		                        time: 2000
        		  		                    });
        		  				        });
        		  				    }
        		  			  },
        		  			  cancel: function(){
        		  				  //drawToolbar.deactivate();
        		  			  }
    		        	});
        			}
        		}
        	});
        });
    });  
}
//打印地图
function printMap(){
	window.open('printMap/print.html');
	/*var nav=document.getElementById("prtHd3");
	nav.style.display="none";
	$("#prtHd1").hide();
	$("#prtHd2").hide();
	$("#leftDiv").hide();
	$("#seperator").hide();
	$("#prtHd4").hide();
	$("#coorDiv").hide();
	$("#checked_isShowData").hide();
	$("#qsfwBts").hide();
	$("#sc-home-map-search").hide();
	$("#mapType").hide();
	$("#mapDiv_zoom_slider").hide();
	$("#page-wrapper").css("margin-left","0")
	window.print();
	nav.style.display="block";
	$("#prtHd1").show();
	$("#prtHd2").show();
	$("#leftDiv").show();
	$("#seperator").show();
	$("#prtHd4").show();
	$("#coorDiv").show();
	$("#checked_isShowData").show();
	$("#qsfwBts").show();
	$("#sc-home-map-search").show();
	$("#mapType").show();
	$("#mapDiv_zoom_slider").show();
	$("#page-wrapper").css("margin-left","70px")*/
}
//搜索框输入中文地址进行定位1
function searchLocation(){
	var local=$("#search_location").val().replace(/(^\s*)|(\s*$)/g, "");
	if(local==""){
		local="广州市天河区天寿路2";
	}else{
		$("#search-clear-btn").show();
	}
	if( !isNaN( local ) ){//是数字，则是原管网数据编号定位
		//根据objectId定位
		var query = new esri.tasks.Query();
		var queryTask= new esri.tasks.QueryTask(awater.url.url_h+"/5");
		query.outFields = ["*"];
		query.where = "OBJECTID="+local;
		query.returnGeometry=true;
		queryTask.execute(query,function(result){
			if(!result || result.features.length==0)
	         	return;
			var feature=result.features[0];
			locationForSearch(feature.geometry.x,feature.geometry.y);
		});
	}else{//不是数字，则是地名地址定位
		//创建地址解析器实例     
		var myGeo = new BMap.Geocoder();
		// 将地址解析结果显示在地图上，并调整地图视野    
		myGeo.getPoint(local, function(point){      
		    if (point) {
		    	locationForSearch(point.lng,point.lat) ;  
		    }      
		 }, 
		"广州市");
	}
}
//搜索框输入中文地址进行定位2
function locationForSearch(x,y){
	var mapArc=map;
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

//搜索框输入中文地址进行定位3清空
function clear_searchLocation(){
	$("#search_location").val("");
	$("#search-clear-btn").hide();
	map.graphics.clear();
}
var isZwnw =false;//管网是否是加载政务内网
//屏蔽要素详情要显示的字段
var layer0 = new Array("OBJECTID","Shape","USID1","USID2","DATA_PROVI","WELL_STYLE","WELL_STATE","WELL_USID","MAINTAINER","DATE_","DATA_VERSI","USID_Backu");
var layer1 = new Array("OBJECTID","Shape","USID1","USID2","REPAIR_DAT","DATA_VERSI","TASK_ID","UPDATEDATE","GENGXCS","LAYERS","CHECKSTATE","PARENTID","DATE_","REPAIR_D_1","DATA_PROVI","USID_Backu","T12","T9","T11","shahechong");
var layer2 = new Array("OBJECTID","Shape","USID1","USID2","FLOW_MEDIA","DATA_VERSI","SY_ANGEL","ENABLED","TASK_ID","UPDATEDATE","GENGXCS","LAYERS","CHECKSTATE","PARENTID","DATE_","DATA_PROVI","USID_Backu","T14","T15","shahechong");
var layer3 = new Array("OBJECTID","Shape","USID1","USID2","MODE","DATE_","DATA_VERSI","TASK_ID","UPDATEDATE","GENGXCS","LAYERS","CHECKSTATE","PARENTID","LANE_WAY","DATA_PROVI","FCODE","USID_Backu","T12","T9","T11","T7","T25","shahechong");
var layer4 = new Array("OBJECTID","Shape","USID1","USID2","SPECIALTY","ENABLED","DATA_VERSI","TASK_ID","UPDATEDATE","GENGXCS","LAYERS","CHECKSTATE","PARENTID","DATE_","DATA_PROVI","SORT","USID_Backu","T12","shahechong","NAME_B","SECURITYTY");
var layer5 = new Array("OBJECTID","Shape","USID1","USID2","DATE_","DATA_VERSI","TASK_ID","UPDATEDATE","GENGXCS","LAYERS","CHECKSTATE","PARENTID","RFID","RF_SORT","TOP_H","WELL_AREA","GP","GW","BOTTOM_TYP","SDE_PS_WEL","MAINTAINER","SOURCE","DATA_PROVI","USID_Backu","T12","T10","T8","T7","T25","shahechong","NAME_B","CHAMBER_RO","SECURITYTY");
var layer6 = new Array("OBJECTID","Shape","Shape_Length","DISTRICT","MANAGEDEPT","STATE","SUBTYPE","SHAPE_Leng","ErrorInfo","Shape_Length","USID1","USID2","TAKEOVER_D","DATE_","DATA_VERSI","TASK_ID","UPDATEDATE","GENGXCS","LAYERS","CHECKSTATE","PARENTID","VERIFY_WAY","ENABLED","IS_MAINTEN","PIPE_NAME","PROJECT__1","SURVEY_WAY","DATA_PROVI","USID_Backu","START_US_1","END_USID_B","T19","shahechong");
var layer7 = new Array("OBJECTID","Shape","Shape_Length","DISTRICT","SHAPE_Leng","ErrorInfo","Shape_Length","USID1","USID2","DATE_","DATA_VERSI","TASK_ID","UPDATEDATE","GENGXCS","LAYERS","ENABLED","IS_MAINTEN","SOURCE","GQSORT","CHECKSTATE","PARENTID","DATA_PROVI","USID_Backu","START_US_1","END_USID_B","NN2","T1","T19","shahechong");
var layers = new Array(layer0,layer1,layer2,layer3,layer4,layer5,layer6,layer7);

//地图右上角
function isShowGxOrWtsb(){
	var cotents='<div style="width: 100%;height: 80%;">'
				+'<input type="checkbox" class="styled" id="checkbox_gw_1" onclick="isShowDate(this.id)" checked/>'
				+'管网数据'
				+'</br>'
				+'<input type="checkbox" class="styled" id="checkbox_wtsbXx" onclick="isShowDate(this.id)" checked/>'
				+'问题上报'
				+'</br>'
				+'<input type="checkbox" class="styled" id="check_sb" onclick="isShowDate(this.id)"/>'
				+'数据上报'
				+'</br>'
				+'<input type="checkbox" class="styled" id="checkbox_qsfw_tc" onclick="isShowDate(this.id)" checked/>'
				+'权属范围'
				+'</br>'
				+'<input type="checkbox" class="styled" id="checkbox_sjrh_tc" onclick="isShowDate(this.id)"/>'
				+'数据融合'
				+'</br>'
				+'<input type="checkbox" class="styled" id="checkbox_sylx_tc" onclick="isShowDate(this.id)"/>'
				+'示意连线'
				+'</br>'
				+'<input type="checkbox" class="styled" id="checkbox_mp_tc" onclick="isShowDate(this.id)"/>'
				+'门牌数据'
				+'</br>'
				+'<input type="checkbox" class="styled" id="checkbox_ykwkj_tc" onclick="isShowDate(this.id)"/>'
				+'应开未开井'
				+'</br>'
				+'<input type="checkbox" class="styled" id="checkbox_pshsb_tc" onclick="isShowDate(this.id)"/>'
				+'排水户上报'
				+'</div>';
	
	var checked_isShowData = document.getElementById('checked_isShowData');//这个在index.html里面一个div
	if(typeof(checked_isShowData)!='undefined'){
		checked_isShowData.innerHTML = cotents;
		//鼠标悬停事件
		$("#checked_isShowData").hover(function(){
			//$(this).css("right","10px");
		});
	}
}
//显示与隐藏的点击
function isShowDate(val2){
	var val=val2.replace("checkbox_","");
	if(typeof(map)=='undefined')return;
	var layerMap = map.getLayer(val);
	if(val2.indexOf("check_sb")!=-1){//数据上报
		layerMap = map.getLayer(awater.url.url_report[1]);
	}
	if($("#"+val2).is(':checked')) {
		if(val2.indexOf("check_sb")!=-1 && typeof(layerMap)=="undefined"){//数据上报如果事先没有，就再加载一下
			createReportServer();//加载一下
			layerMap = map.getLayer(awater.url.url_report[1]);
		}
		if(val2.indexOf("sjrh_tc")!=-1 && typeof(layerMap)=="undefined"){//数据融合，如果没加载就执行一下
			showSjrhTc();
			layerMap = map.getLayer(val);//再获取一次
		}
		if(val2.indexOf("sylx_tc")!=-1 && typeof(layerMap)=="undefined"){//示意连线，如果没加载就执行一下
			showSylxTc();
			layerMap = map.getLayer(val);//再获取一次
		}
		if(val2.indexOf("mp_tc")!=-1 && typeof(layerMap)=="undefined"){//门牌数据，如果没加载就执行一下
			showMpTc();
			layerMap = map.getLayer(val);//再获取一次
		}
		if(val2.indexOf("ykwkj_tc")!=-1 && typeof(layerMap)=="undefined"){//应开未开井数据，如果没加载就执行一下
			showYkwkjTc();
			layerMap = map.getLayer(val);//再获取一次
		}
		if(val2.indexOf("pshsb_tc")!=-1 && typeof(layerMap)=="undefined"){//排水户上报数据，如果没加载就执行一下
			showPshsbTc();
			layerMap = map.getLayer(val);//再获取一次
		}
		if(typeof(layerMap)!="undefined"){
			layerMap.show();
		}
		if(val2=="checkbox_gw_1" && $("#check_map")){//管线同步数据上班的面板
			$("#check_map").prop("checked",true);
		}else if(val2=="checkbox_wtsbXx" && $("#check_wtsb")){//问题上报同步数据上班的面板
			$("#check_wtsb").prop("checked",true);
		}else if(val2=="check_sb" && $("#check_check")){//数据上报同步数据上班的面板
			$("#check_check").prop("checked",true);
		}
	}else{
		if(typeof(layerMap)!="undefined"){
			layerMap.hide();
		}
		if(val2=="checkbox_gw_1" && $("#check_map")){//管线同步数据上班的面板
			$("#check_map").prop("checked",false);
		}else if(val2=="checkbox_wtsbXx" && $("#check_wtsb")){//问题上报同步数据上班的面板
			$("#check_wtsb").prop("checked",false);
		}else if(val2=="check_sb" && $("#check_check")){//数据上报同步数据上班的面板
			$("#check_check").prop("checked",false);
		}
	}
}
//问题上报数据入口1 获取当前区的问题上报
function getWtsbByLoginName(){
	$.ajax({
		type : 'get',
		timeout : 10000,
		url: '/' + serverName + '/gx-problem-report!getByLoginName.action',
		dataType: 'json',
		success : function(data){
			if(data.totalItems>0){
				var results=data.result;
				for(var i in results){
					locationForWtsb(results[i])
				}
			}
		}
	})
}

//问题上报数据入口2根据案件不同的状态点定位
function locationForWtsb(results){
	var x=results.x;
	var y=results.y;
	var state=results.state;
	var isbyself=results.isbyself;
	var isSign=results.signTime;
	var stateName;
	if(x!=null&&y!=null&&x!=''&&y!=''){
		var mapArc=map;
		//mapArc.graphics.clear();
		var pipelineSymbol,pipemarkerSymbol;
		if(isbyself=='false' && (state=='ended' || state=='')){//办结
			pipelineSymbol=(new esri.symbol.SimpleLineSymbol()).setColor(new esri.Color("green")).setWidth(6);
			pipemarkerSymbol=(new esri.symbol.SimpleMarkerSymbol()).setColor(new esri.Color("green")).setSize(7).setOutline(pipelineSymbol);
			stateName="办结";
		}else if(isbyself=='false' && (state=='active' || isSign=='')){//待处理
			pipelineSymbol=(new esri.symbol.SimpleLineSymbol()).setColor(new esri.Color("#9A32CD")).setWidth(6);
			pipemarkerSymbol=(new esri.symbol.SimpleMarkerSymbol()).setColor(new esri.Color("#9A32CD")).setSize(7).setOutline(pipelineSymbol);
			stateName="待处理";
		}else if(isbyself=='false' && (state=='active' || isSign!='')){//处理中
			pipelineSymbol=(new esri.symbol.SimpleLineSymbol()).setColor(new esri.Color("blue")).setWidth(6);
			pipemarkerSymbol=(new esri.symbol.SimpleMarkerSymbol()).setColor(new esri.Color("blue")).setSize(7).setOutline(pipelineSymbol);
			stateName="处理中";
		}else if(isbyself=='true'){//自行处理
			pipelineSymbol=(new esri.symbol.SimpleLineSymbol()).setColor(new esri.Color("yellow")).setWidth(6);
			pipemarkerSymbol=(new esri.symbol.SimpleMarkerSymbol()).setColor(new esri.Color("yellow")).setSize(7).setOutline(pipelineSymbol);
			stateName="自行处理";
		}
		var pointJson={"x":x,"y":y,"spatialReference":{"wkid":4326},"results":results,"stateName":stateName};
		var geometry=new esri.geometry.Point(pointJson);
		//生成一个layer
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
		if(map.getLayer("wtsbXx")){//先获取
			featureLayer = map.getLayer("wtsbXx");
		}else{//没有就新增
			featureLayer = new esri.layers.FeatureLayer(featureCollection, {
		          id: 'wtsbXx',
		          opacity:0.7
		    });
		}
		var graphic=new esri.Graphic(geometry, pipemarkerSymbol);
		featureLayer.add(graphic);
		mapArc.addLayers([featureLayer]);//加到图层上面
	}
}
//问题上报数据入口3点击问题上报点，显示出详细信息
function doIdentifyForWtsb(event) {
	  var LayerMap = map.getLayer("wtsbXx");
	  if(LayerMap && LayerMap.visible && typeof(event.graphic)!="undefined" && typeof(event.graphic.geometry.results)!="undefined"){
		  	var result=event.graphic.geometry;//获取信息
		  	var contents="<span>&nbsp;状态：</span>" + result.stateName + "<br>"  
            + "<span>上报人：</span>" + result.results.sbr + "<br>"  
            + "<span>上报时间：</span>"  + result.results.sbsj + "<br>"  
            + "<span>上报单位：</span>"  + result.results.parentOrgName + "<br>"  
            + "<span>问题地点：</span>"  + result.results.szwz;
		  	map.infoWindow.hide();
	    	map.graphics.clear();  
	    	map.infoWindow.setTitle("问题上报信息"); 
	    	map.infoWindow.resize(300, 200);// 定义信息查询框大小
            map.infoWindow.setContent(contents);
            map.infoWindow.show(event.screenPoint,map.getInfoWindowAnchor(event.screenPoint));//弹框定位到当前位置弹
            map.infoWindow.show(); 
            //重写放大缩小按钮事件
            $("#mapDiv .esriPopup .titleButton.maximize").unbind('click').click(function() {  
                if ($(this).context.title=="恢复") {  //点击放大
                	var url="/psxj/systemInfo/ssxjxt/xcyh/xcyh/detail.html?serverName="+serverName+"&templateCode="
        				+result.results.templateCode+"&taskInstDbid="+result.results.histTaskInstDbid+"&masterEntityKey="
        				+result.results.id+"&activityChineseName="+result.results.activityChineseName
        				+"&activityName="+result.results.activityName;
                	map.infoWindow.setContent("<iframe src='"+url+"' style='width:100%; height:100%;'></iframe>");
                }else{
                	map.infoWindow.setContent(contents);
                } 
            });  
	   }		       
}
//获取当前地图范围
function showExtent(ext){
  var area;
  //动态显示当前地图范围面积
  var geometry = ext.extent;
  xMin=geometry.xmin;
  xMax=geometry.xmax;
  yMin=geometry.ymin;
  yMax=geometry.ymax;
  require(["esri/geometry/geometryEngine"], function (geometryEngine) {
	  var spatialReference = map.spatialReference;
	  if (spatialReference.isWebMercator() || spatialReference.wkid == "4326") {
		  area= geometryEngine.geodesicArea(geometry, "square-meters")
	  } else {
		  area= geometryEngine.planarArea(geometry, "square-meters")
	  }
	  area = (area / 1000000).toFixed(2);
	  areaValue=area;
	  var areaDiv = document.getElementById('areaDiv');
	  areaDiv.innerHTML = '当前地图显示范围面积：'+area+'平方公里';
  });
  
}
//地图初始化
function initMap() {
	esri.config.defaults.io.proxyUrl= "/awater/esri_proxy.jsp";
	esri.config.defaults.io.alwaysUseProxy= false;
	
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
	    zoom: 9,
	    maxZoom: 11
	  });
	
    sls = new esri.symbol.SimpleLineSymbol().setWidth(3).setColor(new esri.Color([0,255,255])).setStyle(esri.symbol.SimpleLineSymbol.STYLE_SHORTDOT);   
	
    tileGraphicsLayer = new esri.layers.GraphicsLayer({opacity:0.5});
    map.on("pan-end",function () {
        tileArr = new Array();
       /* if(map.getLayer("DiTu")) {
            map.getLayer("DiTu").refresh();
        }
        if(map.getLayer("vec")) map.getLayer("vec").refresh();
        if(map.getLayer("WeiXingYingXiang")) map.getLayer("WeiXingYingXiang").refresh();
        if(map.getLayer("WeiXingYingXiang_cia")) map.getLayer("WeiXingYingXiang_cia").refresh();*/
	  });
	  map.on("zoom-end",function () {
	      tileArr = new Array();
	       /* if(map.getZoom()<19)
	           tileGraphicsLayer.clear();
	        if(map.getLayer("DiTu")) {
	            map.getLayer("DiTu").refresh();
	        }
	        if(map.getLayer("vec")) map.getLayer("vec").refresh();
	        if(map.getLayer("WeiXingYingXiang")) map.getLayer("WeiXingYingXiang").refresh();
	        if(map.getLayer("WeiXingYingXiang_cia")) map.getLayer("WeiXingYingXiang_cia").refresh();*/
	        
	  });
	  map.on("extent-change", showExtent);
	  
	  map.infoWindow.domNode.getElementsByClassName("action zoomTo")[0].style.display = "none"; // 隐藏infoWindow的缩放至按钮
	  
	  // 信息框切换选中的数据时，重新生成信息框的内容
	  map.infoWindow.on("selection-change", function () {
	      	var selectedFeature = map.infoWindow.getSelectedFeature();
	      	if (selectedFeature != null) {
	         	 //getInfoWindowContent(selectedFeature, selectedFeature.key);没找到
	      	}
	  });
 
	  map.infoWindow.resize(300, 600);// 定义信息查询框大小
	
	  mapClickOn = map.on('click', doIdentify);//管线，窨井点击弹框事件
	  //map.on('click', doIdentifyQsfw);//权属范围要素点击弹框
	  mapClickOn = map.on('click', doIdentifyForWtsb);//问题上报显示的弹框
	  map.on('mouse-move', mapMouseMove);// 鼠标移动事件，动态显示坐标以及比例尺
	  map.setMapCursor("url(plugins/hplus/images/identify_pointer.png),auto");
	 //判读是否在政务内网（地图zai里面加载）
	  isIntranet();
	//电子底图
	  map.addLayer(createVec());
	  //底图
	  map.addLayer(createDitu());
	  
	  map.addLayer(tileGraphicsLayer);
	  
	  //加载权属范围图层
	  var featureLayer = new esri.layers.FeatureLayer(qsfw_tc, {  
			id: 'qsfw_tc',
	        opacity:0.7,
	        showLabels:true,
	        outFields: ["*"]
	        
		});
	  var statesLabel = new esri.symbol.TextSymbol().setColor(new esri.Color("#0a162c"));
	  statesLabel.font.setSize("12pt");
	  statesLabel.font.setWeight(700);
	  var labelClass = new esri.layers.LabelClass({
	      "labelExpressionInfo": {
	          "value": "{QSLX}" + "\n" + "{QSDW}" + "\n" + "{GWCD}" + "米"//+ "{MEMO1}" + "个井"
	      }
	  });
	  labelClass.symbol = statesLabel;
	  featureLayer.setLabelingInfo([labelClass]);
	  map.addLayer(featureLayer);

	  //权属范围图层点击事件查询
	  function doIdentifyQsfw(event) {
		  var LayerMap = map.getLayer("qsfw_tc");
		  if(LayerMap && LayerMap.visible && typeof(event.graphic)!="undefined" && typeof(event.graphic.attributes)!="undefined"){
			    var objId=event.graphic.attributes['OBJECTID'];
			    var query = new esri.tasks.Query();
				var queryTask= new esri.tasks.QueryTask(qsfw_tc);
				query.outFields = ["*"];
				query.where = "OBJECTID="+objId;
				queryTask.execute(query,function(result){
					var atter = result.features[0];
					var fileds = result.fieldAliases;
					//var filedHtml = filedToHtml(fileds,layerId);
					var filedHtml="",textareaHtml="";
					if(fileds){
						var k = 0,row=fileds;
						for(i in row){
							if(i=="OBJECTID" || i=="SHAPE.AREA" || i=="SHAPE.LEN" || i=="MEMO1" || i=="MEMO2"
								|| i=="MEMO3"|| i=="MEMO4"|| i=="MEMO5") continue;
							if(i=="YHFWMS"){
								textareaHtml+="<div class=\"form-group\">"+
								"<label class=\"col-sm-2 control-label\">"+row[i]+"</label>" +
								"<div class=\"col-sm-10\"><textarea  row=\"2\" class=\"form-control input-sm\" id=\""+i+"\"" +
										"name=\""+i+"\" ></textarea></div></div>";
								continue;
							}
							var html="";
							var group = "<div class=\"form-group\">";
							if(i=="SZQY"){
								row[i]="所在区域";
							}else if(i=="GWCD"){
								row[i]+="(米)";
							}else if(i=="QSDW"){
								if(atter.attributes['QSLX']=="城中村权属管理"){
									row[i]="城中村名";
						    	}else if(atter.attributes['QSLX']=="其他业主单位权属"){
						    		row[i]="权属单位";
						    	}else if(atter.attributes['QSLX']=="三不管设施"){
						    		row[i]="三不管区域名称";
						    	}else if(atter.attributes['QSLX']=="待查区"){
						    		row[i]="待查区名称";
						    	}
							}
							html+="<label class=\"col-sm-2 control-label\">"+row[i]+"</label>" +
										"<div class=\"col-sm-4\"><input type=\"text\" class=\"form-control input-sm\" id=\""+i+"\"" +
												"name=\""+i+"\" /></div>";
							k++;
							if(k%2 == 1){
								html=group+html;
							}
							filedHtml += (k>=2 && k%2 == 0)? html+"</div>" : html;
						}
						if(k%2 == 1){
							filedHtml += "</div>";
						}
						filedHtml +=textareaHtml;
					}
					if(!fileds)
						return;
					$("#mapInfo_list #mapInfo").html(filedHtml+
							"<input type=\"hidden\" id=\"OBJECTID\" value=\""+objId+"\"/>");
					var moadl=$("#mapInfo_content #mapInfo_list");
					if(moadl && moadl instanceof Object){
						$("#myModalLabel_title").empty();
					    $("#myModalLabel_title").html("权属范围详情");
						$("#mapInfo_list").modal('show');
						for(k in atter.attributes){
							if(k == 'REPAIR_DAT' || k == 'FINISH_DAT'){//判断是否是日期字段
								var time = 0;
								if(atter.attributes[k] && atter.attributes[k]>0) time = atter.attributes[k];
								if($("#mapInfo #"+k)) $("#mapInfo #"+k).val(getCNLocalTime(time));
							}else{
								if($("#mapInfo #"+k)) $("#mapInfo #"+k).val(atter.attributes[k]);
							}
							
						}
						$('#mapInfo_list #mapInfo input').attr('readonly','readonly');
						$('#mapInfo_list #mapInfo textarea').attr('readonly','readonly');
					}
			     });
		  }
	  }
	  function doIdentify(event) {
		 //console.log(event.mapPoint.x+","+event.mapPoint.y);
		  var LayerMap = map.getLayer("gw_1");
		  if(LayerMap && LayerMap.visible){
			//map.infoWindow.setContent();
		    	map.infoWindow.hide();
		    	//查询点击信息框
				 identifyTask = new esri.tasks.IdentifyTask(gwurl_1); 
			     identifyParams = new esri.tasks.IdentifyParameters();// 查询参数
			     identifyParams.tolerance = 10;// 容差范围
			     identifyParams.returnGeometry = true;// 是否返回图形
			     identifyParams.layerIds = [ 0,1,2,3,4,5,6,7,8,9,10 ];// 查询图层
			     identifyParams.layerOption = esri.tasks.IdentifyParameters.LAYER_OPTION_VISIBLE;// 设置查询的图层
			     var symbol = new esri.symbol.SimpleFillSymbol(
			    		 	esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(
			    		 			esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255,0,0]), 2), new dojo.Color([255,255,0,0.5]));
			     // 查询范围
			     identifyParams.width = map.width;  
			     identifyParams.height = map.height;  
		        identifyParams.geometry = event.mapPoint;  
		        identifyParams.mapExtent = map.extent;  
		        identifyTask.execute(  
			        identifyParams,  
				        function(results) {  
				            var feature;  
				            var sGeometry; 
				            var graphic;
				            if(!results || results.length==0)
				            	return;
				            if(false){
				            	 feature = results[0].feature;
				            	 if(feature){
				                    feature.setSymbol(symbol);
				                    map.infoWindow.setTitle("标注信息");  
				                    map.infoWindow.setContent("<span>地区:</span>"  
				                                    + feature.attributes.行政区划
				                                    + "<br>"  
				                                    + "<span>机构:</span>"  
				                                    + feature.attributes.DATA_PROVI  
				                                    + "<br>"  
				                                    + "<span>站点:</span>"  
				                                    + results[i].layerName
				                                    + "<br>"  
				                                    + "<span>地址:</span>"  
				                                    + feature.attributes.地址);
				                    map.infoWindow.show(feature.geometry, map.getInfoWindowAnchor(feature.geometry));  
				                    map.infoWindow.show();  
				                    map.graphics.add(feature);
				            	 }
				            }else { 
				            	map.graphics.clear();  
				            	var point;
				                //var html = dataToHtml(results);
				                var texts="<div style=\"overflow-x: hidden;\"><ul class=\"meumul\">";
				                for ( var i = 0; i < results.length; i++) {  
				                    feature = results[i].feature;  
				                    feature.setSymbol(symbol);
				                    map.graphics.add(feature);
				                    if(i<6)
					                    texts+="<li class=\"meumli\" onclick=\"alertDatas('"+gwurl_1+"','"+results[i].layerId+"','"+feature.attributes.OBJECTID+"')\"><span>类型:"+results[i].layerName+"</span><br/>" +
					                    		"<span style='font-size:11px;'>标识码:"+feature.attributes.标识码+"</span></li>";
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
				            }  
				        }); 
		  }
	    } 
	pipelineSymbol=(new esri.symbol.SimpleLineSymbol()).setColor(new esri.Color("red")).setWidth(5);
    pipemarkerSymbol=(new esri.symbol.SimpleMarkerSymbol()).setColor(new esri.Color("red")).setSize(6).setOutline(pipelineSymbol);
    pipefillSymbol=(new esri.symbol.SimpleFillSymbol()).setOutline(pipelineSymbol);
}
//判断是否偶再政务内网
function isIntranet(){
	$.ajax({
		type : 'get',
		timeout : 3000,
		url: 'http://10.194.170.75/arcgis/rest/services/?f=pjson',
		dataType: 'json',
		success : function(data){
			if(data.services){
				//map.addLayer(createGW("http://10.194.170.75/arcgis/rest/services/GZSWPSGXOwnDept/MapServer"));
				map.addLayer(createGW(gwurl_1));
				isZwnw=true;
			}else{
				map.addLayer(createGW(gwurl_1));
			}
		},error:function(){// 不在政务内网
			// 加载管线
			map.addLayer(createGW(gwurl_1));
		}/*,complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
		　　　　if(status=='timeout'){//超时,status还有success,error等值的情况
			 	if(!map.getLayer("gw_1")){
			 		 map.addLayer(createGW(gwurl_1));
			 	}
		　　　　}
		　　}*/
	});
}
function dataToHtml(results){
	var rows = [];
	var html="<div class=\"form-group\">";
	rows = results.attributes;
	var i=0
	for(k in rows){
		if(i!=0 || i%2 != 0)
			html+="<label class=\"col-sm-3 control-label\">"+k+":</lable><span>"+rows[k]+"</span>";
		else
			html+="<div class=\"form-group\"><label class=\"col-sm-3 control-label\">"+k+":</lable><span>"+rows[k]+"</span></div>";
		i++;
	}
	html+="</div>";
	return html;
}
function in_array(stringToSearch, arrayToSearch) {
    for (s = 0; s < arrayToSearch.length; s++) {
     thisEntry = arrayToSearch[s];
     if (thisEntry == stringToSearch) {
      return true;
     }
    }
    return false;
}
function filedToHtml(row,layerId){
	var htmls="";
	if(row){
		var k = 0;
		for(i in row){
			if(!isZwnw && (layerId=="6" || layerId=="7")){//互联网的排水管道与沟渠，只显示类别
				if(row[i] =="类别"){
					var group = "<div class=\"form-group\">";
					var html="<label class=\"col-sm-2 control-label\">"+row[i]+"</label>" +
								"<div class=\"col-sm-4\"><input type=\"text\" class=\"form-control input-sm\" id=\""+i+"\"" +
										"name=\""+i+"\" /></div>";
					htmls +=group+html+"</div>";
				}/*else if(row[i] =="SORT"){
					var group = "<div class=\"form-group\">";
					var html="<label class=\"col-sm-3 control-label\">类别</label>" +
								"<div class=\"col-sm-3\"><input type=\"text\" class=\"form-control input-sm\" id=\""+i+"\"" +
										"name=\""+i+"\" /></div>";
					htmls +=group+html+"</div>";
				}*/
			}else{
				var html="";
				/*if(row[i] == "OBJECTID" || row[i] == "old_objectid" || row[i] == "flag_")
					continue;*/
				if(in_array(row[i],layers[parseInt(layerId)]))
					continue;
				var group = "<div class=\"form-group\">";
				html+="<label class=\"col-sm-2 control-label\">"+row[i]+"</label>" +
							"<div class=\"col-sm-4\"><input type=\"text\" class=\"form-control input-sm\" id=\""+i+"\"" +
									"name=\""+i+"\" /></div>";
				k++;
				if(k%2 == 1){
					html=group+html;
				}
				htmls += (k>=2 && k%2 == 0)? html+"</div>" : html;
			}
		}
	}
	return htmls;
}
/**
 * 弹出管网信息模态框
 * @params url 地图服务地址
 * @params layerId 图层id
 * @params objectId 
 * */
function alertDatas(url,layerId,objId){
	var query = new esri.tasks.Query();
	var queryTask= new esri.tasks.QueryTask(url+"/"+layerId);
	 query.outFields = ["*"];
	query.where = "OBJECTID="+objId;
	queryTask.execute(query,function(result){
		var atter = result.features[0];
		var fileds = result.fieldAliases;
		var filedHtml = filedToHtml(fileds,layerId);
		if(!fileds)
			return;
		$("#mapInfo_list #mapInfo").html(filedHtml+
				"<input type=\"hidden\" id=\"layerId\" value=\""+layerId+"\"/>"
				+"<input type=\"hidden\" id=\"OBJECTID\" value=\""+objId+"\"/>");
		var moadl=$("#mapInfo_content #mapInfo_list");
		if(moadl && moadl instanceof Object){
			$("#myModalLabel_title").empty();
		    $("#myModalLabel_title").html("详情");
			$("#mapInfo_list").modal('show');
			for(k in atter.attributes){
				if(k == 'REPAIR_DAT' || k == 'FINISH_DAT'){//判断是否是日期字段
					var time = 0;
					if(atter.attributes[k] && atter.attributes[k]>0) time = atter.attributes[k];
					if($("#mapInfo #"+k)) $("#mapInfo #"+k).val(getCNLocalTime(time));
				}else{
					if($("#mapInfo #"+k)) $("#mapInfo #"+k).val(atter.attributes[k]);
				}
				
			}
			$('#mapInfo_list #mapInfo input').attr('readonly','readonly');
			$('#mapInfo_list #mapInfo textarea').attr('readonly','readonly');
		}
     });
	 //map.setScale(25000);// 显示区域大小
}
//鼠标在地图上移动时
function mapMouseMove(e) {
    //动态显示当前坐标与比例尺
    var coorDiv = document.getElementById('coorDiv');
    coorDiv.innerHTML = 'x: ' + parseInt(e.mapPoint.x) + ',  y:  ' + parseInt(e.mapPoint.y) + '     比例 1:  ' + parseInt(map.getScale());
    //var scaleDiv = document.getElementById('scaleDiv');
    //scaleDiv.innerHTML = '比例    1:  ' + parseInt(map.getScale());
}
//管网 根据url区分  互联网还是政务网
function createGW(gwurl_1){
    var layer = new esri.layers.ArcGISDynamicMapServiceLayer(gwurl_1,{id:'gw_1'});
    //layer.setMaxScale(11);
    //layer.setMinScale(10000);
	var parentOrgName = $("#parentOrgArea").val(),parentOrgId=$("#parentOrgAreaId").val(),layerDefinitions=[];
	if(!parentOrgId){
		setTimeout(function(){map.addLayer(createGW(gwurl_1));},1500);
		return;
	}else{
		//获取当前登录账户，这个隐藏域在index.html中，填值方法在commom.js中
    	var userName=$("#userName").html();
    	if(parentOrgName.indexOf('广州市水务局') == -1 && userName.indexOf('gly') == -1){//全市和区管理员不用过滤
    		if(gwurl_1.indexOf('10.194.170.75') == -1 && parentOrgName.indexOf('净水')!=-1 ){//净水公司查看老六区
    			layerDefinitions[0] = "OWNERDEPT like '%天河%' or OWNERDEPT like '%越秀%' or OWNERDEPT like '%黄埔%' or OWNERDEPT like '%海珠%' or OWNERDEPT like '%荔湾%' or OWNERDEPT like '%白云%'"; //阀门 (0)
    			layerDefinitions[1] = "MANAGEDEPT like '%天河%' or MANAGEDEPT like '%越秀%' or MANAGEDEPT like '%黄埔%' or MANAGEDEPT like '%海珠%' or MANAGEDEPT like '%荔湾%' or MANAGEDEPT like '%白云%'"; //溢流堰 (1)
    			layerDefinitions[2] = "OWNERDEPT like '%天河%' or OWNERDEPT like '%越秀%' or OWNERDEPT like '%黄埔%' or OWNERDEPT like '%海珠%' or OWNERDEPT like '%荔湾%' or OWNERDEPT like '%白云%'"; //排放口 (2)
    			layerDefinitions[3] = "OWNERDEPT like '%天河%' or OWNERDEPT like '%越秀%' or OWNERDEPT like '%黄埔%' or OWNERDEPT like '%海珠%' or OWNERDEPT like '%荔湾%' or OWNERDEPT like '%白云%'"; //拍门 (3)
    			layerDefinitions[4] = "OWNERDEPT like '%天河%' or OWNERDEPT like '%越秀%' or OWNERDEPT like '%黄埔%' or OWNERDEPT like '%海珠%' or OWNERDEPT like '%荔湾%' or OWNERDEPT like '%白云%'"; //雨水口 (4)
    			layerDefinitions[5] = "OWNERDEPT like '%天河%' or OWNERDEPT like '%越秀%' or OWNERDEPT like '%黄埔%' or OWNERDEPT like '%海珠%' or OWNERDEPT like '%荔湾%' or OWNERDEPT like '%白云%'"; //窨井 (5)
    			layerDefinitions[6] = "DISTRICT like '%天河%' or DISTRICT like '%越秀%' or DISTRICT like '%黄埔%' or DISTRICT like '%海珠%' or DISTRICT like '%荔湾%' or DISTRICT like '%白云%'"; //排水管道 (6)
    			layerDefinitions[7] = "DISTRICT like '%天河%' or DISTRICT like '%越秀%' or DISTRICT like '%黄埔%' or DISTRICT like '%海珠%' or DISTRICT like '%荔湾%' or DISTRICT like '%白云%'"; //排水沟渠 (7)
    		}else if(gwurl_1.indexOf('10.194.170.75') == -1 && parentOrgName!=null){//互联网
    			layerDefinitions[0] = "OWNERDEPT='"+parentOrgName+"'"; //阀门 (0)
    			layerDefinitions[1] = "MANAGEDEPT='"+parentOrgName+"'"; //溢流堰 (1)
    			layerDefinitions[2] = "OWNERDEPT='"+parentOrgName+"'"; //排放口 (2)
    			layerDefinitions[3] = "OWNERDEPT='"+parentOrgName+"'"; //拍门 (3)
    			layerDefinitions[4] = "OWNERDEPT='"+parentOrgName+"'"; //雨水口 (4)
    			layerDefinitions[5] = "OWNERDEPT='"+parentOrgName+"'"; //窨井 (5)
    			layerDefinitions[6] = "DISTRICT='"+parentOrgName.substring(0,3)+"'"; //排水管道 (6)
    			layerDefinitions[7] = "DISTRICT='"+parentOrgName.substring(0,3)+"'"; //排水沟渠 (7)
    		}else{//政务网
    			layerDefinitions[6] = "PARENT_ORG_ID="+parentOrgId;
    			layerDefinitions[7] = "PARENT_ORG_ID="+parentOrgId;
        	}
    		layer.setLayerDefinitions(layerDefinitions);
    	}
    }
	return layer;
}
//电子底图
function createVec(){
	var layer = new esri.layers.ArcGISTiledMapServiceLayer(awater.url.url_vec[0],{id:awater.url.url_vec[1]});
	return layer;
}
//遥感底图
function createDitu(){
	var layer = new esri.layers.ArcGISTiledMapServiceLayer(awater.url.url_ditu[0],{id:awater.url.url_ditu[1],visible:false});
	return layer;
}


/*************************************/
//获取指定要素的信息框样式
/*function getInfoWindowContent(feature, key) {
	if(key==null) return;
    var graJson = feature.toJson();
    var attr = feature.attributes;
    var title = layerConfiguration.dissertation[key].name;
    
    if (title == null) {
        title = "";
    }
    if (title.replace(/(^\s*)|(\s*$)/g, "") == "") {
        title = "";
    }

    var infoContent = "";
    //判断key是否为720数据
    if (key == 'quanjingtu') {
    	infoContent += "<a href='#' onclick='show720(\""+feature.attributes["NAME"]+"\",\""+feature.attributes[layerConfiguration.dissertation[key].outFields[2]]+"\")'>切换720全景视图</a>"
        title +="-"+ feature.attributes["NAME"];
    }
    else if (key == "interestPoint") {//如果为兴趣点图层
        map.selectedInterestPoint = feature;
        var interestName = feature.attributes['NAME'];
        var interestRemark = feature.attributes['REMARK'];
        if (interestName == null) {
            interestName = "";
        }
        if (interestRemark == null) {
            interestRemark = "";
        }
        infoContent += "<div style='height:10%'><input id = 'divInterestId' style='display:none' value ='" + feature.attributes['OBJECTID'] + "'></input><p>兴趣点名称：</p><input id = 'info_interestPointName' type='text' value = '" + interestName + "' readonly='readonly' style = 'width:100%'></input></div><div style='height:90%'><div>备注：</div><textarea id = 'info_interestPointRemark' style='width:100%;height:90%;' readonly='readonly'>" + interestRemark + "</textarea><div style='width:100%'><input type='button' value = '修改' onclick = 'enableEdit()'></input><input type='button' value = '保存' onclick='saveInterestPointEdit()'></input><input type='button' value = '删除' onclick='deleteInterestPoint()'></input></div></div>";
    }
    else if (key == "wurenjixunfei") {

        infoContent += "<a href='#' onclick='showVideoWindow(\"" + feature.attributes["NAME"] + "\",\"" + feature.attributes[layerConfiguration.dissertation[key].outFields[1]] + "\")'>查看无人机巡飞视频</a>"
        title += "-" + feature.attributes["NAME"];

        //infoContent += "<a href='videoPage.html?key=" + feature.attributes[layerConfiguration.dissertation[key].outFields[1]] + "' target='_blank'>查看河涌视频</a>"
        //title += "-" + feature.attributes["NAME"];
    }
    else {
        infoContent += "<table class='customTable2'  cellspacing='0' style='width:100%;border-collapse:collapse;'>";
        //获取图层的配置
        var displayFields = layerConfiguration.dissertation[key].displayFields;
        var outFields = layerConfiguration.dissertation[key].outFields;
        for (var i = 0; i < displayFields.length; i++) {
            var valueAttr = graJson.attributes[outFields[i]];
            if (valueAttr == null || valueAttr == undefined) {
                valueAttr = "";
            }
            if(typeof valueAttr === 'number'){
            	valueAttr = parseInt(valueAttr*100)/100;
            }
            //var valueFloat = parseFloat(valueAttr.toString());
            //if(valueFloat!=null) valueAttr = parseInt(valueAttr*100)/100;
            infoContent += "<tr><td width='50%' class='left_row' style='text-align:center'>" + displayFields[i] + "</td><td width='50%' class='right_row' style='text-align:center'>" + valueAttr + "</td></tr>";
        }
        infoContent += "</table>";
    }
    //map.infoWindow.setTitle(title);
    //map.infoWindow.setTitle(title+"("+(map.infoWindow.selectedIndex+1)+"/"+map.infoWindow.count+")");
    if(map.infoWindow.count>1){
    	map.infoWindow.setTitle(title+"       (点击右侧箭头切换至下一个)");
    }
    else{
    	map.infoWindow.setTitle(title);
    }
    map.infoWindow.setContent(infoContent);
}*/
//初始化各个工具
function initTools() {
    require([
	   "esri/map",
	   "custom/MeasureTools",
       "esri/toolbars/navigation",
       "esri/toolbars/draw",
       "esri/layers/FeatureLayer",
       "esri/dijit/Legend",
       "dojo/_base/array",
       "dojo/parser",
       "dijit/layout/BorderContainer",
       "dijit/layout/ContentPane",
       "dijit/layout/AccordionContainer",
	   "dojo/domReady!"
    ], function (
		Map, deMeasureTools, Navigation, Draw, FeatureLayer, Legend, arrayUtils, parser
	  ) {
        //初始化测量工具
        var measureTool = new deMeasureTools({
            map: map
        }, "measureTools");


         //导航工具
        var navToolbar = new Navigation(map);
        map.NavToolbar = navToolbar;//用于在其他地方调用，例如在测量面积时，先禁用导航工具
        document.getElementById("tool_suoxiao").onclick = function () {
            measureTool.toolbar.deactivate();
            drawTool.deactivate();
            isClickQuery=false;
            navToolbar.activate(Navigation.ZOOM_OUT);
            map.setMapCursor("url(plugins/hplus/images/suoxiao_btn_hover.png),auto");
            return false;
        };
        document.getElementById("tool_fangda").onclick = function () {
            measureTool.toolbar.deactivate();
            drawTool.deactivate();
            isClickQuery=false;
            navToolbar.activate(Navigation.ZOOM_IN);
            map.setMapCursor("url(plugins/hplus/images/fangda_btn_hover.png),auto");
            return false;
        };
        document.getElementById("tool_pingyi").onclick = function () {
            measureTool.toolbar.deactivate();
            drawTool.deactivate();
            isClickQuery=false;
            navToolbar.activate(Navigation.PAN);
            map.setMapCursor("url(plugins/hplus/images/pingyi_btn_hover.png),auto");
            return false;
        };

        //初始化清除选择
        document.getElementById("tool_qingchu").onclick = function () {
            navToolbar.deactivate();//停止缩放工具以及测量工具，以免冲突
            measureTool.toolbar.deactivate();
            drawTool.deactivate();
            isClickQuery=true;//恢复点击查询
            map.graphics.clear();
            //移除临时图层
            var addedGraLyr = map.getLayer("tempGraphic");
			if(addedGraLyr!=null){
				map.removeLayer(addedGraLyr);
			}
			var addedLabelLyr = map.getLayer("tempLabel");
			if(addedLabelLyr!=null){
				map.removeLayer(addedLabelLyr);
			}
            map.setMapCursor("url(plugins/hplus/images/identify_pointer.png),auto");
			return false;
        };
        
        document.getElementById("tool_query").onclick = function () {
            navToolbar.deactivate();//停止缩放工具以及测量工具，以免冲突
            measureTool.toolbar.deactivate();
            isClickQuery=true;
            map.setMapCursor("url(plugins/hplus/images/identify_pointer.png),auto");
            return false;
        };
        
        //初始化拉框查询
        var drawTool = new Draw(map);
        //drawTool.on("draw-end", extentQuery);
        document.getElementById("tool_extentquery").onclick = function () {
            map.DrawTool = drawTool;
            navToolbar.deactivate();//停止缩放工具以及测量工具，以免冲突
            measureTool.toolbar.deactivate();
            isClickQuery=false;
            map.setMapCursor("url(plugins/hplus/images/kuangxuan_btn_hover.png),auto");
            drawTool.activate(Draw.EXTENT);
        };
        
        //添加编辑工具，兴趣点编辑
        //定义用于新增兴趣点的绘制工具
        /*var addInterestTool = new Draw(map);
        addInterestTool.on("draw-end", addInterestToMap);
        document.getElementById("interest_manager").onclick = function () {
            isDrawing = true;
            map.DrawTool = addInterestTool;
            navToolbar.deactivate();//停止缩放工具以及测量工具，以免冲突
            drawTool.deactivate();
            measureTool.toolbar.deactivate();
            addInterestTool.activate(Draw.POINT);
        };*/
        //初始化图例控件
        var layers = new Array();
        
       /* if(layerConfiguration){
	        for (var key in layerConfiguration.dissertation) {
        	//for (var key=0;key<layerConfiguration.dissertation.length;key++) {	
	            var tempLayer = new esri.layers.FeatureLayer(layerConfiguration.dissertation[key].url, { outFields: '*' });
	            tempLayer.name = layerConfiguration.dissertation[key].name;
	            layers.push(tempLayer);
	        }
	    }*/

        var layerInfo = arrayUtils.map(layers, function (layer, index) {
            return { layer: layer, title: layer.name };
        });

        if (layerInfo.length > 0) {
            var legendDijit = new Legend({
                map: map,
                layerInfos: layerInfo
            }, "divLegendWindow");
            legendDijit.startup();
        }
    });
}
//矩形查询
/*function extentQuery(e) {
    //清空地图绘制的元素
    map.graphics.clear();
    //清空结果窗口
    $('#divExtentResult').html('');
    $("#extentResultTitle").html('');

    $("#extentResultInfo").html('');

    firstTab = true;
    isHasResult=false;
    $("#search-clear-btn").show();
    //先把矩形绘制上地图
    var recSymb = new esri.symbol.SimpleFillSymbol(
          esri.symbol.SimpleFillSymbol.STYLE_NULL,
          new esri.symbol.SimpleLineSymbol(
            esri.symbol.SimpleLineSymbol.STYLE_SHORTDASHDOTDOT,
            new dojo.Color([105, 105, 105]),
            2
          ), new dojo.Color([255, 255, 0, 0.25])
        );
    //根据selectedKey查询
    //如果选择的图层都为空，则在全部图层中根据范围查找，暂时不做
    if (selectKey == '') {
        //使用该范围查询
        for (var key in layerConfiguration.dissertation) {
            //spatialQuery(e.geometry, key);
        }
    }
    else {
        //spatialQuery(e.geometry, selectKey);
    }

    //使用该范围查询
    for (var key in layerConfiguration.dissertation) {
        //spatialQuery(e.geometry, key);
    }

    //显示信息框
    map.graphics.add(new esri.Graphic(e.geometry, recSymb));
    map.DrawTool.deactivate();
    map.setMapCursor("url(plugins/hplus/images/identify_pointer.png),auto");
    isClickQuery=true;
}
//初始化
function initExtentTabContent(features,key,length) {
    //获取面板标题内容
    var titleHtml = "<li class=\"active\" style=\"background: transparent;\"><a id=\"tab_Chart\" href=\"#" + key + "\" style=\"background: transparent;\"><font color=\"black\">" + layerConfiguration.dissertation[key].name + "(" + length + ")</font></a></li>";

    //获取面板内容
    var div = initSearchResultContent(features, key);

    var resulthtml = "<div id=\"" + key + "\" class=\"tab_content\" style=\"display:" + firstTab + ";width:100%;max-height:260px;overflow-y:auto\"></div>";
    firstTab = 'none';

    $("#extentResultTitle").append(titleHtml);

    $("#extentResultInfo").append(resulthtml);

    $("#" + key).append(div);
    $("#" + key).mCustomScrollbar("update");

    initTabContent(false);
}
//空间查询
function spatialQuery(extent, key) {
    var query = new esri.tasks.Query();
    query.outFields = layerConfiguration.dissertation[key].outFields; // 名称 like '%B%'
    query.geometry = extent;
    query.returnGeometry = true;
    var tempLayer = new esri.layers.FeatureLayer(layerConfiguration.dissertation[key].url, { outFields: layerConfiguration.dissertation[key].outFields, id: key });
    tempLayer.queryFeatures(query, function (featureSet) {
        initSearchContentBox(featureSet.features,key);

		if (features.length > 0) {

            $('#extentResultWindow').show();

            //在结果面板生成tab
            //只在面板上显示10个要素，所以先取出前10个要素
            var tempFeatures = new Array();
            if (features.length > 10) {
                tempFeatures = features.slice(0, 10);
            }
            else {
                tempFeatures = features;
            }
            //如果length>=1000，则重新查询一个总个数
            if (features.length >= 1000) {

                var queryTask = new esri.tasks.QueryTask(layerConfiguration.dissertation[key].url);

                queryTask.executeForCount(query, function (count) {

                   // initExtentTabContent(tempFeatures, key, count);

                }, function (error) {
                    console.log(error);
                });

            }
            else {
                //initExtentTabContent(tempFeatures, key, features.length);
            }

            for (var i = 0; i < features.length; i++) {
                var type = features[i].geometry.type;
                var graphicsPnt;
                //如果为点类型，则直接作为标注的位置
                //如果为线类型或者多边形，则找出范围类x最大的点，作为标注点，以免标注位置超出拉框的范围
                if (type == "point") {
                    graphicsPnt = features[i].geometry;
                }
                else if (type == "polyline") {
                    var polyline = features[i].geometry;
                    graphicsPnt = getMaxXPoint(polyline, extent);//获取范围内x最大的点
                }
                else if (type == "polygon") {
                    var polygon = features[i].geometry;
                    graphicsPnt = getMaxXPoint(polygon, extent);//获取范围内x最大的点
                }
                else {
                    break;
                }
                //图片样式
                var pictureMarkerSymbol = new esri.symbol.PictureMarkerSymbol('plugins/hplus/img/Thumbtack.png', 30, 30).setOffset(15,15);
                var tempGraphic = new esri.Graphic(graphicsPnt, pictureMarkerSymbol)
                map.graphics.add(tempGraphic);
                //添加标注
                //先获取显示的名称
                var titleField = layerConfiguration.dissertation[key].titleField;
                var title = features[i].attributes[titleField];
                var textSymbol = new esri.symbol.TextSymbol(title).setColor(
                    new esri.Color([128, 0, 0])).setAlign(esri.symbol.Font.ALIGN_END).setAngle(0).setFont(
                    new esri.symbol.Font("12pt").setWeight(esri.symbol.Font.WEIGHT_BOLD)).setOffset(15, 35);
                var labelGraphic = new esri.Graphic(graphicsPnt, textSymbol);
                map.graphics.add(labelGraphic);
            }
        }
    });
}*/
//获取几何图形，x值最大的点
function getMaxXPoint(geometry, extent) {
    //先把所有点放到数组中
    var points = new Array();
    if (geometry.type == 'point') {//点直接返回
        return geometry;
    }
    else if (geometry.type == 'polyline') {
        var polyline = geometry;
        for (var z = 0; z < polyline.paths.length; z++) {
            for (var j = 0; j < polyline.paths[z].length; j++) {
                var vertex = new esri.geometry.Point(polyline.paths[z][j][0], polyline.paths[z][j][1], polyline.spatialReference);
                points.push(vertex);
            }
        }
    }
    else if (geometry.type == 'polygon') {
        var polygon = geometry;
        for (var z = 0; z < polygon.rings.length; z++) {
            for (var j = 0; j < polygon.rings[z].length; j++) {
                var vertex = new esri.geometry.Point(polygon.rings[z][j][0], polygon.rings[z][j][1], polygon.spatialReference);
                points.push(vertex);
            }
        }
    }

    var tempPnt;
    //有范围限制时
    if (extent != null) {
        for (var i = 0; i < points.length; i++) {
            //判断该点是否在extent这个范围内
            if (points[i].x <= extent.xmax && points[i].x >= extent.xmin && points[i].y <= extent.ymax && points[i].y >= extent.ymin) {
                if (tempPnt == null) {
                    tempPnt = points[i];
                }
                else {
                    if (points[i].x > tempPnt.x) {
                        tempPnt = points[i];
                    }
                }
            }
        }
    }
    else {
        for (var i = 0; i < points.length; i++) {
            if (tempPnt == null) {
                tempPnt = points[i];
            }
            else {
                if (points[i].x > tempPnt.x) {
                    tempPnt = points[i];
                }
            }
        }
    }
    return tempPnt;
}
//显示720数据
function show720(title,url) {
    layer.open({
		type: 2,
		title: title,
		maxmin: true,
		area: ['100%', '100%'],  
                skin:'layui-layer-lan',
	        shade: 0,
		content: "data/720/" + url
	});

    //var frame = $("#iframe720");
    //frame.attr("src", "data/720/" + url);
    //frame.show();
    //return map;
}
function showVideoWindow(title,url) {
    //document.getElementById("popupVideoWindow").style.display = "block";//隐藏统计面板
    //document.getElementById("videoTitle").innerText = title;
    //var videoControl = document.getElementById('videoControl');
    //videoControl.src = "data/Media/WRJXF1/" + url;
    layer.open({
		type: 2,
		title: title,
		maxmin: true,
		area: ['55%', '80%'],  
                skin:'layui-layer-lan',
	        shade: 0,
		content: 'videoPage.html?videoUrl=data/Media/WRJXF1/' + url
	});
    /*var html='<video id="videoControl" controls="controls" style="width: 98%; height: 95%; margin-left: 1%; margin-top: 1px; object-fit: fill" src ="data/Media/WRJXF1/'+ url +'"></video>';
    $("#videoTitle").parent().append(html);*/
}
function changeLayerVisible(layerId,com,selectedStyle,unSelectedStyle){
	var layer = map.getLayer(layerId);
	if(layer!=null){
    	layer.setVisibility(!layer.visible);
    	if(layer.visible==true){
    		$(com).addClass(selectedStyle).removeClass(unSelectedStyle);
    	}
    	else{
    		$(com).addClass(unSelectedStyle).removeClass(selectedStyle);
    	}
	}
}
function changeBaseMap(baseMapId){
    var ditu = map.getLayer("DiTu");
	var yingxiang = map.getLayer("WeiXingYingXiang");
	var dem = map.getLayer("DemYingXiang");
	var yingxiangggw = map.getLayer("WeiXingYingXiangGGW");
    switch (baseMapId) {
        case "DiTu":
        	ditu.setVisibility(true);
        	
        	$("#standard-map-icon").addClass("standard-map-selected-icon").removeClass("standard-map-icon");
        	$("#satellite-map-icon").addClass("satellite-map-icon").removeClass("satellite-map-selected-icon");
        	$("#dem-map-icon").addClass("image-map-icon").removeClass("image-map-selected-icon");
        	$("#satellite-map-ggw-icon").addClass("satellite-map-icon").removeClass("satellite-map-selected-icon");

        	yingxiang.setVisibility(false);
        	dem.setVisibility(false);
        	yingxiangggw.setVisibility(false);
            break;
        case "WeiXingYingXiang":
        
        	$("#standard-map-icon").addClass("standard-map-icon").removeClass("standard-map-selected-icon");
        	$("#satellite-map-icon").addClass("satellite-map-selected-icon").removeClass("satellite-map-icon");
        	$("#dem-map-icon").addClass("image-map-icon").removeClass("image-map-selected-icon");
        	$("#satellite-map-ggw-icon").addClass("satellite-map-icon").removeClass("satellite-map-selected-icon");
        
            ditu.setVisibility(false);
        	yingxiang.setVisibility(true);
        	dem.setVisibility(false);
        	yingxiangggw.setVisibility(false);
            break;
        case "DemYingXiang":
        	
        	$("#standard-map-icon").addClass("standard-map-icon").removeClass("standard-map-selected-icon");
        	$("#satellite-map-icon").addClass("satellite-map-icon").removeClass("satellite-map-selected-icon");
        	$("#dem-map-icon").addClass("image-map-selected-icon").removeClass("image-map-icon");
        	$("#satellite-map-ggw-icon").addClass("satellite-map-icon").removeClass("satellite-map-selected-icon");
        
            ditu.setVisibility(false);
        	yingxiang.setVisibility(false);
        	dem.setVisibility(true);
        	yingxiangggw.setVisibility(false);
        	break;
        case "WeiXingYingXiangGGW":
        
        	$("#standard-map-icon").addClass("standard-map-icon").removeClass("standard-map-selected-icon");
        	$("#satellite-map-icon").addClass("satellite-map-icon").removeClass("satellite-map-selected-icon");
        	$("#dem-map-icon").addClass("image-map-icon").removeClass("image-map-selected-icon");
        	$("#satellite-map-ggw-icon").addClass("satellite-map-selected-icon").removeClass("satellite-map-icon");
        
            ditu.setVisibility(false);
        	yingxiang.setVisibility(false);
        	dem.setVisibility(false);
        	yingxiangggw.setVisibility(true);
        	break;
    }
}
//定位设施
function openQuerys(objId,layerId){
	if(objId && layerId){
        map.graphics.clear();
        var symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255,0,0]), 2),new dojo.Color([125,255,125,0.35]));
        var query = new esri.tasks.Query();
		var queryTask= new esri.tasks.QueryTask(gwurl_1+"/"+layerId);
		query.returnGeometry=true;
		query.outFields = ["*"];
		//query.outSpatialReference = {wkid:2435}
		query.where = "OBJECTID="+objId;
		var rExtent = new esri.geometry.Extent();
		var point;
		queryTask.execute(query,function(results){
            for ( var i = 0; i < results.features.length; i++) { 
                var feature = results.features[i];  
                //var point = feature.geometry.getExtent().getCenter(); 
                feature.setSymbol(symbol);
                var geometr =results.features[0].geometry;
                centerAtGeometrys(geometr);
            }
		});
	}
}
function openQuerysUsid(usid,url,queryResultLayer){
	if(usid && url){
        map.graphics.clear();
        var symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255,0,0]), 2),new dojo.Color([125,255,125,0.35]));
        var query = new esri.tasks.Query();
		var queryTask= new esri.tasks.QueryTask(url);
		query.returnGeometry=true;
		query.outFields = ["*"];
		query.where = "USID='"+usid+"'";
		var rExtent = new esri.geometry.Extent();
		var point;
		queryTask.execute(query,queryResultLayer);
	}
}

function openQueryslayerId(usid,layerId,queryResultLayer){
	if(usid && layerId){
        map.graphics.clear();
        var symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255,0,0]), 2),new dojo.Color([125,255,125,0.35]));
        var query = new esri.tasks.Query();
		var queryTask= new esri.tasks.QueryTask(gwurl_1+"/"+layerId);
		query.returnGeometry=true;
		query.outFields = ["*"];
		query.where = "USID='"+usid+"'";
		var rExtent = new esri.geometry.Extent();
		var point;
		queryTask.execute(query,queryResultLayer);
	}
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
//根据objectId定位
function positionObjId(objId){
	var query = new esri.tasks.Query();
	var queryTask= new esri.tasks.QueryTask(awater.url.url_report[0]+"/0");
	query.outFields = ["*"];
	query.where = "OBJECTID="+objId;
	queryTask.execute(query,function(result){
		if(!result || result.features.length==0)
         	return;
		var feature=result.features[0];
		positPoint(feature.attributes.X,feature.attributes.Y);
		var reportType=feature.attributes.REPORT_TYPE;
		var texts="<div style=\"overflow-x: hidden;\"><ul class=\"meumul\">";
		texts+="<li class=\"meumli\" onclick=\"alertMapOpenLayer('"+feature.attributes.REPORT_TYPE+"','"+feature.attributes.OBJECTID+"')\"><span>类型:"+feature.attributes.LAYER_NAME+"</span><br/>" +
    	"<span style='font-size:11px;'>上报类型:"+(reportType=='modify'?'数据校核':'数据新增')+"</span><br/><span style='font-size:11px;'>上报时间:"+getLocalTime(feature.attributes.MARK_TIME)+"</span></li>";
		texts+="</ul></div>";
		//设置宽度和高度
        map.infoWindow.resize(240,200);
        map.infoWindow.setTitle("基本信息");  
        map.infoWindow.setContent(texts);
        map.infoWindow.show(new esri.geometry.Point(feature.attributes.X,feature.attributes.Y,map.spatialReference));
	});
}
//权属范围根据objectId定位
function positionByObject(objId){
	var query = new esri.tasks.Query();
	var queryTask= new esri.tasks.QueryTask(qsfw_tc);
	query.outFields = ["*"];
	query.where = "OBJECTID="+objId;
	query.returnGeometry=true;
	queryTask.execute(query,function(result){
		if(!result || result.features.length==0)
         	return;
		var feature=result.features[0];
		map.graphics.clear();
		var sGeometry = feature.geometry;//获取图形  
	    var centerPoint = sGeometry.getCentroid();//获取多边形中心点  
	    var cPoint = new esri.geometry.Point();  
	    cPoint.x = centerPoint.x;  
	    cPoint.y = centerPoint.y;
	    map.setZoom(8);
	    map.centerAt(cPoint);
	    var sfs = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,
	    	    new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASHDOT,
	    	    new esri.Color([255,0,0]), 2),new esri.Color([255,255,0,0.25])
	    	  );
	    var graphic = new esri.Graphic(sGeometry, sfs);  
	    map.graphics.add(graphic); 
	});
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
			var symbol1 = new esri.symbol.PictureMarkerSymbol("img/ic_add_facility_door.png", 21, 28);
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
          },500);
       },500);
       },500);
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
// 跟据图层id查询所有的设施信息
function querysData(url,layerId,whereText,quertResult){
    var query = new esri.tasks.Query();
	var queryTask= new esri.tasks.QueryTask((url? url:gwurl_bc)+"/"+layerId);
	query.returnGeometry=true;
	query.outFields = ["*"];
	//query.outSpatialReference = {wkid:2435}
	if(whereText)
		query.where = whereText;//"1=1 and REPAIR_DAT is not null";
	queryTask.execute(query,quertResult);
}
//修补测
function openQueryslayerId(objectid,layerId,queryResultLayer){
	if(objectid && layerId){
        var query = new esri.tasks.Query();
		var queryTask= new esri.tasks.QueryTask(gwurl_bc+"/"+layerId);
		query.returnGeometry=true;
		query.outFields = ["*"];
		query.where = "OBJECTID='"+objectid+"'";
		var rExtent = new esri.geometry.Extent();
		var point;
		queryTask.execute(query,queryResultLayer);
	}
}
/*******************end******************/


/**********************************以下为排水防涝前台配置*****************************/
function mapLoadHandler(){
	window.setInterval("refreshgraphic()",30000); 
}

function refreshgraphic(){
	$.each(map.graphicsLayerIds,function(index,item){
		if(item&&item.indexOf("ssjk")!=-1&&map.getLayer(item).visible==true){
			for (var i=0;i<graphicsNNArr.length;i++){
				if(graphicsNNArr[i].id == item)
					graphicsNNArr.remove(i);
			}
			map.removeLayer(map.getLayer(item));
			getMonitorStationByEstType(item);
		}
	});
}
Array.prototype.remove = function (dx) {
    if (isNaN(dx) || dx > this.length) { return false; }
    for (var i = 0, n = 0; i < this.length; i++) {
        if (this[i] != this[dx]) {
            this[n++] = this[i]
        }
    }
    this.length -= 1
} 
function toDecimal2(x){  
        var f = parseFloat(x);  
        if (isNaN(f)) {  
            return false;  
        }  
        var f = Math.round(x*100)/100;  
        var s = f.toString();  
        var rs = s.indexOf('.');  
        if (rs < 0) {  
            rs = s.length;  
            s += '.';  
        }  
        while (s.length <= rs + 2) {  
            s += '0';  
        }  
        return parseFloat(s);  
}   

//添加定位按钮
function addLocationButton() {
    var geoLocate = new esri.dijit.LocateButton({
        map: map
    }, "LocateButton");
    geoLocate.startup();
}

//添加比例尺
function addScalebar() {
    var scalebar = new esri.dijit.Scalebar({
        map: map,
        attachTo: 'bottom-left',
        scalebarUnit: "dual"
    });
}

function addClickPosition(){
	map.on("click", function(e){
		//console.log(e.mapPoint.x+","+e.mapPoint.y);
	});
}

//添加HOME键
function addHomeButton() {
    var home = new esri.dijit.HomeButton({ map: map }, "HomeButton");
    home.startup();
}

function createGTWMTSLayer(){
	var layer = new tdt.SuperMapLayer({id: "GTWMTS" });
	layer.setOpacity(.60);
    return layer;
}

function createGTBZWMTSLayer(){
	var layer = new tdt.SuperMapBZLayer({id: "GTBZWMTS" });
    //layer.setOpacity(.60);
    return layer;
}
function createGTWMTSImgLayer(){
	var layer = new tdt.SuperMapImgLayer({id: "GTWMTSImg" });
	layer.setOpacity(.75);
	
   	var swipeWidget = new esri.dijit.LayerSwipe({
		type: "vertical", 
       	map: map,
       	layers: [layer]
    }, "swipeDiv");
    swipeWidget.left=0;
    swipeWidget.startup();
    return layer;
}

//创建地图
function createVECLayer(){
    var layer = new tdt.TDTLayer("vec");
    layer.setOpacity(.60);
    return layer;
}
//创建地图
function createCVALayer(){
    var layer = new tdt.TDTLayer("cva");
    layer.setOpacity(.60);
    return layer;
}
function getFeatureLayerAlias(fl,name) { 
    var fields=fl.fields;
    for (var i = 0; i < fields.length; i++) {
        if (fields[i].name == name) 
        return fields[i].alias;
    }
}

function pipeOverHandler(g) {
    var graphic = g.graphic;
    var sls = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new esri.Color([0, 0, 255]), 3);
    graphic.setSymbol(sls);
}

function pipeOutHandler(g) {
    var graphic = g.graphic;
    var sls = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new esri.Color([0, 0, 255]), 3);
    graphic.setSymbol(null);
}

function setbjdemo(){
	for (i in graphicsNNArr){
		var graphic = graphicsNNArr[i].graphics;
		if(graphicsNNArr[i].id=="nh") {
			var symbol = new esri.symbol.PictureMarkerSymbol("nnwaterSystem/temp_icon/ico/swz.png", 12, 12);
			graphic[0].setSymbol(symbol);
				graphicsNNArr[i].refresh();
		}
		if(graphicsNNArr[i].id=="yl") {
			var symbol = new esri.symbol.PictureMarkerSymbol("nnwaterSystem/temp_icon/ico/ylz.png", 12, 12);
			if(graphic.length>0){
				graphic[0].setSymbol(symbol);
				graphicsNNArr[i].refresh();
			}
		}
		if(graphicsNNArr[i].id=="sw") {
			var symbol = new esri.symbol.PictureMarkerSymbol("nnwaterSystem/temp_icon/ico/swz.png", 12, 12);
			if(graphic.length>0){
				graphic[0].setSymbol(symbol);
				graphicsNNArr[i].refresh();
			}
		}
		if(graphicsNNArr[i].id=="bz") {
			var symbol = new esri.symbol.PictureMarkerSymbol("nnwaterSystem/temp_icon/ico/bz2.png", 12, 12);
			if(graphic.length>0){
				graphic[0].setSymbol(symbol);
				graphicsNNArr[i].refresh();
			}
		}
	}
}
function monitorLegend() {
    dojo.query('input[name="jclayer"]').on("change", function (e) {
        var value = e.currentTarget.value;
        var isCheck = e.currentTarget.checked;
        map.getLayer(value).setVisibility(isCheck);
    });
}

//在地图上显示站点
/*function showStationOnMap(stations) {
    // 设置显示中心点及坐标
    var location = new esri.geometry.Point(stations[0].longtitude, stations[0].latitude, map.spatialReference)
    // 逐个添加元素
    for (var s = 0; s < stations.length; s++) {
        var symbol = new esri.symbol.PictureMarkerSymbol(stations[s].imageUrl, 12, 12);
        var pt = new esri.geometry.Point(stations[s].longtitude, stations[s].latitude, map.spatialReference)
        // 每个元素的属性值     
        //var attr = { "stationName": stations[s].stationName, "sId": stations[s].sId,"value": stations[s].value,"time":stations[s].time};   
        // 点击该元素时的信息窗  
        var infoTemplate = new esri.InfoTemplate(stations[s].stationName,
        '<iframe src="./gzps/pump/jishuidian.html" frameborder="no" border="0" marginwidth="0" marginheight="0" scrolling="no" width="850" height="500"></iframe>');
        map.infoWindow.resize(900, 520);
        var graphic = new esri.Graphic(pt, symbol, null, infoTemplate);
        map.graphics.add(graphic);
        graphicsArr[s] = graphic;
    }
}*/

//在地图上remove掉站点
function removeStationOnMap() {
    var len = graphicsArr.length;
    for (var k = 0; k < len; k++) {
        map.graphics.remove(graphicsArr[k]);
    }
}

//全选
/*function legendCheckAll() {
    var isCheck = $("input[name='layall']").attr("checked");
    if (isCheck != "checked") {
        $("input[name='jclayer']").attr("checked", true);
    } else {
        $("input[name='jclayer']").removeAttr("checked");
    }
}*/

function getGraphicbyCode(code){
	for (i in graphicsNNArr){
		if(graphicsNNArr[i].id=="bj"){
			var graphic = graphicsNNArr[i].graphics;
			for (j in graphic){
				if(graphic[j].attributes.title!=null&&graphic[j].attributes.title==code)
					return graphic[j]; 
			}
		}
	}
	return null;
}
/**
 * 显示图层
 * @param type
 */
function showLayer(isShow,type){
	for (i in graphicsNNArr){
		if(graphicsNNArr[i].id==type){
			graphicsNNArr[i].setVisibility(isShow);
			map.graphics.clear();
		}
	}
}

/**
 * 定位
 * @param x
 * @param y
 * @param zoom
 */
function locationPoint(x,y,zoom){
	clearGraphicLayer("highlightLayer");
	var point=new esri.geometry.Point(x,y);
	if(zoom){
		map.centerAndZoom(point,zoom);
	}else{
		map.centerAt(point);
	}	
	createGraphic("highlightLayer",x,y,"img/info.gif",20,20);
}

function dynamicLayerData(obj){
	var layer=map.getLayer("dis").setDefinitionExpression("FID = "+obj.fid);
	map.getLayer("dis").show();
}  
/**
 * 新建Graphic
 * @param graphicLayerId
 * @param x
 * @param y
 * @param iconUrl
 * @param iconW
 * @param iconH
 */
function createGraphic(graphicLayerId,x,y,iconUrl,iconW,iconH){
	var graphicLayer=null;
	if(map.getLayer(graphicLayerId)){
		graphicLayer=map.getLayer(graphicLayerId);
	}else{
		graphicLayer=new esri.layers.GraphicsLayer({id:graphicLayerId});
	}
	map.addLayer(graphicLayer,2);
	var point=new esri.geometry.Point(x,y);
	var symbol=new esri.symbol.PictureMarkerSymbol(iconUrl, iconW, iconH);
	var graphic=new esri.Graphic(point, symbol)
	graphicLayer.add(graphic);
}

/**
 * 清空GraphicLayer
 * @param graphicLayerId
 */
function clearGraphicLayer(graphicLayerId){
	var graphicLayer=null;
	if(map.getLayer(graphicLayerId)){
		graphicLayer=map.getLayer(graphicLayerId);
		graphicLayer.clear();
	}else{
		//graphicLayer=new esri.layers.GraphicLayer(id:graphicLayerId});
	}
}
//设置显示矢量地图隐藏影像图
function displaySLLayer(){
	/*if(location.hostname.indexOf("180.140.190.209")==-1){
		var GTSLlayer=map.getLayer("GTWMTS");
		GTSLlayer.show();
		var GTBZlayer=map.getLayer("GTBZWMTS");
		GTBZlayer.show();
		var GTImglayer=map.getLayer("GTWMTSImg");
		GTImglayer.hide();
	} else {
		var SLlayer=map.getLayer("vec");
		SLlayer.show();
		var SLBZlayer=map.getLayer("cva");
		SLBZlayer.hide();
	}*/
}
//设置显示影像图隐藏矢量地图
function displayYXLayer(){
	/*if(location.hostname.indexOf("180.140.190.209")==-1){
		var GTSLlayer=map.getLayer("GTWMTS");
		GTSLlayer.hide();
		var GTBZlayer=map.getLayer("GTBZWMTS");
		GTBZlayer.hide();
		var GTImglayer=map.getLayer("GTWMTSImg");
		GTImglayer.show();
	} else {
		var SLlayer=map.getLayer("vec");
		SLlayer.hide();
		var SLBZlayer=map.getLayer("cva");
		SLBZlayer.show();
	}*/
}

function AutoClickLenged(est_type){
	var treeObj = $.fn.zTree.getZTreeObj("treeLegend");
	var node = treeObj.getNodeByParam("layerName", "ssjk_"+est_type, null);
	if(!node)
	   return;
	node.checked = true ;
	treeObj.updateNode(node);
	var parentNode = node.getParentNode();
	$(parentNode).each(function(index,node) {
        treeObj.updateNode(node);
    });
	showLayer(true,"ssjk_"+est_type);
}

//图例的循环加入数组
function hideAllLayer(){
	for (i in graphicsNNArr){
		graphicsNNArr[i].hide();
	}
}
//获取当前时间并格式化
function CurentTime()  
{   
    var now = new Date();  
      
    var year = now.getFullYear();       //年  
    var month = now.getMonth() + 1;     //月  
    var day = now.getDate();            //日  
      
    var hh = now.getHours();            //时  
    var mm = now.getMinutes();          //分  
    var ss = now.getSeconds();           //秒  
      
    var clock = year + "-";  
      
    if(month < 10)  
        clock += "0";  
      
    clock += month + "-";  
      
    if(day < 10)  
        clock += "0";  
          
    clock += day + " ";  
      
    if(hh < 10)  
        clock += "0";  
          
    clock += hh + ":";  
    if (mm < 10) clock += '0';   
    clock += mm + ":";   
       
    if (ss < 10) clock += '0';   
    clock += ss;   
    return(clock);   
}
/*map.on("click", function (g) {
	console.log(g.mapPoint.x+","+g.mapPoint.y);
}*/
//map.infoWindow.hide();
/*if(roadIndet)
	identityRoad(g.mapPoint);
if(!g.graphic)
	$("#clickMenu").remove();*/
//});
//天地图加载
// 底图、影像图、水利设施
/*  var tdtvecLayer = new tdt.TDTLayer("vec",{visible:true,id:'vec'}); 
map.addLayer(tdtvecLayer);
var tdtcvaLayer = new tdt.TDTLayer("cva",{visible:true,id:'DiTu'});
map.addLayer(tdtcvaLayer);
var tdtimgLayer = new tdt.TDTLayer("img",{visible:false,id:'WeiXingYingXiang'});
map.addLayer(tdtimgLayer);
//影像图的标注
var tdtciaLayer = new tdt.TDTLayer("cia",{visible:false,id:'WeiXingYingXiang_cia'});
map.addLayer(tdtciaLayer);*/

//这里显示上报设施数量显示到地图上面
require(["dojo/ready"], function (ready) {
    ready(function () {
    	$.ajax({
			method : 'get',
			//url: '/' + serverName + '/lack-mark!showAreaData.action',
			url:'/psxj/lack-mark!showAreaData.action',
			dataType: 'json',
			success : function(areaData){
				loadEcharData(areaData);
			}
    	});
     });
});
//var pipemarkerSymbols,pipelineSymbol;
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
	//pipelineSymbol=(new esri.symbol.SimpleLineSymbol()).setColor(new esri.Color("#81C0C0")).setWidth(5);//.setStyle("opacity:0.4");
	//pipemarkerSymbols=(new esri.symbol.SimpleMarkerSymbol()).setColor(new esri.Color("#81C0C0")).setSize(26).setOutline(pipelineSymbol);//.setStyle("opacity:0.4");
	var font = new esri.symbol.Font("17px",esri.symbol.Font.VARIANT_NORMAL, esri.symbol.Font.WEIGHT_BOLD,"Courier");//Font.STYLE_ITALIC,
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
		//graphic.setSymbol(pipemarkerSymbols);
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
		//console.log(g);
	});
}