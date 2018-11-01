//数据填充	    
function getQueryStr(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = decodeURI(window.location.search).substr(1).match(reg);
	if (r != null) 
		return unescape(r[2]);
	return "";
}
var yaCityId=getQueryStr("yaCityId");
if(!yaCityId)
	searchSms(11);
var showStart=getQueryStr("showStart");
var meteoHydrologAlarmId=getQueryStr("meteoHydrologAlarmId");
var setting = {
	check: {
		enable: true,
		chkStyle : "checkbox",
		chkboxType: { "Y": "s", "N": "s" }
	},
	data: {
		key: {name: "orgName"},
		simpleData: {
			enable: true,
			idKey: "orgId",
			pIdKey: "parentOrgId",
			rootPId: 0
		}
	}
};

$(function(){
	if(showStart!=""){
	    $("#startBtn").hide();	            
	}
	$.ajax({
		method : 'GET',
		url : '/agsupport/ya-record-city!inputJson.action?id='+yaCityId,
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
			
			var dsblNodes = $.fn.zTree.getZTreeObj("templateSmsReceiver").getNodesByParam("chkDisabled", false);
			for (var i=0, l=dsblNodes.length; i < l; i++) {
				// 禁用状态
			    $.fn.zTree.getZTreeObj("templateSmsReceiver").setChkDisabled(dsblNodes[i], true);
			}
			/*$.fn.zTree.init($("#recordNoteDistrict"), setting,orgTree);
			dsblNodes = $.fn.zTree.getZTreeObj("recordNoteDistrict").getNodesByParam("chkDisabled", false);
			for (var i=0, l=dsblNodes.length; i < l; i++) {
			    // 禁用状态
			    $.fn.zTree.getZTreeObj("recordNoteDistrict").setChkDisabled(dsblNodes[i], true);
			}*/
			
			for (var key in data.form){
				if(key.toLowerCase().indexOf("id")!=-1)
					$("#templateId").val(data.form[key]);
				else if(key.toLowerCase().indexOf("time")!=-1&&data.form[key]!=null)
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
				} 
				else
				   	$("#"+key).val(data.form[key]);
			}
		},
		error : function() {
			alert('error');
		}
	});
});

function setmeteoHydrologAlarmTb(cityYaId,id){
	$.ajax({
		type: 'post',
		url : '/agsupport/meteo-hydrolog-alarm!updateSatus.action',
		data:{"id":id,"cityYaId":cityYaId},
		dataType : 'json',  
		success : function(data) {},
		error : function() {
			alert('error');
		}
	});
}
		
function start(){			
	parent.layer.open({
		type: 2,
		title: '选择启动应急预警模板',
		shadeClose: false,
		shade: 0,
		maxmin: true,
		area: ['700px', '400px'],
		content: '/awater/nnwaterSystem/EmergenControl/District/Template/Template_Alarm_List.html?yaCityId='+yaCityId  						 
	}); 	
	var index = parent.layer.getFrameIndex(window.name);
	parent.layer.close(index);
}
		
function cancel(){
    parent.layer.close(parent.layer.getFrameIndex(window.name));
}
		
function searchSms(value){
	var dataparms={alarmType : value};
	$.ajax({
		type: 'post',
		url : '/agsupport/ya-temlate-sms!listSmsMessageAjax.action',
		data : dataparms,
		dataType : 'json',
		success : function(data){
			$.each(eval(data.rows), function(){
				//$("#templateSms").val(this.TEMPLATE_CONTET);
				this.TEMPLATE_CONTET? $("#templateSms").val(this.TEMPLATE_CONTET) : $("#templateSms").val("");
			});
		},
		error : function(){
		}
	});
}
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