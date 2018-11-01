/**
 * 设施监测数据
 */
var ssjkBasicData=null;//设施监控基础数据，包含所有设施，设备，监控项信息

/**
 * 设施监控实例化
 */
function ssjkInit(){
	getAllMonitorStation();
	//getWechatFloodrecord(new Date());
}

/**
 * 1.1	获取所有设施以及关联设备信息基本信息
 *  @param returnOp 操作，请求后操作操作
 */
function getAllMonitorStation(returnOp){
	$.ajax({ url: "/agsupport/rest/pscomb/getAllMonitorStationNew?d="+new Date(), 
		data:{},
		dataType:'json',
		success: function(results){
			if(returnOp==null){
				ssjkBasicData=results;
				addAllMonitorStation(results);//添加所有设施
				getMonitorStationDefaultShow();//添加地图监测数据				
			}
		},
		error:function(e){
			alert("error")
		}
	});	
}

/**
 *  1.2	获取设施关联设备以及监控项总体数值
 * @param combId 设施ID
 * @param returnOp 操作，请求后操作操作
 */
function getMonitorStationByCombId(combId,returnOp){
	$.ajax({ url: "/agsupport/rest/pscomb/getMonitorStationByCombId/"+"?d="+new Date(), 
		data:{},
		dataType:'json',
		success: function(results){
			if(returnOp==null){
				changeAllDimItemValue(results);
			}
		},
		error:function(){
		}
	});		
}

/**
 * 改变弹出框的详细信息的值
 * 该方法可以预留实时刷新值使用
 * @param results
 */
function changeAllDimItemValue(results){
	//1 设施
	var stations=results.rows;
	for(var i=0;i<stations.length;i++){
		var station=stations[i];
		var combId=station.combId;
		//2 设备
		var devices=station.device;		
		if(devices==null){
			continue;
		}
		for(var j=0;j<devices.length;j++){
			var device= devices[j];
			var deviceId=device.deviceId;
			// 3监控项
			var itemDims=device.itemDimData;
			for(var k=0;k<itemDims.length;k++){
				var itemDim=itemDims[k];
				var itemDimId=itemDim.itemid;
				var d_value1=itemDim.d_value;
				var valueId=combId+"_"+deviceId+"_"+itemDimId;//对应弹出框页面元素的ID，结构为“设施ID_设备ID_监控项ID”
				changeDimItemValue(valueId,d_value1*100+"cm");
			}		
		}
	}
}
 

/**
 * 改变弹出框监控ID的值
 * @param valueId
 */
function changeDimItemValue(valueId,value){
	setTimeout("changeItemsValue('"+valueId+"','"+value+"')",1000);
	
}
function changeItemsValue(valueId,value){
	$("a#"+valueId).text(value); 
	//$("a id=['"+ valueId +"']").text(value);
}
/**
 * 1.3	获取所有设施默认显示数值
 * @param returnOp 操作，请求后操作操作
 */
function getMonitorStationDefaultShow(returnOp){
	$.ajax({ url: "/agsupport/rest/pscomb/getMonitorStationDefaultShow?d="+new Date(), 
		data:{},
		dataType:'json',
		success: function(results){
			addMonitorStationLable(results);
		},
		error:function(){
			
		}
	});	
}

/**
 * 1.4	获取单个监控项详细信息
 * @param itemDimId 监测项ID
 * @param returnOp 操作，请求后操作操作
 */
function getItemDimInfo(itemDimId,returnOp){
	$.ajax({ url: "/agsupport/rest/psitemdim/getItemDimInfo/"+itemDimId+"?d="+new Date(), 
		data:{},
		dataType:'json',
		success: function(results){
			if(returnOp==null){
				alert(results);
			}
		},
		error:function(){
			
		}
	});	
}

/**
 * 1.5	获取单个监控项数值
 * @param itemDimId 监测项ID
 * @param returnOp 操作，请求后操作操作
 */
function getItemDimRealData(itemDimId,returnOp){
	$.ajax({ url: "/agsupport/rest/psitemdim/getItemDimRealData/"+itemDimId+"?d="+new Date(), 
		data:{},
		dataType:'json',
		success: function(results){
			if(returnOp==null){
				alert(results);
			}
		},
		error:function(){
			
		}
	});	
}

function getWechatFloodrecord(time,returnOp){
	$.ajax({ url: "/agsupport/rest/jkalarm/getWechatFloodrecord?d="+Date.parse(time), 
		data:{},
		dataType:'json',
		success: function(results){
		
		},
		error:function(e){
			alter("error")
		}
	});	
}

/**
 * 1.1	获取指定类型设施以及关联设备信息基本信息
 *  @param returnOp 操作，请求后操作操作
 */
function getMonitorStationByEstType(layerId){
	if(layerId&&layerId.split("_")[1]){
		$.ajax({ url: "/agsupport/rest/pscomb/getAllMonitorStationNew?d="+new Date(), 
			data:{estType:layerId.split("_")[1]},
			dataType:'json',
			success: function(results){
				addMonitorStationByEstType(results);//添加所有设施	
			},
			error:function(e){
				alert("error")
			}
		});
	}	
}
