/**
 * 弹出框 js
 * */
var mapLayer,flag_layer = true, // 标记是否有弹出框（数据审核）
 	layerIdReport,layerIdMap, layerIdWtsb;
//加载审核图层
function createReportServer(){
	if(!map || !awater.url.url_report)
		return
	if(!layerIdMap){
		layerIdMap = map.getLayer("gw_1");
	}
	if(!layerIdWtsb){
		layerIdWtsb = map.getLayer("wtsbXx");//问题上报
	}
	if(typeof(layerIdMap)!="undefined"){
		layerIdMap.hide();
	}
	$("#checkbox_gw_1").attr('checked', false);//和主界面同步
	if(typeof(layerIdWtsb)!="undefined"){
		layerIdWtsb.hide();
	}
	$("#checkbox_wtsbXx").attr('checked', false);//和主界面同步
	$("#check_sb").prop("checked",true);//和主界面同步
    if(!layerIdReport){
    	var parentOrgName = $("#parentOrgArea").val(),parentOrgId=$("#parentOrgAreaId").val(),
    		layerDefinitions=[];
    	if(!parentOrgId){
    		//console.log(parentOrgId);
    		setTimeout("createReportServer();",1000);
    		return;
    	}
    	//console.log(parentOrgName);
    	layerIdReport = new esri.layers.ArcGISDynamicMapServiceLayer(awater.url.url_report[0],{id:awater.url.url_report[1],visable:true});
    	if(parentOrgName.indexOf('广州市水务局') == -1){
    		layerDefinitions[0] = "PARENT_ORG_ID="+parentOrgId;
    		layerIdReport.setLayerDefinitions(layerDefinitions);
    	}
    	//初始化图层时注册查询事件
		map.on('click',identityFindTask);
	}else{
    	layerIdReport.show();
    }
    map.addLayer(layerIdReport);
}
//检测是否有弹出框
function mapQuery(type){
	if(!flag_layer){
		 layer.confirm('检测到有程序正在运行，是否重新打开?', {
	         btn : [ '确定', '取消' ]//按钮
	     }, function(index) {
	         layer.close(index);
	         flag_layer=true;
	         closeJsPanel();
			 mapQueryResult(type);
	     },function(){
	    	 
	     }); 
	}else{
		mapQueryResult(type);
	}
}
//三级菜单点击弹出框
function mapQueryResult(type){
	var height=document.body.clientHeight-155;//-140
	if(!type)
		return;
	switch(type){
		case 'correctAndLack':
			createReportServer();
			openQueryPanel("/psxj/systemInfo/mapInfo/mapLayer/openLayer/mapAudit.html","数据审核",480,height);
			break;
		default:
			break;
	}
}
//显示弹出框
function openQueryPanel(url,title,width,height){
	//切换到 地图服务
	createNewtab("wrapper-map","地图服务");
	//点击三级菜单关闭伸缩
	seperatorClose();
	if(flag_layer){
		mapLayer =$.jsPanel({
			id: 'mapAudit-panel',
			contentAjax: url,
		    contentSize: {width: width, height: height},
		    //container : '#open_layer_panle',
		    theme: '#0085CA',//'primary',
		    position:{my:'right-top',at:'right-top',offsetX:-10,offsetY:115},//110
		    resizable: false,
		    draggable: {
		        disabled:  true
		    },
		    headerTitle:title,
		    headerControls: {maximize:'remove'},
		    onclosed: function () {
		    	if(layerIdReport) layerIdReport.hide();
		    	if(layerIdMap) {
		    		layerIdMap.show();
		    		$("#checkbox_gw_1").prop("checked",true);
		    	}
		    	if(layerIdWtsb) {
		    		layerIdWtsb.show();//问题上报
		    		$("#checkbox_wtsbXx").prop("checked",true);
		    	}
		    	$("#check_sb").prop("checked",false);//和主界面同步
		    	flag_layer = true;
		    },
		    callback: function(){
		    	flag_layer = false;
		    }
		});
	}
}
//关闭弹出框
function closeJsPanel(){
	mapLayer.close(false, true);
}
/**
 * 数据审核地图点击查询
 * @param point
 */
function identityFindTask(event){
	if(typeof(event.graphic)!="undefined" && typeof(event.graphic.geometry)!="undefined" && typeof(event.graphic.geometry.stateName)!="undefined"){
		return;//如果点击的是问题上报点 就不走这里，不然会覆盖问题上报的弹框
	}
	if(!layerIdReport && !layerIdMap.visible)
		return;
	map.infoWindow.hide();
	var identifyTask = new esri.tasks.IdentifyTask(awater.url.url_report[0]); 
    var identifyParams = new esri.tasks.IdentifyParameters();// 查询参数
    identifyParams.tolerance = 10;// 容差范围
    identifyParams.returnGeometry = true;// 是否返回图形
    identifyParams.layerIds = [0,1,2];// 查询图层
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
     	 var point;
         var texts="<div style=\"overflow-x: hidden;\"><ul class=\"meumul\">";
         for ( var i = 0; i < results.length; i++) {  
             feature = results[i].feature;  
             feature.setSymbol(pipefillSymbol);
             map.graphics.add(feature);
             var reportType=feature.attributes.report_type;
             if(i<6){
            	 //texts+="<li class=\"meumli\" onclick=\"alertMapOpen('"+awater.url.url_report[0]+"','"+results[i].layerId+"','"+feature.attributes.OBJECTID+"')\"><span>类型:"+(reportType=='modify'? feature.attributes.layer_name:feature.attributes.component_type )+"</span><br/>" +
            	// "<span style='font-size:11px;'>上报类型:"+(reportType=='modify'?'数据校核':'数据上报')+"</span><br/><span style='font-size:11px;'>上报时间:"+feature.attributes.mark_time+"</span></li>";
            	 texts+="<li class=\"meumli\" onclick=\"alertMapOpenLayer('"+feature.attributes.report_type+"','"+feature.attributes.OBJECTID+"')\"><span>类型:"+feature.attributes.layer_name+"</span><br/>" +
            	 "<span style='font-size:11px;'>上报编号:"+feature.attributes.OBJECTID+"</span><br/>"+
            	 "<span style='font-size:11px;'>上报类型:"+(reportType=='modify'?'数据校核':'数据新增')+"</span><br/><span style='font-size:11px;'>上报时间:"+feature.attributes.mark_time+"</span></li>";
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
function alertMapOpenLayer(reportType,objectid){
	if(reportType && objectid){
		//console.log(reportType,objectid);
		$.ajax({
			type: 'post',
			url: '/psxj/correctMark/getFormId',
			data: {isCheck : reportType, objectId:objectid},
			dataType:'json',
			success: function(data){
				//console.log(data);
				if(data.success && data.data){
					var url_ = "";
					if(reportType == "modify"){
						url_="/psxj/systemInfo/ssxjxt/problem_report/parts_correct/correctInput.html?id="+data.data;
					}else if(reportType == "add"){
						url_="/psxj/systemInfo/ssxjxt/problem_report/parts_lack/lackInput.html?id="+data.data;
					}else if(reportType == "confirm"){
						url_="/psxj/systemInfo/ssxjxt/problem_report/parts_lack/affirmInput.html?id="+data.data;
					}
					layer.open({
	               	    type: 2,
              			area: ['1100px', '600px'],
              			maxmin: true,
              			zIndex:20000,
              			title : "查看"+(reportType=='modify'?'纠错':'上报')+"信息",	
              			btn:['确定','取消'],
              			content: [url_,'yes']
	                  });
				}else{
					layer.msg("未检测到上报信息!",{icon:2});
				}
			}
		});
	}
}
function formatDate(sjc){
	 var timestamp4 = new Date(sjc);//直接用 new Date(时间戳) 格式转化获得当前时间

	 return timestamp4.toLocaleDateString().replace(/\//g, "-") + " " + timestamp4.toTimeString().substr(0, 8);
}
function alertMapOpen(url,layerId,objId){
	var query = new esri.tasks.Query();
	var queryTask= new esri.tasks.QueryTask(url+"/"+layerId);
	 query.outFields = ["*"];
	query.where = "OBJECTID="+objId;
	queryTask.execute(query,function(result){
		var atter = result.features[0];
		$("#mapInfo_list #mapInfo").html("");
		var moadl=$("#mapInfo_content #mapInfo_list");
		if(moadl && moadl instanceof Object){
			$("#myModalLabel_title").empty();
		    $("#myModalLabel_title").html("详情");
			$("#mapInfo_list").modal('show');
		}
		$("#mapInfo_list #mapInfo").load("/psxj/systemInfo/mapInfo/mapLayer/openLayer/mapAuditInfo.html",
					function(){
			for(i in atter.attributes){
				var k=null,item=null;
				k=i.toLowerCase(),item= atter.attributes[i];
				if(k=='mark_time') item=getLocalTime(item);
				if(k=='report_type'){
					if(atter.attributes[i]=='modify'){
						item='数据纠错';
					}else{
						item='数据上报';
						$("#correct_type").parent().parent().hide();
					}
				}
				$("#mapInfo_list #mapInfo #"+k).val(item);
				if(k == 'layer_name' && item){
					if(item && item.indexOf('窨井') != -1){
						$("#attr_attrOne").html("窨井类型");
						$("#attr_attrTwo").html("类别");
						$("#attr_attrThree").html("井盖材质");
						$("#attr_attrFour").html("权属单位");
					}else if(item && item.indexOf('雨水口') != -1){
						$("#attr_attrOne").html("特征");
						$("#attr_attrTwo").html("雨水篦类型");
						$("#attr_attrThree").html("形式");
						$("#attr_attrFour").html("权属单位");
					}else if(item && item.indexOf('排放口') != -1){
						$("#attr_attrOne").html("排放去向");
						$("#attr_attrTwo").html("类别");
						$("#attr_attrThree").html("权属单位");
						$("#attr_attrFour").hide();
						$("#attrFour_div").hide();
					}
					$("#mapInfo_list #mapInfo div.form-group.attr").each(function(index,item){
						if($(item).css('display') == 'none'){
							$(item).show();
						}
					})
				}
			}
			$('#mapInfo_list #mapInfo input').attr('readonly','readonly');
			$('#mapInfo_list #mapInfo textarea').attr('readonly','readonly');
		});
		
	});
}