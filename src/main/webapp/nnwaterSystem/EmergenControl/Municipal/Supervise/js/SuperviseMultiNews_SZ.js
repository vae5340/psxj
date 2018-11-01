//数据填充	    
function getQueryStr(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = decodeURI(window.location.search).substr(1).match(reg);
	if (r != null) 
	   return unescape(r[2]);
	return "";
}

var yaId=getQueryStr("yaId");
$("#yaId").val(yaId);
var yaType=getQueryStr("yaType");
$("#yaType").val(yaType);
var type=getQueryStr("type");

$(function(){
	ajaxSmsConetnt(2); // 提交事中报告 短信默认类型为2
});

function send(){
	var sendType;
	if($("#sendSuper").is(":checked") && $("#sendSuperSms").is(":checked")){
		sendType=3
	}else if($("#sendSuper").is(":checked")) {
		sendType=1;
    } else if($("#sendSuperSms").is(":checked")) {
    	sendType=2;
    } else {
    	parent.layer.msg("请选择发送方式");
    }
    if(sendType)
    	sendType==2? sendSmsContent() : sendMessage(sendType);
}
 
function sendMessage(sendType){	
	if($("#superviseContent").val().trim()==""){
		parent.layer.msg("内容不能为空！")
		return;
	}
	$.ajax({
		method : 'GET',
		url : '/agsupport/ya-supervise-log!saveJsonList.action',
		data:{yaId:$("#yaId").val(),yaType:$("#yaType").val(),superviseContent:$("#superviseContent").val(),superviseType:type},
		dataType : 'json',
		success : function(data) {	
			if(sendType==1){
			    parent.layer.msg(data.result);
			    parent.$("#supervise")[0].src=parent.$("#supervise")[0].src;															    
				var index = parent.layer.getFrameIndex(window.name);
			    parent.layer.close(index);		
			    parent.location.reload();	
		    }
		    if(sendType==3){
		    	sendSmsContent();
		    }										    							
		},
		error : function() {
			alert("error");
		}
	});
}
function sendSmsContent(){
	var smsContent = $("#superviseContent").val();
	if(smsContent)
		var dataparms={
			remark : smsContent,
			}
		$.ajax({
			method : 'post',
			url : '/agsupport/yj-sms-record!municSendSmsAll.action',
			data : dataparms,
			dataType : 'json',
			success : function(data){
				if(data.status=="200"){
					parent.layer.msg(data.result);
				    parent.$("#supervise")[0].src=parent.$("#supervise")[0].src;															    
					var index = parent.layer.getFrameIndex(window.name);
				    parent.layer.close(index);		
				    parent.location.reload();
				}else{
					parent.layer.msg("用户没有完善联系方式不能发送发送");
				}
			},
			error : function(){
				parent.layer.msg("短信发送失败！");
			}
		});
}
    		
function closeWindow(){
	var index = parent.layer.getFrameIndex(window.name);
	parent.layer.close(index);
}
// 加载短信模板内容
function ajaxSmsConetnt(value){
	if(value)
		$.ajax({
			method : 'GET',
			url : '/agsupport/ya-temlate-sms!getAlarmTypeSms.action',
			data : {alarmType : value},
			dataType : 'json',
			success : function(data){
				if(data.rows[0]){	
					$.each(eval(data.rows), function(){
						$("#superviseContent").html(this.TEMPLATE_CONTET);
					});
				}else{
					parent.layer.msg("短信模板未添加");
				}
			},error : function(){}
		});
}