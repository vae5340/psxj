/*
 * 设施监控弹出监控项总体页面
 * 1.点击设施
 * 2.通过设施ID获取
 * */

$(function(){
	var combId= request("combId");
	//combId=123;
	getMonitorStationByCombId(combId);
});

/**
 * 构造监控项弹出框
 * @param results
 */
function bulidDimMain(results){
	var dimMain=[];
	
	//1.获取第一个设施
	if(results.rows.length<1){
		return;
	}
	var comb=results.rows[0];			
	//2.获取设备
	var devices=comb.device;
	var i=0;
	var index=0;
	for(i;i<devices.length;i++){
		var device=devices[i];				
		//3.获取监控项
		var itemDims=device.itemDim;
		//如果没有设备没有设施，调过构造
		if(itemDims.length<1){
			continue;
		}
		
		//监测项新
		var itemDim=itemDims[0];
		var dimId=itemDim.id;
		var dimType=itemDim.itemType;
		var videoUrl=itemDim.videoUrl;
		var itmeId=itemDim.itemId;
		//配置信息
		var dimTypeName=dimTypes[dimType].name;
		var dimPage=dimTypes[dimType].page;
		var dimHisPage=dimTypes[dimType].hisPage;
		var userPage=dimTypes[dimType].userPage;//是否使用配置的URL地址
		//构造页面元素
		var tabId= dimType+"_Tab";
		//使用配置页面
		if(userPage==1){
			//设备第一个监控项
			if(index==0){
				//实时
				if(dimPage){
					$('#myTab').append('<li class="active"><a href="#'+tabId+'" data-toggle="tab">'+dimTypeName+'</a></li>');
					$('#myTabContent').append('<div class="tab-pane fade in active" id="'+tabId+'"><iframe class="dimIframe" src="'+dimPage+'?dimID='+dimId+'&itemID='+itmeId+'"></iframe></div>');
				}
				//历史
				if(dimHisPage){
					$('#myTab').append('<li><a href="#'+"His_"+tabId+'" data-toggle="tab">'+'历史'+dimTypeName+'</a></li>');
					$('#myTabContent').append('<div class="tab-pane fade" id="'+"His_"+tabId+'"><iframe class="dimIframe" src="'+dimHisPage+'?dimID='+dimId+'&itemID='+itmeId+'"></iframe></div>');
				}
				if(itemDim.fileGroupId!=null){
					//添加设备图片
					$('#myTab').append('<li><a href="#sbPic" data-toggle="tab">图片展示</a></li>');
					$('#myTabContent').append('<div class="tab-pane fade" id="sbPic"><iframe class="dimIframe" src="ssjk-dim-pic.html?fileGroupId='+itemDim.fileGroupId+'"></iframe></div>');
				}
			}else{
				//实时
				if(dimPage){
					$('#myTab').append('<li><a href="#'+tabId+'" data-toggle="tab">'+dimTypeName+'</a></li>');
					$('#myTabContent').append('<div class="tab-pane fade" id="'+tabId+'"><iframe class="dimIframe" src="'+dimPage+'?dimID='+dimId+'&itemID='+itmeId+'"></iframe></div>');
				}
				//历史
				if(dimHisPage){
					$('#myTab').append('<li><a href="#'+"His_"+tabId+'" data-toggle="tab">'+'历史'+dimTypeName+'</a></li>');
					$('#myTabContent').append('<div class="tab-pane fade" id="'+"His_"+tabId+'"><iframe class="dimIframe" src="'+dimHisPage+'?dimID='+dimId+'&itemID='+itmeId+'"></iframe></div>');
				}
				if(itemDim.fileGroupId!=null){
					//添加设备图片
					$('#myTab').append('<li><a href="#sbPic" data-toggle="tab">图片展示</a></li>');
					$('#myTabContent').append('<div class="tab-pane fade" id="sbPic"><iframe class="dimIframe" src="ssjk-dim-pic.html?fileGroupId='+itemDim.fileGroupId+'"></iframe></div>');
				}
			}
		//使用videoUrl配置
		}else if(userPage==2){	
			//设备第一个监控项
			if(dimTypeName){				
				var status = requestUrl("status",videoUrl);
				var ull = "";
				if(status == 1){ ull = '<font color="#00FF7F" id="online">(在线)</font>';}
				if(status == 3){ ull = '<font color="red" id="offline">(离线)</font>';}
				if(status == 2){ ull = '<font color="red" id="fault">(故障)</font>';}
				
				if(index==0){
					$('#myTab').append('<li class="active"><a href="#'+tabId+'" data-toggle="tab">'+dimTypeName+ull+'</a></li>');
					$('#myTabContent').append('<div class="tab-pane fade in active" id="'+tabId+'"><iframe class="dimIframe" src="'+videoUrl+'"></iframe></div>');
				}else{
					$(document.body).on('click','#'+tabId+'_li',function(event){					
						if($('#'+tabId).html()!=null && $('#'+tabId).html()!=""){
							
						}else{
							$('#'+tabId).html('<iframe class="dimIframe" src='+videoUrl+'></iframe>');
						}
					});
					$('#myTab').append('<li><a id="'+tabId+'_li" href="#'+tabId+'"  data-toggle="tab">'+dimTypeName+ull+'</a></li>');
					$('#myTabContent').append('<div class="tab-pane fade" id="'+tabId+'"></div>');
				}	
				if(itemDim.fileGroupId!=null){
					//添加设备图片
					$('#myTab').append('<li><a href="#s bPic" data-toggle="tab">图片展示</a></li>');
					$('#myTabContent').append('<div class="tab-pane fade" id="sbPic"><iframe class="dimIframe" src="ssjk-dim-pic.html?fileGroupId='+itemDim.fileGroupId+'"></iframe></div>');
				}
			}
		} else if(userPage==3){
			//设备第一个监控项
			if(dimTypeName){								
				if(index==0){
					$('#myTab').append('<li class="active"><a href="#'+tabId+'" data-toggle="tab">'+dimTypeName+'</a></li>');
//					$('#myTabContent').append('<div class="tab-pane fade in active" id="'+tabId+'" ><iframe class="dimIframe" src="/awater/waterSystem/ssjk/ssjk-dim-ck.html?address='+encodeURIComponent(comb.combName)+'" ></iframe></div>');
					$('#myTabContent').append('<div class="tab-pane fade in active" id="'+tabId+'" ><iframe class="dimIframe" src="'+videoUrl+'" ></iframe></div>');
				}else{
					$('#myTab').append('<li><a href="#'+tabId+'" data-toggle="tab">'+dimTypeName+'</a></li>');
					$('#myTabContent').append('<div class="tab-pane fade" id="'+tabId+'"><iframe class="dimIframe" src="'+videoUrl+'"></iframe></div>');
				}	
				if(itemDim.fileGroupId!=null){
					//添加设备图片
					$('#myTab').append('<li><a href="#sbPic" data-toggle="tab">图片展示</a></li>');
					$('#myTabContent').append('<div class="tab-pane fade" id="sbPic"><iframe class="dimIframe" src="ssjk-dim-pic.html?fileGroupId='+itemDim.fileGroupId+'"></iframe></div>');
				}
			}
		}
		index++;
	}
	if(index==0){
		$('#myTabContent').append('<a style="position: relative;top: 120px;left: 300px;font-size: 60px">无监控项</a>');
	}
}

/**
 * 点击tab触发事件
 * @param divID
 * @param divHtml
 */
function tabOnclick(divID,divHtml){
	$('#'+divID).html(divHtml);
}

//function seqDim


/**
 * 1.5	获取单个监控项数值
 * @param itemDimId 监测项ID
 * @param returnOp 操作，请求后操作操作
 */
function getMonitorStationByCombId(combId,returnOp){
	$.ajax({ url: "/agsupport/ps-comb!getMonitorStationByCombId.action?d="+new Date(), 
		data:{
			combId:combId
		},
		cache:false,
		dataType:'json',
		success: function(results){
			bulidDimMain(results);
//			if(returnOp==null){
//				setTimeout("getItemDimRealData('"+itemDimId+"')",timeNum);//放在上面，避免异常导致无法获取数据				
//				if(results.length<1){
//					return;
//				}
//				realDataLoaded=true;
//				nowvalue=results[0];//获取实时值，mm转为cm								
//			}
		},
		error:function(){
			
		}
	});	
}

/**
 * js获取url参数值
 * var De = decodeURI(request("Due"));//De=‘未设置’  
 */
function requestUrl(paras,videoUrl) {
    var url = videoUrl;
    var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
    var paraObj = { };
    for (i = 0; j = paraString[i]; i++) {
        paraObj[j.substring(0, j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=") + 1, j.length);
    }
    var returnValue = paraObj[paras.toLowerCase()];
    if (typeof (returnValue) == "undefined") {
        return "";
    } else {
        return returnValue;
    }
}