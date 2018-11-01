
(function($){
	$(window).load(function(){
		$("#content").mCustomScrollbar();
		$("#templateCreateTime").datetimepicker({
           	language: 'zh-CN',
		  	format: 'yyyy-mm-dd hh:ii:ss',
		  	autoclose:true,
		  	pickerPosition:'top-right'
		});
	});
})(jQuery);


//数据填充	    
function getQueryStr(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = decodeURI(window.location.search).substr(1).match(reg);
	if (r != null) 
		return unescape(r[2]);
	return "";
}
var template_id=getQueryStr("template_id");
if(!template_id)
	searchSms(11);

var meteoHydrologAlarmId=getQueryStr("meteoHydrologAlarmId");
var setting = {
	check: {
		enable: true,
		chkStyle : "checkbox",
		chkboxType: { "Y": "s", "N": "s" }
	},
	data: {
		key: {
			name: "orgName"
		},
		simpleData: {
			enable: true,
			idKey: "orgId",
			pIdKey: "parentOrgId",
			rootPId: 0
		}
	}
};
	    
$(function(){
	ajaxJsonTemplate();
});
//加载信息
function ajaxJsonTemplate(){
	$.ajax({
		method : 'GET',
		url : '/agsupport/ya-template-city!inputJson.action?id='+template_id,
		async : true,
		dataType : 'json',
		success : function(data) {
			var dictionary=data.Dict;
			for (itemname in dictionary){
				for (num in dictionary[itemname]){
					var selText="";
					if(dictionary[itemname][num].itemCode==data.form[itemname])
						selText="selected='true'";
					$("#"+itemname).append("<option value='"+dictionary[itemname][num].itemCode+"' "+selText+">"+dictionary[itemname][num].itemName+"</option>");
				}
			}
			
			var orgTree = data.Tbmap["orgTable"];
			$.fn.zTree.init($("#templateSmsReceiver"), setting,orgTree);
			//$.fn.zTree.init($("#recordNoteDistrict"), setting,orgTree);
			
			for (var key in data.form){
				if(key.toLowerCase().indexOf("id")!=-1)
					$("#templateId").val(data.form[key]);
				else if(key.toLowerCase().indexOf("time")!=-1)
					$("#"+key).val(getLocalTime(data.form[key].time));
				/*else if(key=="recordNoteDistrict"){
					var strArray=data.form[key].split(",");
					var zTree = $.fn.zTree.getZTreeObj("recordNoteDistrict");
					for(var i=0;i<strArray.length;i++){
						var node = zTree.getNodeByParam("orgId",strArray[i]);
						if(node!=null){
							node.checked = true;
							zTree.updateNode(node);
						}
					}
				}*/ 
				else if(key=="templateSmsReceiver"){
					var strArray=data.form[key].split(",");
					var zTree = $.fn.zTree.getZTreeObj("templateSmsReceiver");
					for(var i=0;i<strArray.length;i++){
						var node = zTree.getNodeByParam("orgId",strArray[i]);
						if(node!=null){
							node.checked = true;
							zTree.updateNode(node);
						}
					}
				}else if(key=="templateSms"){
					searchSms(11);
				}else
			   	$("#"+key).val(data.form[key]);
			}
		},
		error : function() {
			parent.layer.msg('error');
		}
	});
}
function checkAndSave(){
	$.ajax({  
	    url: "/agsupport/ya-record-city!checkStatus.action",  
	    async:false,
	    type: "get",
	    dataType: "json",
	    success: function(data) {
	    	if(data.statusId==0){
    			//未启动预案
    			save();
    		} else if(data.statusId==1){
    			//启动中
    			parent.layer.msg("启动预案失败，当前已有预案启动中");
    		} else {
    			//未知状态
    			parent.layer.msg("启动预案失败，未知错误");
    		}
	    },
	    error:function(){
	    	parent.layer.msg("检查成员单位预案状态失败");
	    }
	});
}
function save(){
	var dataparam=getStrParamByArray($("#form").serializeArray());
	$.ajax({
		type: 'post',
		url : '/agsupport/ya-record-city!saveJson.action',
		data: dataparam,
		dataType : 'json',  
		success : function(data) {
			parent.layer.msg(data.result);
			if(data.status=="200"){
				parent.createNewtab("/awater/nnwaterSystem/EmergenControl/Municipal/Supervise/Supervise.html?id="+data.record_id,"市级调度");								
			}
			var index = parent.layer.getFrameIndex(window.name);
			window.parent.layer.close(index);
		},
		error : function(){
			parent.layer.msg('启动预案失败');
		}
	});
}

function getStrParamByArray(array){
	var param="";
	for (pitem in array){
		if(param!=""){
			if(array[pitem].name.toLowerCase().indexOf("time")!=-1){
				param+="&"+array[pitem].name+"="+encodeURIComponent(getTimeLong(array[pitem].value));
			} else
				param+="&"+array[pitem].name+"="+encodeURIComponent(array[pitem].value);
		}
		else{
			if(array[pitem].name.toLowerCase().indexOf("time")!=-1){
				param=array[pitem].name+"="+encodeURIComponent(getTimeLong(array[pitem].value));
			} else
				param=array[pitem].name+"="+encodeURIComponent(array[pitem].value);
		}
	}
	
	//添加机构树状参数
	var treeObj=$.fn.zTree.getZTreeObj("templateSmsReceiver"),
    nodes=treeObj.getCheckedNodes(true),
    checkIds="";
    for(var i=0;i<nodes.length;i++){
    	if(checkIds=="")
    		checkIds=nodes[i].orgId;
    	else
    		checkIds+= ","+nodes[i].orgId;
    }
    param+="&templateSmsReceiver="+encodeURIComponent(checkIds);
	//param+="&recordNoteDistrict="+encodeURIComponent(checkIds);
    param+="&meteoHydrologAlarmId="+meteoHydrologAlarmId;
	return param;
}
		
function cancel(){
	parent.layer.close(parent.layer.getFrameIndex(window.name));
}
//加载启动响应的短信模板
function searchSms(value){
	var dataparms={
		alarmType : value,
	};
	$.ajax({
		type: 'post',
		url : '/agsupport/ya-temlate-sms!listSmsMessageAjax.action',
		data : dataparms,
		dataType : 'json',
		success : function(data){
			$.each(eval(data.rows), function(){
				this.TEMPLATE_CONTET? $("#templateSms").val(this.TEMPLATE_CONTET) : $("#templateSms").val("");
			});
			searchWeather();
		},
		error : function(){
		}
	});
}
// 加载预警信息的气象发布时间信息
function searchWeather(){
	var meid = meteoHydrologAlarmId
	if(meid)
		$.ajax({
			type: 'get',
			url:'/agsupport/meteo-hydrolog-alarm!inputJson.action?id='+meid,
			dataType : 'json',
			success : function(data){
				var alarmName=$("#templateName").val().replace('级应急响应','');
				var title=data.form.alarmTitle.replace('预警','');
				var altime=new Date(data.form.alarmTime.time).FormatNew("yyyy年MM月dd日hh时mm分");
				var content=data.form.alarmContent;
				var newTime=new Date().FormatNew("yyyy年MM月dd日hh时mm分");
				
				//得到短信模板变量
				var smsVal=$("#templateSms").val();
				var r= /\{(.+?)\}/g;
				var res = smsVal.match(r);
				for(key in res){
					if(res[key].indexOf('{alarmTime}')>-1) smsVal=smsVal.replace('$'+res[key],altime.toString().split('年')[1]);
					if(res[key].indexOf('{time}')>-1) smsVal=smsVal.replace('$'+res[key],newTime.toString().split('年')[1]);
					if(res[key].indexOf('{alarm}')>-1) smsVal=smsVal.replace('$'+res[key],title);
					if(res[key].indexOf('{grade}')>-1) smsVal=smsVal.replace('$'+res[key],alarmName);
				}
				$("#templateSms").val(smsVal);
			},error:function(){}
		});
}