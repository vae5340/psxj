//数据填充
function getQueryStr(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = decodeURI(window.location.search).substr(1).match(reg);
	if (r != null) return unescape(r[2]); return "";
}

var yaId=getQueryStr("yaId");
$("#yaId").val(yaId);

var yaType=getQueryStr("yaType");
$("#yaType").val(yaType);

var districtUnitId=getQueryStr("districtUnitId");
$("#districtUnitId").val(districtUnitId);

var status=getQueryStr("status");
var superviseContent;

function send(){
	var sendType=0;
	if($("#superMu").is(":checked") && $("#superSms").is(":checked")){
        sendType=3;
    }else if($("#superSms").is(":checked")){
    	sendType=2;
    }else  if($("#superMu").is(":checked")){
    	sendType=1;
    }else {
    	parent.layer.msg("请选择发送方式");
    }
    
    if(sendType)
		sendType==2? sendSms() : sendMessage(sendType); 
}

function sendMessage(sendType){
	if($("#superviseContent").val().trim()==""){
		parent.layer.msg("内容不能为空！");
		return;
	}
    $.ajax({
		method : 'GET',
		url : '/agsupport/ya-supervise-log!saveJson.action',
		data:{yaId:$("#yaId").val(),yaType:$("#yaType").val(),superviseContent:$("#superviseContent").val(),superviseType:$("#superviseType").val(),districtUnitId: $("#districtUnitId").val()},
		async : true,
		dataType : 'json',
		success : function(data) {
			if(sendType===1){
				parent.layer.msg("发送成功");
			    parent.$("#supervise")[0].src=parent.$("#supervise")[0].src;							
				var index = parent.layer.getFrameIndex(window.name);
				parent.layer.close(index);
			}
			if(sendType===3){
				sendSms();
			}
		},
		error : function() {
			parent.layer.msg("发送失败");
		}
});
}
// 发送短信
function sendSms(){
		var dataparms={
			remark : $("#superviseContent").val(),
			receivePerson : districtUnitId,
			}
		$.ajax({
			method : 'post',
			url : '/agsupport/yj-sms-record!municipalSendSms.action',
			data : dataparms,
			dataType : 'json',
			success : function(data){
				if(data.status=="200"){
					parent.layer.msg("发送成功");
				    parent.$("#supervise")[0].src=parent.$("#supervise")[0].src;							
					var index = parent.layer.getFrameIndex(window.name);
					parent.layer.close(index);
				}else if(data.status=="300"){
					parent.layer.msg("未检测到手机号，短信未发送");
					parent.$("#supervise")[0].src=parent.$("#supervise")[0].src;							
					var index = parent.layer.getFrameIndex(window.name);
					parent.layer.close(index);
				}else{
					parent.layer.msg("发送失败");
					parent.$("#supervise")[0].src=parent.$("#supervise")[0].src;							
					var index = parent.layer.getFrameIndex(window.name);
					parent.layer.close(index);
				}
			},
			error : function(){
				parent.layer.msg("发送失败");
			}
		});
}
    		
$(function(){
	if(status==0){
		//未启动
		$("#superviseType").append("<option selected='selected' value='1'>启动应急响应</option>");
		ajaxSmsContent();
	} else if(status==1) {
		//已启动
		$("#superviseType").append("<option value='2'>提交事中报告</option>");
		$("#superviseType").append("<option value='3'>结束预案督办</option>");
		$("#superviseType").append("<option value='4'>抢险通知督办</option>");
		ajaxSmsContent();
	}
    
	$("#superviseType").change(function(){
		ajaxSmsContent();
	});
});
//加载短信内容
function ajaxSmsContent(){
	$("#test").hide();
		$("#superviseContent").html("");
		var type = $("#superviseType").val();
		if(type)
			$.ajax({
				type: 'post',
				url : '/agsupport/ya-temlate-sms!getAlarmTypeSms.action',
				data : {alarmType:type},
				dataType:'json',
				success : function(data){
					if(data.rows[0]){
						$.each(eval(data.rows), function(){
							if(this.TEMPLATE_CONTET)
								$("#superviseContent").html(this.TEMPLATE_CONTET);
						});
					}else{
						parent.layer.msg("短信模板未添加");
					}
				},error : function(){
					parent.layer.msg("加载失败");
				}
	   		}); 
}
 		
function closeWindow(){
	var index = parent.layer.getFrameIndex(window.name);
	parent.layer.close(index);
}